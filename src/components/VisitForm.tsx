'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VisitFormData } from '@/types';

const visitSchema = z.object({
  visitorName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  reason: z.enum(['Personal', 'Servicio', 'Entrega', 'Otro'], {
    required_error: 'Selecciona un motivo'
  }),
  comments: z.string().optional()
});

interface VisitFormProps {
  onSubmit: (data: VisitFormData) => Promise<void>;
  loading?: boolean;
}

export const VisitForm = ({ onSubmit, loading = false }: VisitFormProps) => {
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Today's date
      time: new Date().toTimeString().slice(0, 5) // Current time
    }
  });

  const selectedReason = watch('reason');

  const handleFormSubmit = async (data: VisitFormData) => {
    setError('');
    
    // Validate that the date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('No puedes registrar visitas para fechas pasadas');
      return;
    }

    try {
      await onSubmit(data);
    } catch (error: any) {
      setError(error.message || 'Error al registrar la visita');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-orange-600">
          Registrar Nueva Visita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="visitorName">Nombre del Visitante *</Label>
            <Input
              id="visitorName"
              {...register('visitorName')}
              placeholder="Ej: María García"
              className="focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.visitorName && (
              <p className="text-sm text-red-600">{errors.visitorName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="Ej: +57 300 123 4567"
              className="focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha de Visita *</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                min={new Date().toISOString().split('T')[0]}
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora de Visita *</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.time && (
                <p className="text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la Visita *</Label>
            <Select onValueChange={(value) => setValue('reason', value as any)}>
              <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Selecciona el motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Servicio">Servicio (técnico, limpieza, etc.)</SelectItem>
                <SelectItem value="Entrega">Entrega (paquetes, comida, etc.)</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios Adicionales</Label>
            <Textarea
              id="comments"
              {...register('comments')}
              placeholder="Información adicional sobre la visita (opcional)"
              className="focus:ring-orange-500 focus:border-orange-500"
              rows={3}
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Información importante:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• El código QR se generará automáticamente después del registro</li>
              <li>• Comparte el código QR con tu visitante</li>
              <li>• La visita debe ser autorizada por un administrador</li>
              <li>• El código QR es válido solo para la fecha seleccionada</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            {loading ? 'Registrando visita...' : 'Registrar Visita'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
