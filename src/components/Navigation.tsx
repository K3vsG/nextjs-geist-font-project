'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  currentPage: string;
}

export const Navigation = ({ currentPage }: NavigationProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'resident':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/resident' },
          { id: 'visits', label: 'Mis Visitas', path: '/resident/visits' },
          { id: 'new-visit', label: 'Nueva Visita', path: '/resident/visits/new' }
        ];
      case 'security':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/security' },
          { id: 'scanner', label: 'Escáner QR', path: '/security/scanner' }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Inicio', path: '/admin' },
          { id: 'visits', label: 'Gestionar Visitas', path: '/admin/visits' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {user?.name || user?.email}
          </h2>
          <p className="text-sm text-gray-600 capitalize">
            {user?.role === 'resident' && 'Residente'}
            {user?.role === 'security' && 'Vigilante'}
            {user?.role === 'admin' && 'Administrador'}
            {user?.apartment && ` - ${user.apartment}`}
          </p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Cerrar Sesión
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => router.push(item.path)}
            variant={currentPage === item.id ? "default" : "outline"}
            size="sm"
            className={
              currentPage === item.id 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "border-orange-200 text-orange-600 hover:bg-orange-50"
            }
          >
            {item.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
