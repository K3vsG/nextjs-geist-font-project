export interface User {
  id: string;
  email: string;
  role: 'resident' | 'admin' | 'security';
  name?: string;
  apartment?: string;
  phone?: string;
  createdAt: Date;
}

export interface Visit {
  id: string;
  visitorName: string;
  phone: string;
  date: string;
  time: string;
  reason: 'Personal' | 'Servicio' | 'Entrega' | 'Otro';
  comments?: string;
  qrCode: string;
  status: 'pendiente' | 'autorizada' | 'rechazada' | 'completada';
  residentId: string;
  residentName?: string;
  residentApartment?: string;
  createdAt: Date;
  authorizedBy?: string;
  authorizedAt?: Date;
  completedAt?: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface VisitFormData {
  visitorName: string;
  phone: string;
  date: string;
  time: string;
  reason: 'Personal' | 'Servicio' | 'Entrega' | 'Otro';
  comments?: string;
}
