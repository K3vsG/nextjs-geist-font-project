'use client';

import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types';

interface StatusBadgeProps {
  status: Visit['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: Visit['status']) => {
    switch (status) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'autorizada':
        return {
          label: 'Autorizada',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rechazada':
        return {
          label: 'Rechazada',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'completada':
        return {
          label: 'Completada',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};
