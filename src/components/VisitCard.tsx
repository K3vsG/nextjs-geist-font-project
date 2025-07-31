'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Visit } from '@/types';
import { downloadQRCode } from '@/lib/qr-utils';

interface VisitCardProps {
  visit: Visit;
  showActions?: boolean;
  onAuthorize?: (visitId: string) => void;
  onReject?: (visitId: string) => void;
  onComplete?: (visitId: string) => void;
}

export const VisitCard = ({ 
  visit, 
  showActions = false, 
  onAuthorize, 
  onReject, 
  onComplete 
}: VisitCardProps) => {
  const handleDownloadQR = () => {
    if (visit.qrCode) {
      downloadQRCode(visit.qrCode, `visita-${visit.visitorName}-${visit.date}`);
    }
  };

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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-gray-800">
            {visit.visitorName}
          </CardTitle>
          <StatusBadge status={visit.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Teléfono:</p>
            <p className="font-medium">{visit.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">Motivo:</p>
            <p className="font-medium">{visit.reason}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Fecha:</p>
            <p className="font-medium">{formatDate(visit.date)}</p>
          </div>
          <div>
            <p className="text-gray-600">Hora:</p>
            <p className="font-medium">{formatTime(visit.time)}</p>
          </div>
        </div>

        {visit.residentName && (
          <div className="text-sm">
            <p className="text-gray-600">Residente:</p>
            <p className="font-medium">
              {visit.residentName} - {visit.residentApartment}
            </p>
          </div>
        )}

        {visit.comments && (
          <div className="text-sm">
            <p className="text-gray-600">Comentarios:</p>
            <p className="font-medium text-gray-800">{visit.comments}</p>
          </div>
        )}

        {visit.authorizedBy && visit.authorizedAt && (
          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
            <p>Autorizada por: {visit.authorizedBy}</p>
            <p>Fecha: {new Date(visit.authorizedAt).toLocaleString('es-ES')}</p>
          </div>
        )}

        {visit.completedAt && (
          <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
            <p>Completada el: {new Date(visit.completedAt).toLocaleString('es-ES')}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {visit.qrCode && (
            <Button
              onClick={handleDownloadQR}
              size="sm"
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Descargar QR
            </Button>
          )}

          {showActions && visit.status === 'pendiente' && (
            <>
              <Button
                onClick={() => onAuthorize?.(visit.id)}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Autorizar
              </Button>
              <Button
                onClick={() => onReject?.(visit.id)}
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Rechazar
              </Button>
            </>
          )}

          {showActions && visit.status === 'autorizada' && (
            <Button
              onClick={() => onComplete?.(visit.id)}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Marcar Completada
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
