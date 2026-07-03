import React, { useState } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

// ─── Zod Schemas ────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('El correo no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo no tiene un formato válido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const forgotSchema = z.object({
  email: z.string().email('El correo no tiene un formato válido'),
});
// ────────────────────────────────────────────────────────────

const getZodMessage = (result: { success: false; error: z.ZodError }): string => {
  return result.error.issues?.[0]?.message ?? result.error.message ?? 'Error de validación';
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, authModalMode } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  React.useEffect(() => {
    if (isOpen) {
      setMode(authModalMode);
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
  }, [isOpen, authModalMode]);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          toast.error(getZodMessage(result));
          return;
        }
        await login({ email: formData.email, password: formData.password });
        toast.success('¡Bienvenido de vuelta!');
        onClose();

      } else if (mode === 'register') {
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
          toast.error(getZodMessage(result));
          return;
        }
        await register(formData);
        toast.success('¡Cuenta creada! Revisa tu correo para verificarla.');
        onClose();

      } else if (mode === 'forgot_password') {
        const result = forgotSchema.safeParse(formData);
        if (!result.success) {
          toast.error(getZodMessage(result));
          return;
        }
        const response = await fetch('http://localhost:3000/api/v1/user/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await response.json();
        if (data.ok) {
          toast.success('Si el correo está registrado, recibirás un enlace de recuperación.');
          onClose();
        } else {
          toast.error(data.error_message || 'Error al enviar el correo');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-caveat font-bold text-3xl text-gray-900">
            {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'register' ? 'Únete a ArteSano' : 'Recuperar Contraseña'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 font-montserrat">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej: 3001234567"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
              />
            </div>

            {mode !== 'forgot_password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none transition-all"
                />
                {mode === 'login' && (
                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-xs text-[#064E3B] hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-montserrat font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Registrarse' : 'Enviar enlace'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 font-montserrat">
            {mode === 'login' ? '¿No tienes cuenta? ' : mode === 'register' ? '¿Ya tienes cuenta? ' : '¿Recordaste tu contraseña? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'register' ? 'login' : mode === 'forgot_password' ? 'login' : 'register')}
              className="text-[#064E3B] font-bold hover:underline"
            >
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
