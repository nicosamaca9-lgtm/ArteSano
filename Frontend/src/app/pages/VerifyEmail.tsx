import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no encontrado.');
        return;
      }

      try {
        const response = await fetchApi(`/user/verify/${token}`, {
          method: 'GET',
        });
        
        if (response.ok) {
          setStatus('success');
          setMessage('¡Tu cuenta ha sido verificada exitosamente!');
        } else {
          setStatus('error');
          setMessage(response.error_message || 'Error al verificar la cuenta.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Ocurrió un error al verificar tu cuenta.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Verificando...</h2>
            <p className="text-stone-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">¡Cuenta Verificada!</h2>
            <p className="text-stone-500 mb-6">{message}</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors w-full"
            >
              Ir al Inicio
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Error de Verificación</h2>
            <p className="text-stone-500 mb-6">{message}</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-stone-200 text-stone-800 font-medium rounded-xl hover:bg-stone-300 transition-colors w-full"
            >
              Volver al Inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
