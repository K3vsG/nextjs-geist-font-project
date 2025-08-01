'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VisitsTable } from '@/components/VisitsTable';
import { getAllVisits, updateVisitStatus } from '@/lib/visits';
import { Visit } from '@/types';

export default function AdminVisitsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    if (user) {
      loadAllVisits();
    }
  }, [user, loading, router]);

  const loadAllVisits = async () => {
    try {
      const allVisits = await getAllVisits();
      setVisits(allVisits);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleAuthorizeVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'autorizada', user?.name || user?.email);
      await loadAllVisits(); // Reload visits
    } catch (error) {
      console.error('Error authorizing visit:', error);
    }
  };

  const handleRejectVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'rechazada', user?.name || user?.email);
      await loadAllVisits(); // Reload visits
    } catch (error) {
      console.error('Error rejecting visit:', error);
    }
  };

  const handleCompleteVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'completada');
      await loadAllVisits(); // Reload visits
    } catch (error) {
      console.error('Error completing visit:', error);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="visits" />
        
        <div className="space-y-6">
          <VisitsTable
            visits={visits}
            onAuthorize={handleAuthorizeVisit}
            onReject={handleRejectVisit}
            onComplete={handleCompleteVisit}
            loading={loadingVisits}
          />
        </div>
      </div>
    </div>
  );
}
