'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VisitCard } from '@/components/VisitCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getVisitsByResident } from '@/lib/visits';
import { Visit } from '@/types';

export default function ResidentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'resident')) {
      router.push('/');
      return;
    }

    if (user && !user.name) {
      router.push('/auth/profile');
      return;
    }

    if (user) {
      loadVisits();
    }
  }, [user, loading, router]);

  const loadVisits = async () => {
    if (!user) return;
    
    try {
      const userVisits = await getVisitsByResident(user.id);
      setVisits(userVisits.slice(0, 3)); // Show only last 3 visits
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoadingVisits(false);
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
    
    return { total, pendientes, autorizadas, completadas };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="dashboard" />
        
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600">
                ¡Bienvenido, {user.name}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestiona las visitas a tu departamento {user.apartment} de forma fácil y segura.
              </p>
              <Button 
                onClick={() => router.push('/resident/visits/new')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Registrar Nueva Visita
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Visitas</div>
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
          </div>

          {/* Recent Visits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-800">
                Visitas Recientes
              </CardTitle>
              <Button 
                onClick={() => router.push('/resident/visits')}
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Ver Todas
              </Button>
            </CardHeader>
            <CardContent>
              {loadingVisits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando visitas...</p>
                </div>
              ) : visits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No tienes visitas registradas</p>
                  <Button 
                    onClick={() => router.push('/resident/visits/new')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Registrar Primera Visita
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/resident/visits/new')}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12"
                >
                  Registrar Nueva Visita
                </Button>
                <Button 
                  onClick={() => router.push('/resident/visits')}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 h-12"
                >
                  Ver Historial de Visitas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
