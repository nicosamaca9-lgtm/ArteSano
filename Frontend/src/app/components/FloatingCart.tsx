import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartSidebar } from './CartSidebar';

export function FloatingCart() {
  const { totalItems, openCart } = useCart();

  return (
    <>
      <button 
        onClick={openCart}
        className="fixed bottom-6 right-6 z-50 bg-[#FF6B6B] hover:bg-[#FF5252] text-white p-4 sm:p-5 rounded-full shadow-[0_10px_25px_rgba(255,107,107,0.5)] transition-transform transform hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center"
        aria-label="Ver carrito de compras"
      >
        <ShoppingCart size={28} className="sm:w-8 sm:h-8" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {totalItems}
          </span>
        )}
      </button>

      <CartSidebar />
    </>
  );
}
