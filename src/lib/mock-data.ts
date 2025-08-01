import { User, Visit } from '@/types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@residencial.com',
    role: 'admin',
    name: 'Administrador Principal',
    apartment: 'Oficina Admin',
    phone: '+57 300 000 0001',
    createdAt: new Date()
  },
  {
    id: 'security-1',
    email: 'security@residencial.com',
    role: 'security',
    name: 'Vigilante Principal',
    apartment: 'Portería',
    phone: '+57 300 000 0002',
    createdAt: new Date()
  },
  {
    id: 'resident-1',
    email: 'resident@residencial.com',
    role: 'resident',
    name: 'Juan Carlos Pérez',
    apartment: '101',
    phone: '+57 300 000 0003',
    createdAt: new Date()
  },
  {
    id: 'resident-2',
    email: 'maria@residencial.com',
    role: 'resident',
    name: 'María González',
    apartment: '205',
    phone: '+57 300 000 0004',
    createdAt: new Date()
  }
];

// Mock visits data
export const mockVisits: Visit[] = [
  {
    id: 'visit-1',
    visitorName: 'María García',
    phone: '+57 300 123 4567',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    reason: 'Personal',
    comments: 'Visita familiar',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'pendiente',
    residentId: 'resident-1',
    residentName: 'Juan Carlos Pérez',
    residentApartment: '101',
    createdAt: new Date()
  },
  {
    id: 'visit-2',
    visitorName: 'Carlos Delivery',
    phone: '+57 300 987 6543',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    reason: 'Entrega',
    comments: 'Entrega de paquete de Amazon',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'autorizada',
    residentId: 'resident-2',
    residentName: 'María González',
    residentApartment: '205',
    authorizedBy: 'Administrador Principal',
    authorizedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: 'visit-3',
    visitorName: 'Ana Técnico',
    phone: '+57 300 555 1234',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    reason: 'Servicio',
    comments: 'Reparación de aire acondicionado',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'completada',
    residentId: 'resident-1',
    residentName: 'Juan Carlos Pérez',
    residentApartment: '101',
    authorizedBy: 'Administrador Principal',
    authorizedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 'visit-4',
    visitorName: 'Pedro Sospechoso',
    phone: '+57 300 999 8888',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    reason: 'Personal',
    comments: 'Visita no autorizada previamente',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'rechazada',
    residentId: 'resident-2',
    residentName: 'María González',
    residentApartment: '205',
    authorizedBy: 'Administrador Principal',
    authorizedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'visit-5',
    visitorName: 'Luis Amigo',
    phone: '+57 300 777 6666',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '15:00',
    reason: 'Personal',
    comments: 'Visita programada para mañana',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'pendiente',
    residentId: 'resident-1',
    residentName: 'Juan Carlos Pérez',
    residentApartment: '101',
    createdAt: new Date()
  }
];

// Mock authentication functions
export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Simple password validation for demo
    const validPasswords: { [key: string]: string } = {
      'admin@residencial.com': 'admin123',
      'security@residencial.com': 'security123',
      'resident@residencial.com': 'resident123',
      'maria@residencial.com': 'resident123'
    };
    
    if (validPasswords[email] !== password) {
      throw new Error('Contraseña incorrecta');
    }
    
    return user;
  },
  
  register: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: 'resident',
      createdAt: new Date()
    };
    
    mockUsers.push(newUser);
    return newUser;
  },
  
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    return mockUsers[userIndex];
  }
};

// Mock visits functions
export const mockVisitsAPI = {
  createVisit: async (visitData: any, residentId: string, residentName: string, residentApartment: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      ...visitData,
      residentId,
      residentName,
      residentApartment,
      status: 'pendiente' as const,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: new Date()
    };
    
    mockVisits.push(newVisit);
    return newVisit.id;
  },
  
  getVisitsByResident: async (residentId: string): Promise<Visit[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockVisits
      .filter(v => v.residentId === residentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  getAllVisits: async (): Promise<Visit[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockVisits.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  getVisitsByDate: async (date: string): Promise<Visit[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockVisits
      .filter(v => v.date === date)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  getVisitById: async (visitId: string): Promise<Visit | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockVisits.find(v => v.id === visitId) || null;
  },
  
  updateVisitStatus: async (visitId: string, status: Visit['status'], authorizedBy?: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const visitIndex = mockVisits.findIndex(v => v.id === visitId);
    if (visitIndex === -1) {
      throw new Error('Visita no encontrada');
    }
    
    const updateData: any = { status };
    
    if (status === 'autorizada' && authorizedBy) {
      updateData.authorizedBy = authorizedBy;
      updateData.authorizedAt = new Date();
    }
    
    if (status === 'completada') {
      updateData.completedAt = new Date();
    }
    
    mockVisits[visitIndex] = { ...mockVisits[visitIndex], ...updateData };
  },
  
  getTodayVisits: async (): Promise<Visit[]> => {
    const today = new Date().toISOString().split('T')[0];
    return mockVisitsAPI.getVisitsByDate(today);
  }
};
