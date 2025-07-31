'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VisitForm } from '@/components/VisitForm';
import { QRGenerator } from '@/components/QRGenerator';
import { createVisit } from '@/lib/visits';
import { VisitFormData, Visit } from '@/types';

export default function NewVisitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [createdVisit, setCreatedVisit] = useState<Visit | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  if (user.role !== 'resident') {
    router.push('/');
    return <LoadingSpinner />;
  }

  const handleSubmit = async (data: VisitFormData) => {
    if (!user.name || !user.apartment) {
      router.push('/auth/profile');
      return;
    }

    setSubmitting(true);
    try {
      const visitId = await createVisit(
        data,
        user.id,
        user.name,
        user.apartment
      );

      // Get the created visit to show QR
      const visit: Visit = {
        id: visitId,
        ...data,
        residentId: user.id,
        residentName: user.name,
        residentApartment: user.apartment,
        status: 'pendiente',
        qrCode: '', // Will be updated by the createVisit function
        createdAt: new Date()
      };

      // Wait a moment for QR generation
      setTimeout(async () => {
        try {
          const { getVisitById } = await import('@/lib/visits');
          const fullVisit = await getVisitById(visitId);
          if (fullVisit) {
            setCreatedVisit(fullVisit);
          }
        } catch (error) {
          console.error('Error fetching created visit:', error);
        }
      }, 2000);

      setCreatedVisit(visit);
    } catch (error) {
      console.error('Error creating visit:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Navigation currentPage="new-visit" />
        
        {!createdVisit ? (
          <VisitForm onSubmit={handleSubmit} loading={submitting} />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                ¡Visita Registrada Exitosamente!
              </h1>
              <p className="text-gray-600">
                Tu código QR ha sido generado. Compártelo con tu visitante.
              </p>
            </div>
            
            <QRGenerator visit={createdVisit} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/resident/visits/new')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Registrar Otra Visita
              </button>
              <button
                onClick={() => router.push('/resident/visits')}
                className="flex-1 border border-orange-200 text-orange-600 hover:bg-orange-50 py-2 px-4 rounded-md transition-colors"
              >
                Ver Mis Visitas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
