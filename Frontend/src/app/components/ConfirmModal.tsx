import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 p-6">
        <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="font-montserrat text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-4 justify-end">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 font-montserrat font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-montserrat font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
