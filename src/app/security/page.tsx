'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VisitCard } from '@/components/VisitCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodayVisits, updateVisitStatus } from '@/lib/visits';
import { Visit } from '@/types';

export default function SecurityDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'security')) {
      router.push('/');
      return;
    }

    if (user) {
      loadTodayVisits();
    }
  }, [user, loading, router]);

  const loadTodayVisits = async () => {
    try {
      const todayVisits = await getTodayVisits();
      setVisits(todayVisits);
    } catch (error) {
      console.error('Error loading today visits:', error);
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleCompleteVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'completada');
      await loadTodayVisits(); // Reload visits
    } catch (error) {
      console.error('Error completing visit:', error);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  const getStatusStats = () => {
    const total = visits.length;
    const pendientes = visits.filter(v => v.status === 'pendiente').length;
    const autorizadas = visits.filter(v => v.status === 'autorizada').length;
    const completadas = visits.filter(v => v.status === 'completada').length;
    const rechazadas = visits.filter(v => v.status === 'rechazada').length;
    
    return { total, pendientes, autorizadas, completadas, rechazadas };
  };

  const stats = getStatusStats();
  const authorizedVisits = visits.filter(v => v.status === 'autorizada');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="dashboard" />
        
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600">
                Panel de Vigilancia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestiona el acceso de visitantes al Residencial Vista Hermosa.
              </p>
              <Button 
                onClick={() => router.push('/security/scanner')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Abrir Escáner QR
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Hoy</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.autorizadas}</div>
                <div className="text-sm text-gray-600">Autorizadas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.completadas}</div>
                <div className="text-sm text-gray-600">Completadas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rechazadas}</div>
                <div className="text-sm text-gray-600">Rechazadas</div>
              </CardContent>
            </Card>
          </div>

          {/* Authorized Visits - Ready for Entry */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-800">
                Visitas Autorizadas - Listas para Ingresar
              </CardTitle>
              <Button 
                onClick={() => router.push('/security/scanner')}
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Escanear QR
              </Button>
            </CardHeader>
            <CardContent>
              {loadingVisits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando visitas...</p>
                </div>
              ) : authorizedVisits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No hay visitas autorizadas pendientes</p>
                  <Button 
                    onClick={() => router.push('/security/scanner')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Abrir Escáner QR
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {authorizedVisits.map((visit) => (
                    <VisitCard 
                      key={visit.id} 
                      visit={visit}
                      showActions={true}
                      onComplete={handleCompleteVisit}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Today's Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Todas las Visitas de Hoy
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({visits.length} {visits.length === 1 ? 'visita' : 'visitas'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay visitas registradas para hoy</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visits.slice(0, 5).map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                  {visits.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        Y {visits.length - 5} visitas más...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/security/scanner')}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12"
                >
                  Escanear Código QR
                </Button>
                <Button 
                  onClick={loadTodayVisits}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 h-12"
                >
                  Actualizar Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
