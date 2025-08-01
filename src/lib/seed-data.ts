import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { generateQRCode, generateVisitQRData } from '@/lib/qr-utils';

export const createSampleUsers = async () => {
  try {
    // Create Admin User
    const adminUser = await createUserWithEmailAndPassword(auth, 'admin@residencial.com', 'admin123');
    await setDoc(doc(db, 'users', adminUser.user.uid), {
      email: 'admin@residencial.com',
      role: 'admin',
      name: 'Administrador Principal',
      apartment: 'Oficina Admin',
      phone: '+57 300 000 0001',
      createdAt: new Date()
    });

    // Create Security User
    const securityUser = await createUserWithEmailAndPassword(auth, 'security@residencial.com', 'security123');
    await setDoc(doc(db, 'users', securityUser.user.uid), {
      email: 'security@residencial.com',
      role: 'security',
      name: 'Vigilante Principal',
      apartment: 'Portería',
      phone: '+57 300 000 0002',
      createdAt: new Date()
    });

    // Create Resident User
    const residentUser = await createUserWithEmailAndPassword(auth, 'resident@residencial.com', 'resident123');
    await setDoc(doc(db, 'users', residentUser.user.uid), {
      email: 'resident@residencial.com',
      role: 'resident',
      name: 'Juan Carlos Pérez',
      apartment: '101',
      phone: '+57 300 000 0003',
      createdAt: new Date()
    });

    // Create additional residents
    const resident2 = await createUserWithEmailAndPassword(auth, 'maria@residencial.com', 'resident123');
    await setDoc(doc(db, 'users', resident2.user.uid), {
      email: 'maria@residencial.com',
      role: 'resident',
      name: 'María González',
      apartment: '205',
      phone: '+57 300 000 0004',
      createdAt: new Date()
    });

    console.log('Sample users created successfully');
    return {
      admin: adminUser.user.uid,
      security: securityUser.user.uid,
      resident: residentUser.user.uid,
      resident2: resident2.user.uid
    };
  } catch (error) {
    console.error('Error creating sample users:', error);
    throw error;
  }
};

export const createSampleVisits = async (userIds: any) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Visit 1 - Pending
    const visit1Data = {
      visitorName: 'María García',
      phone: '+57 300 123 4567',
      date: today,
      time: '14:30',
      reason: 'Personal',
      comments: 'Visita familiar',
      residentId: userIds.resident,
      residentName: 'Juan Carlos Pérez',
      residentApartment: '101',
      status: 'pendiente',
      createdAt: new Date()
    };

    const visit1Doc = await addDoc(collection(db, 'visits'), visit1Data);
    const qrData1 = generateVisitQRData(visit1Doc.id, visit1Data.visitorName, visit1Data.residentApartment, visit1Data.date);
    const qrCode1 = await generateQRCode(qrData1);
    await setDoc(visit1Doc, { ...visit1Data, qrCode: qrCode1 });

    // Visit 2 - Authorized
    const visit2Data = {
      visitorName: 'Carlos Delivery',
      phone: '+57 300 987 6543',
      date: today,
      time: '16:00',
      reason: 'Entrega',
      comments: 'Entrega de paquete de Amazon',
      residentId: userIds.resident2,
      residentName: 'María González',
      residentApartment: '205',
      status: 'autorizada',
      authorizedBy: 'Administrador Principal',
      authorizedAt: new Date(),
      createdAt: new Date()
    };

    const visit2Doc = await addDoc(collection(db, 'visits'), visit2Data);
    const qrData2 = generateVisitQRData(visit2Doc.id, visit2Data.visitorName, visit2Data.residentApartment, visit2Data.date);
    const qrCode2 = await generateQRCode(qrData2);
    await setDoc(visit2Doc, { ...visit2Data, qrCode: qrCode2 });

    // Visit 3 - Completed
    const visit3Data = {
      visitorName: 'Ana Técnico',
      phone: '+57 300 555 1234',
      date: today,
      time: '10:00',
      reason: 'Servicio',
      comments: 'Reparación de aire acondicionado',
      residentId: userIds.resident,
      residentName: 'Juan Carlos Pérez',
      residentApartment: '101',
      status: 'completada',
      authorizedBy: 'Administrador Principal',
      authorizedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    };

    const visit3Doc = await addDoc(collection(db, 'visits'), visit3Data);
    const qrData3 = generateVisitQRData(visit3Doc.id, visit3Data.visitorName, visit3Data.residentApartment, visit3Data.date);
    const qrCode3 = await generateQRCode(qrData3);
    await setDoc(visit3Doc, { ...visit3Data, qrCode: qrCode3 });

    // Visit 4 - Rejected
    const visit4Data = {
      visitorName: 'Pedro Sospechoso',
      phone: '+57 300 999 8888',
      date: today,
      time: '20:00',
      reason: 'Personal',
      comments: 'Visita no autorizada previamente',
      residentId: userIds.resident2,
      residentName: 'María González',
      residentApartment: '205',
      status: 'rechazada',
      authorizedBy: 'Administrador Principal',
      authorizedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    };

    const visit4Doc = await addDoc(collection(db, 'visits'), visit4Data);
    const qrData4 = generateVisitQRData(visit4Doc.id, visit4Data.visitorName, visit4Data.residentApartment, visit4Data.date);
    const qrCode4 = await generateQRCode(qrData4);
    await setDoc(visit4Doc, { ...visit4Data, qrCode: qrCode4 });

    // Visit 5 - Tomorrow (Pending)
    const visit5Data = {
      visitorName: 'Luis Amigo',
      phone: '+57 300 777 6666',
      date: tomorrow,
      time: '15:00',
      reason: 'Personal',
      comments: 'Visita programada para mañana',
      residentId: userIds.resident,
      residentName: 'Juan Carlos Pérez',
      residentApartment: '101',
      status: 'pendiente',
      createdAt: new Date()
    };

    const visit5Doc = await addDoc(collection(db, 'visits'), visit5Data);
    const qrData5 = generateVisitQRData(visit5Doc.id, visit5Data.visitorName, visit5Data.residentApartment, visit5Data.date);
    const qrCode5 = await generateQRCode(qrData5);
    await setDoc(visit5Doc, { ...visit5Data, qrCode: qrCode5 });

    console.log('Sample visits created successfully');
    return [visit1Doc.id, visit2Doc.id, visit3Doc.id, visit4Doc.id, visit5Doc.id];
  } catch (error) {
    console.error('Error creating sample visits:', error);
    throw error;
  }
};

export const initializeSampleData = async () => {
  try {
    console.log('Creating sample users...');
    const userIds = await createSampleUsers();
    
    console.log('Creating sample visits...');
    const visitIds = await createSampleVisits(userIds);
    
    console.log('Sample data initialized successfully!');
    return { userIds, visitIds };
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
};
