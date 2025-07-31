'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VisitCard } from '@/components/VisitCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVisitsByResident } from '@/lib/visits';
import { Visit } from '@/types';

export default function ResidentVisitsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'resident')) {
      router.push('/');
      return;
    }

    if (user) {
      loadVisits();
    }
  }, [user, loading, router]);

  useEffect(() => {
    filterVisits();
  }, [visits, statusFilter]);

  const loadVisits = async () => {
    if (!user) return;
    
    try {
      const userVisits = await getVisitsByResident(user.id);
      setVisits(userVisits);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoadingVisits(false);
    }
  };

  const filterVisits = () => {
    if (statusFilter === 'all') {
      setFilteredVisits(visits);
    } else {
      setFilteredVisits(visits.filter(visit => visit.status === statusFilter));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="visits" />
        
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-orange-600">
                Mis Visitas
              </CardTitle>
              <Button 
                onClick={() => router.push('/resident/visits/new')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Nueva Visita
              </Button>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
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

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  Filtrar por estado:
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las visitas</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="autorizada">Autorizadas</SelectItem>
                    <SelectItem value="completada">Completadas</SelectItem>
                    <SelectItem value="rechazada">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Visits List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {statusFilter === 'all' ? 'Todas las Visitas' : `Visitas ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}s`}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({filteredVisits.length} {filteredVisits.length === 1 ? 'visita' : 'visitas'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingVisits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando visitas...</p>
                </div>
              ) : filteredVisits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {statusFilter === 'all' 
                      ? 'No tienes visitas registradas' 
                      : `No tienes visitas ${statusFilter}s`
                    }
                  </p>
                  <Button 
                    onClick={() => router.push('/resident/visits/new')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Registrar Primera Visita
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
