'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodayVisits, updateVisitStatus } from '@/lib/visits';
import { Visit } from '@/types';

export default function AdminDashboard() {
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

  const handleAuthorizeVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'autorizada', user?.name || user?.email);
      await loadTodayVisits(); // Reload visits
    } catch (error) {
      console.error('Error authorizing visit:', error);
    }
  };

  const handleRejectVisit = async (visitId: string) => {
    try {
      await updateVisitStatus(visitId, 'rechazada', user?.name || user?.email);
      await loadTodayVisits(); // Reload visits
    } catch (error) {
      console.error('Error rejecting visit:', error);
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
  const pendingVisits = visits.filter(v => v.status === 'pendiente');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Navigation currentPage="dashboard" />
        
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600">
                Panel de Administración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestiona y autoriza las visitas del Residencial Vista Hermosa.
              </p>
              <Button 
                onClick={() => router.push('/admin/visits')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Gestionar Todas las Visitas
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

          {/* Pending Visits - Require Authorization */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-800">
                Visitas Pendientes de Autorización
              </CardTitle>
              <Button 
                onClick={loadTodayVisits}
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Actualizar
              </Button>
            </CardHeader>
            <CardContent>
              {loadingVisits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando visitas...</p>
                </div>
              ) : pendingVisits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No hay visitas pendientes de autorización</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVisits.map((visit) => (
                    <div key={visit.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Visitante:</p>
                              <p className="font-semibold">{visit.visitorName}</p>
                              <p className="text-sm text-gray-600">{visit.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Residente:</p>
                              <p className="font-semibold">{visit.residentName}</p>
                              <p className="text-sm text-gray-600">Depto: {visit.residentApartment}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Fecha y Hora:</p>
                              <p className="font-semibold">{new Date(visit.date).toLocaleDateString('es-ES')}</p>
                              <p className="text-sm text-gray-600">{visit.time} - {visit.reason}</p>
                            </div>
                          </div>
                          {visit.comments && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Comentarios:</p>
                              <p className="text-sm">{visit.comments}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAuthorizeVisit(visit.id)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Autorizar
                          </Button>
                          <Button
                            onClick={() => handleRejectVisit(visit.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Actividad Reciente
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Últimas 5 visitas)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay visitas registradas para hoy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{visit.visitorName}</p>
                        <p className="text-sm text-gray-600">
                          {visit.residentName} - {visit.residentApartment} | {visit.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          visit.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          visit.status === 'autorizada' ? 'bg-green-100 text-green-800' :
                          visit.status === 'completada' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => router.push('/admin/visits')}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12"
                >
                  Gestionar Todas las Visitas
                </Button>
                <Button 
                  onClick={loadTodayVisits}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 h-12"
                >
                  Actualizar Lista
                </Button>
                <Button 
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    router.push(`/admin/visits?date=${today}`);
                  }}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 h-12"
                >
                  Ver Reporte del Día
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
