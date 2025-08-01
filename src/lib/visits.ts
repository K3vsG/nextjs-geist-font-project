import { Visit, VisitFormData } from '@/types';
import { generateQRCode, generateVisitQRData } from '@/lib/qr-utils';
import { mockVisitsAPI } from '@/lib/mock-data';

export const createVisit = async (
  visitData: VisitFormData, 
  residentId: string, 
  residentName: string, 
  residentApartment: string
): Promise<string> => {
  try {
    const visitId = await mockVisitsAPI.createVisit(visitData, residentId, residentName, residentApartment);
    
    // Generate QR code data
    const qrData = generateVisitQRData(
      visitId, 
      visitData.visitorName, 
      residentApartment, 
      visitData.date
    );
    
    // Generate QR code
    const qrCodeDataURL = await generateQRCode(qrData);
    
    // Update the visit with the generated QR code
    // In a real implementation, this would update the database
    // For mock data, we'll update it directly
    const { mockVisits } = await import('@/lib/mock-data');
    const visitIndex = mockVisits.findIndex(v => v.id === visitId);
    if (visitIndex !== -1) {
      mockVisits[visitIndex].qrCode = qrCodeDataURL;
    }

    return visitId;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw new Error('Failed to create visit');
  }
};

export const getVisitsByResident = async (residentId: string): Promise<Visit[]> => {
  return mockVisitsAPI.getVisitsByResident(residentId);
};

export const getAllVisits = async (): Promise<Visit[]> => {
  return mockVisitsAPI.getAllVisits();
};

export const getVisitsByDate = async (date: string): Promise<Visit[]> => {
  return mockVisitsAPI.getVisitsByDate(date);
};

export const getVisitById = async (visitId: string): Promise<Visit | null> => {
  return mockVisitsAPI.getVisitById(visitId);
};

export const updateVisitStatus = async (
  visitId: string, 
  status: Visit['status'], 
  authorizedBy?: string
): Promise<void> => {
  return mockVisitsAPI.updateVisitStatus(visitId, status, authorizedBy);
};

export const getTodayVisits = async (): Promise<Visit[]> => {
  return mockVisitsAPI.getTodayVisits();
};
