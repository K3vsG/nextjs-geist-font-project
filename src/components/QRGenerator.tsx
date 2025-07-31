'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadQRCode } from '@/lib/qr-utils';
import { Visit } from '@/types';

interface QRGeneratorProps {
  visit: Visit;
}

export const QRGenerator = ({ visit }: QRGeneratorProps) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');

  useEffect(() => {
    if (visit.qrCode) {
      setQrImageUrl(visit.qrCode);
    }
  }, [visit.qrCode]);

  const handleDownload = () => {
    if (qrImageUrl) {
      downloadQRCode(qrImageUrl, `visita-${visit.visitorName}-${visit.date}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrImageUrl) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `visita-${visit.visitorName}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'Código QR de Visita',
          text: `Código QR para la visita de ${visit.visitorName} el ${visit.date} a las ${visit.time}`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to download
        handleDownload();
      }
    } else {
      // Fallback to download
      handleDownload();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-orange-600 text-center">
          Código QR Generado
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
          {qrImageUrl ? (
            <img 
              src={qrImageUrl} 
              alt={`Código QR para visita de ${visit.visitorName} - Residencial Vista Hermosa - Departamento ${visit.residentApartment} - Fecha de vencimiento ${visit.date}`}
              className="w-64 h-64 mx-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/256x256?text=Codigo+QR+generado+para+visita+residencial+con+datos+completos+incluyendo+residencia+departamento+y+fecha+de+vencimiento";
              }}
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500"></div>
            </div>
          )}
        </div>

        <div className="bg-orange-50 p-4 rounded-lg text-left">
          <h3 className="font-semibold text-orange-800 mb-2">Información de la Visita:</h3>
          <div className="text-sm text-orange-700 space-y-1">
            <p><strong>Visitante:</strong> {visit.visitorName}</p>
            <p><strong>Residencia:</strong> Residencial Vista Hermosa</p>
            <p><strong>Departamento:</strong> {visit.residentApartment}</p>
            <p><strong>Fecha:</strong> {new Date(visit.date).toLocaleDateString('es-ES')}</p>
            <p><strong>Hora:</strong> {visit.time}</p>
            <p><strong>Motivo:</strong> {visit.reason}</p>
            <p><strong>Fecha de vencimiento:</strong> {visit.date} (válido solo este día)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleShare}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Compartir QR
          </Button>
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Descargar PNG
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Instrucciones:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Comparte este código QR con tu visitante</li>
            <li>El visitante debe mostrar el QR al vigilante</li>
            <li>El vigilante escaneará el código para verificar la visita</li>
            <li>La visita debe ser autorizada por un administrador</li>
            <li>El código es válido solo para la fecha programada</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
