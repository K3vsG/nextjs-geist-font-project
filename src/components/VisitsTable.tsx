'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Visit } from '@/types';

interface VisitsTableProps {
  visits: Visit[];
  onAuthorize: (visitId: string) => void;
  onReject: (visitId: string) => void;
  onComplete: (visitId: string) => void;
  loading?: boolean;
}

export const VisitsTable = ({ 
  visits, 
  onAuthorize, 
  onReject, 
  onComplete, 
  loading = false 
}: VisitsTableProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredVisits = visits.filter(visit => {
    const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      visit.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.residentApartment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === '' || visit.date === dateFilter;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">
          Gestión de Visitas
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({filteredVisits.length} de {visits.length} visitas)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Buscar visitante o residente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="autorizada">Autorizadas</SelectItem>
                <SelectItem value="completada">Completadas</SelectItem>
                <SelectItem value="rechazada">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              variant="outline"
              className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando visitas...</p>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron visitas con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Residente</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{visit.visitorName}</p>
                        <p className="text-sm text-gray-600">{visit.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{visit.residentName}</TableCell>
                    <TableCell>{visit.residentApartment}</TableCell>
                    <TableCell>{formatDate(visit.date)}</TableCell>
                    <TableCell>{formatTime(visit.time)}</TableCell>
                    <TableCell>{visit.reason}</TableCell>
                    <TableCell>
                      <StatusBadge status={visit.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {visit.status === 'pendiente' && (
                          <>
                            <Button
                              onClick={() => onAuthorize(visit.id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white text-xs"
                            >
                              Autorizar
                            </Button>
                            <Button
                              onClick={() => onReject(visit.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                            >
                              Rechazar
                            </Button>
                          </>
                        )}
                        
                        {visit.status === 'autorizada' && (
                          <Button
                            onClick={() => onComplete(visit.id)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                          >
                            Completar
                          </Button>
                        )}
                        
                        {visit.status === 'completada' && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Completada
                          </span>
                        )}
                        
                        {visit.status === 'rechazada' && (
                          <span className="text-xs text-red-600 font-medium">
                            ✗ Rechazada
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Summary */}
        {filteredVisits.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-800">{filteredVisits.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {filteredVisits.filter(v => v.status === 'pendiente').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {filteredVisits.filter(v => v.status === 'autorizada').length}
                </div>
                <div className="text-sm text-gray-600">Autorizadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {filteredVisits.filter(v => v.status === 'completada').length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {filteredVisits.filter(v => v.status === 'rechazada').length}
                </div>
                <div className="text-sm text-gray-600">Rechazadas</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
