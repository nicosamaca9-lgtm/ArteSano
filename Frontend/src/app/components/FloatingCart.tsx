import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function FloatingCart() {
  return (
    <button 
      className="fixed bottom-6 right-6 z-50 bg-[#FF6B6B] hover:bg-[#FF5252] text-white p-4 sm:p-5 rounded-full shadow-[0_10px_25px_rgba(255,107,107,0.5)] transition-transform transform hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center"
      aria-label="Ver carrito de compras"
    >
      <ShoppingCart size={28} className="sm:w-8 sm:h-8" />
    </button>
  );
}
