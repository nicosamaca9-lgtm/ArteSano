import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { z } from 'zod';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

// ─── Zod Schema ─────────────────────────────────────────────
const resetSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

const getZodMessage = (result: { success: false; error: z.ZodError }): string => {
  return result.error.issues?.[0]?.message ?? result.error.message ?? 'Error de validación';
};
// ────────────────────────────────────────────────────────────

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token de recuperación no válido o ausente.');
      return;
    }

    const result = resetSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      toast.error(getZodMessage(result));
      return;
    }

    setStatus('loading');

    try {
      const response = await fetchApi(`/user/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: password }),
      });

      if (response.ok) {
        setStatus('success');
        toast.success('¡Contraseña actualizada exitosamente!');
      } else {
        setStatus('idle');
        toast.error(response.error_message || 'Error al restablecer la contraseña.');
      }
    } catch (error: any) {
      setStatus('idle');
      toast.error(error.message || 'Ocurrió un error al restablecer tu contraseña.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Enlace inválido</h2>
          <p className="text-stone-500 mb-6">No se encontró un token válido en la URL.</p>
          <Link to="/" className="px-6 py-3 bg-stone-200 text-stone-800 font-medium rounded-xl hover:bg-stone-300 transition-colors w-full block">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-stone-500 mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <Link to="/" className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors w-full block">
            Ir al Inicio e Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
        <div className="text-center mb-6">
          <KeyRound className="w-12 h-12 text-[#064E3B] mb-4 mx-auto" />
          <h2 className="font-caveat font-bold text-4xl text-gray-900 mb-2">Nueva Contraseña</h2>
          <p className="text-stone-500 text-sm">Ingresa tu nueva contraseña a continuación.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-montserrat">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
              placeholder="Repite la contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-2 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-montserrat font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Guardando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};
