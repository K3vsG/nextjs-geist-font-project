'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseQRData } from '@/lib/qr-utils';
import { getVisitById, updateVisitStatus } from '@/lib/visits';
import { Visit } from '@/types';

interface QRScannerProps {
  onVisitScanned: (visit: Visit) => void;
  userRole: string;
}

export const QRScanner = ({ onVisitScanned, userRole }: QRScannerProps) => {
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!qrInput.trim()) {
      setError('Por favor ingresa el código QR');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse QR data
      const qrData = parseQRData(qrInput);
      
      if (!qrData || !qrData.visitId) {
        setError('Código QR inválido');
        return;
      }

      // Get visit from database
      const visit = await getVisitById(qrData.visitId);
      
      if (!visit) {
        setError('Visita no encontrada');
        return;
      }

      // Validate date (only today's visits)
      const today = new Date().toISOString().split('T')[0];
      if (visit.date !== today) {
        setError('Esta visita no es para el día de hoy');
        return;
      }

      // Validate status
      if (visit.status === 'rechazada') {
        setError('Esta visita ha sido rechazada');
        return;
      }

      if (visit.status === 'completada') {
        setError('Esta visita ya ha sido completada');
        return;
      }

      onVisitScanned(visit);
      setQrInput('');
    } catch (error) {
      console.error('Error scanning QR:', error);
      setError('Error al procesar el código QR');
    } finally {
      setLoading(false);
    }
  };

  const handleManualInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-orange-600 text-center">
          Escáner de Códigos QR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="qrInput">Código QR de la Visita</Label>
          <Input
            id="qrInput"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyPress={handleManualInput}
            placeholder="Pega aquí el código QR o ingresa manualmente"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <Button 
          onClick={handleScan}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Escanear Código QR'}
        </Button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instrucciones:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Solicita al visitante que muestre su código QR</li>
            <li>Copia y pega el código en el campo de arriba</li>
            <li>Presiona "Escanear" para verificar la visita</li>
            <li>Revisa la información del visitante</li>
            <li>Autoriza o completa la visita según corresponda</li>
          </ol>
        </div>

        {/* Example QR codes for testing */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Códigos QR de Ejemplo:</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-2 rounded border">
              <p className="font-medium text-gray-700">Visita Personal - María García</p>
              <code className="text-xs text-gray-600 break-all">
                {JSON.stringify({
                  visitId: "example-visit-1",
                  visitorName: "María García",
                  apartment: "101",
                  date: new Date().toISOString().split('T')[0],
                  residencia: "Residencial Vista Hermosa",
                  type: "visit"
                })}
              </code>
            </div>
            <div className="bg-white p-2 rounded border">
              <p className="font-medium text-gray-700">Entrega - Juan Delivery</p>
              <code className="text-xs text-gray-600 break-all">
                {JSON.stringify({
                  visitId: "example-visit-2",
                  visitorName: "Juan Delivery",
                  apartment: "205",
                  date: new Date().toISOString().split('T')[0],
                  residencia: "Residencial Vista Hermosa",
                  type: "visit"
                })}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
