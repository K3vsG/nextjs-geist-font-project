import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Visit, VisitFormData } from '@/types';
import { generateQRCode, generateVisitQRData } from '@/lib/qr-utils';

export const createVisit = async (
  visitData: VisitFormData, 
  residentId: string, 
  residentName: string, 
  residentApartment: string
): Promise<string> => {
  try {
    // Create visit document
    const visitDoc = await addDoc(collection(db, 'visits'), {
      ...visitData,
      residentId,
      residentName,
      residentApartment,
      status: 'pendiente',
      qrCode: '', // Will be updated after generating
      createdAt: new Date()
    });

    // Generate QR code data
    const qrData = generateVisitQRData(
      visitDoc.id, 
      visitData.visitorName, 
      residentApartment, 
      visitData.date
    );
    
    // Generate QR code
    const qrCodeDataURL = await generateQRCode(qrData);

    // Update visit with QR code
    await updateDoc(visitDoc, {
      qrCode: qrCodeDataURL
    });

    return visitDoc.id;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw new Error('Failed to create visit');
  }
};

export const getVisitsByResident = async (residentId: string): Promise<Visit[]> => {
  try {
    const q = query(
      collection(db, 'visits'),
      where('residentId', '==', residentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const visits: Visit[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visits.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        authorizedAt: data.authorizedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Visit);
    });
    
    return visits;
  } catch (error) {
    console.error('Error getting visits:', error);
    throw new Error('Failed to get visits');
  }
};

export const getAllVisits = async (): Promise<Visit[]> => {
  try {
    const q = query(
      collection(db, 'visits'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const visits: Visit[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visits.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        authorizedAt: data.authorizedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Visit);
    });
    
    return visits;
  } catch (error) {
    console.error('Error getting all visits:', error);
    throw new Error('Failed to get visits');
  }
};

export const getVisitsByDate = async (date: string): Promise<Visit[]> => {
  try {
    const q = query(
      collection(db, 'visits'),
      where('date', '==', date),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const visits: Visit[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visits.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        authorizedAt: data.authorizedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Visit);
    });
    
    return visits;
  } catch (error) {
    console.error('Error getting visits by date:', error);
    throw new Error('Failed to get visits');
  }
};

export const getVisitById = async (visitId: string): Promise<Visit | null> => {
  try {
    const visitDoc = await getDoc(doc(db, 'visits', visitId));
    
    if (!visitDoc.exists()) {
      return null;
    }
    
    const data = visitDoc.data();
    return {
      id: visitDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      authorizedAt: data.authorizedAt?.toDate(),
      completedAt: data.completedAt?.toDate()
    } as Visit;
  } catch (error) {
    console.error('Error getting visit by ID:', error);
    throw new Error('Failed to get visit');
  }
};

export const updateVisitStatus = async (
  visitId: string, 
  status: Visit['status'], 
  authorizedBy?: string
): Promise<void> => {
  try {
    const updateData: any = { status };
    
    if (status === 'autorizada' && authorizedBy) {
      updateData.authorizedBy = authorizedBy;
      updateData.authorizedAt = new Date();
    }
    
    if (status === 'completada') {
      updateData.completedAt = new Date();
    }
    
    await updateDoc(doc(db, 'visits', visitId), updateData);
  } catch (error) {
    console.error('Error updating visit status:', error);
    throw new Error('Failed to update visit status');
  }
};

export const getTodayVisits = async (): Promise<Visit[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getVisitsByDate(today);
};
