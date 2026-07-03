import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { X, Trash2, Plus, Minus, Leaf, MapPin, Lock, ShieldCheck } from 'lucide-react';

export function CartSidebar() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError('Por favor ingresa una dirección de envío');
      return;
    }
    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      
      const response = await orderService.createPreference(orderItems, address);
      
      if (response.ok && response.init_point) {
        window.location.href = response.init_point;
      } else {
        setError('No se pudo generar la orden de pago');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    // Si clearCart no existe en el context, vaciamos iterando
    items.forEach(item => removeFromCart(item.product.id));
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />
      
      <div 
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FCFBF8] z-[70] flex flex-col transition-transform transform translate-x-0 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:rounded-tl-[32px] sm:rounded-bl-[32px] overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Close Button */}
        <button 
          onClick={closeCart} 
          className="absolute top-6 right-6 w-10 h-10 bg-white border border-[#E2E6DF] rounded-full flex items-center justify-center shadow-sm text-[#2C8A58] hover:scale-105 transition-transform z-10"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EAF4EB] rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-[#2C8A58]" />
            </div>
            <div>
              <h2 className="font-bold text-[28px] leading-tight text-[#1F2530]">Tu Carrito</h2>
              <p className="text-[14px] text-[#6F6F6F] mt-0.5 flex items-center gap-1">
                Productos frescos, hechos para ti <Leaf className="w-3 h-3 text-[#7FA87A]" />
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="px-8 pb-4 flex justify-between items-center text-[14px]">
          <span className="text-[#6F6F6F]">{items.length} {items.length === 1 ? 'producto en tu carrito' : 'productos en tu carrito'}</span>
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="flex items-center gap-1.5 text-[#2C8A58] hover:text-[#1e613d] transition-colors font-medium"
            >
              <Trash2 size={14} />
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#6F6F6F] space-y-4 pb-20">
              <div className="w-24 h-24 bg-[#EAF4EB] rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12 text-[#7FA87A] opacity-50" />
              </div>
              <p className="text-center text-lg">Tu carrito está vacío.<br/>¡Añade frescura a tu día!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-6">
              {items.map((item, index) => (
                <React.Fragment key={item.product.id}>
                  {index > 0 && <div className="h-[1px] bg-[#ECE8E2] w-full" />}
                  <div className="flex gap-5 items-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-[90px] h-[90px] object-cover rounded-[20px] shadow-sm" 
                    />
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[20px] sm:text-[24px] text-[#1F2530] line-clamp-1 leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-[14px] sm:text-[16px] text-[#6F6F6F] line-clamp-2 leading-snug mt-1">
                            {item.product.description || 'Delicioso y natural, preparado al instante.'}
                          </p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#D9DED6] hover:text-red-400 transition-colors ml-2 mt-1"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-[20px] text-[#2C8A58]">
                          ${item.product.price}
                        </span>
                        
                        <div className="flex items-center gap-4 bg-white border border-[#D9DED6] rounded-full px-3 py-1.5 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-[#2C8A58] hover:opacity-70 transition-opacity"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="font-semibold text-[#1F2530] text-base w-5 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-[#2C8A58] hover:opacity-70 transition-opacity"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              
              {/* Info Banner */}
              <div className="mt-4 bg-[#FAFAFA] rounded-[16px] p-3 flex items-center justify-center gap-3 border border-[#F0F0F0]">
                <div className="w-8 h-8 bg-[#EAF4EB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-4 h-4 text-[#2C8A58]" />
                </div>
                <span className="text-[#6F6F6F] text-[13px]">
                  Todos nuestros productos son <span className="text-[#2C8A58] font-semibold">100% naturales</span> <Leaf className="w-3 h-3 inline-block text-[#2C8A58] ml-1 mb-0.5" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Summary */}
        <div className="border-t border-[#ECE8E2] px-8 py-6 bg-[#FCFBF8] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] rounded-bl-[32px] z-20">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[#6F6F6F] text-lg font-medium mb-1">Total</span>
            <span className="font-bold text-[36px] text-[#2C8A58] leading-none">${totalPrice}</span>
          </div>

          <div className="mb-4 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8F97]">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              placeholder="Dirección de Envío"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E6DF] rounded-[16px] focus:ring-2 focus:ring-[#2C8A58] focus:border-transparent outline-none text-[#1F2530] placeholder-[#8A8F97] shadow-sm text-[15px] transition-shadow"
            />
          </div>

          {error && <p className="text-red-500 text-[13px] mb-3 text-center font-medium">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || isProcessing}
            className={`w-full py-3.5 rounded-[16px] font-semibold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 ${
              items.length === 0 || isProcessing
                ? 'bg-[#E2E6DF] text-[#8A8F97] cursor-not-allowed'
                : 'bg-[#2C8A58] hover:bg-[#236C47] text-white shadow-[0_8px_20px_rgba(44,138,88,0.25)] hover:shadow-[0_12px_25px_rgba(44,138,88,0.35)] hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <span className="animate-pulse">Procesando...</span>
            ) : !user ? (
              <>
                <Lock size={18} />
                <span>Inicia sesión para pagar</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Pagar Pedido</span>
              </>
            )}
          </button>
          
          {/* Security Indicator */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[#2C8A58]">
            <ShieldCheck size={16} />
            <span className="text-[13px] font-medium">Pago 100% seguro</span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #D9DED6;
          border-radius: 10px;
        }
      `}} />
    </>
  );
}
