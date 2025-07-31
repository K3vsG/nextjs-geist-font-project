'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [apartment, setApartment] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateProfile, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile({
        name,
        apartment,
        phone
      });
      router.push('/resident');
    } catch (error: any) {
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">
            Completar Perfil
          </CardTitle>
          <CardDescription>
            Completa tu información para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apartment">Departamento</Label>
              <Input
                id="apartment"
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                required
                className="focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 101, A-205, Torre 1 - 301"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: +57 300 123 4567"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Completar Perfil'}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
