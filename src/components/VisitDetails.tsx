'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Visit } from '@/types';

interface VisitDetailsProps {
  visit: Visit;
  onComplete?: (visitId: string) => void;
  onBack?: () => void;
  userRole: string;
}

export const VisitDetails = ({ visit, onComplete, onBack, userRole }: VisitDetailsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl text-orange-600">
              Información de la Visita
            </CardTitle>
            <StatusBadge status={visit.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visitor Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-3">Información del Visitante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-orange-600">Nombre:</p>
                <p className="font-semibold text-orange-800">{visit.visitorName}</p>
              </div>
              <div>
                <p className="text-sm text-orange-600">Teléfono:</p>
                <p className="font-semibold text-orange-800">{visit.phone}</p>
              </div>
            </div>
          </div>

          {/* Residence Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Información de la Residencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Residencia:</p>
                <p className="font-semibold text-blue-800">Residencial Vista Hermosa</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Departamento:</p>
                <p className="font-semibold text-blue-800">{visit.residentApartment}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Residente:</p>
                <p className="font-semibold text-blue-800">{visit.residentName}</p>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Detalles de la Visita</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-600">Fecha:</p>
                <p className="font-semibold text-green-800">{formatDate(visit.date)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Hora:</p>
                <p className="font-semibold text-green-800">{formatTime(visit.time)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Motivo:</p>
                <p className="font-semibold text-green-800">{visit.reason}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Fecha de vencimiento:</p>
                <p className="font-semibold text-green-800">{visit.date} (válido solo este día)</p>
              </div>
            </div>
            
            {visit.comments && (
              <div className="mt-4">
                <p className="text-sm text-green-600">Comentarios:</p>
                <p className="font-semibold text-green-800">{visit.comments}</p>
              </div>
            )}
          </div>

          {/* Status Information */}
          {visit.status === 'autorizada' && visit.authorizedBy && visit.authorizedAt && (
            <div className="bg-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Información de Autorización</h3>
              <p className="text-sm text-green-700">
                <strong>Autorizada por:</strong> {visit.authorizedBy}
              </p>
              <p className="text-sm text-green-700">
                <strong>Fecha de autorización:</strong> {new Date(visit.authorizedAt).toLocaleString('es-ES')}
              </p>
            </div>
          )}

          {visit.status === 'completada' && visit.completedAt && (
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Visita Completada</h3>
              <p className="text-sm text-blue-700">
                <strong>Completada el:</strong> {new Date(visit.completedAt).toLocaleString('es-ES')}
              </p>
            </div>
          )}

          {visit.status === 'rechazada' && (
            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">Visita Rechazada</h3>
              <p className="text-sm text-red-700">
                Esta visita ha sido rechazada por un administrador.
              </p>
            </div>
          )}

          {visit.status === 'pendiente' && (
            <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Visita Pendiente</h3>
              <p className="text-sm text-yellow-700">
                Esta visita está pendiente de autorización por un administrador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Volver al Escáner
          </Button>
        )}

        {userRole === 'security' && visit.status === 'autorizada' && onComplete && (
          <Button 
            onClick={() => onComplete(visit.id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Marcar como Completada
          </Button>
        )}

        {visit.status === 'completada' && (
          <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-md text-center font-medium">
            ✓ Visita Completada
          </div>
        )}

        {visit.status === 'rechazada' && (
          <div className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-md text-center font-medium">
            ✗ Visita Rechazada
          </div>
        )}

        {visit.status === 'pendiente' && (
          <div className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-center font-medium">
            ⏳ Pendiente de Autorización
          </div>
        )}
      </div>
    </div>
  );
};
