'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { QRScanner } from '@/components/QRScanner';
import { VisitDetails } from '@/components/VisitDetails';
import { updateVisitStatus } from '@/lib/visits';
import { Visit } from '@/types';

export default function ScannerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scannedVisit, setScannedVisit] = useState<Visit | null>(null);
  const [processing, setProcessing] = useState(false);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  if (user.role !== 'security') {
    router.push('/');
    return <LoadingSpinner />;
  }

  const handleVisitScanned = (visit: Visit) => {
    setScannedVisit(visit);
  };

  const handleCompleteVisit = async (visitId: string) => {
    setProcessing(true);
    try {
      await updateVisitStatus(visitId, 'completada');
      
      // Update the local visit state
      if (scannedVisit) {
        setScannedVisit({
          ...scannedVisit,
          status: 'completada',
          completedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error completing visit:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToScanner = () => {
    setScannedVisit(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Navigation currentPage="scanner" />
        
        {!scannedVisit ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-orange-600 mb-2">
                Escáner de Códigos QR
              </h1>
              <p className="text-gray-600">
                Escanea el código QR del visitante para verificar su acceso
              </p>
            </div>
            
            <QRScanner 
              onVisitScanned={handleVisitScanned}
              userRole={user.role}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                Código QR Escaneado
              </h1>
              <p className="text-gray-600">
                Revisa la información del visitante y procede según corresponda
              </p>
            </div>
            
            <VisitDetails 
              visit={scannedVisit}
              onComplete={handleCompleteVisit}
              onBack={handleBackToScanner}
              userRole={user.role}
            />

            {processing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Procesando...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
