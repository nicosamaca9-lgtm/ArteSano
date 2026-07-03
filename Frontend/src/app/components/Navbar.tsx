import React, { useState, useRef, useEffect } from 'react';
import { Menu, ShoppingCart, UserCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Using the attached image as a logo fallback if it exists
import logoImg from '@/app/assets/logo_transparente.png';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';
  const textColor = 'text-black';
  const hoverColor = 'hover:text-[#9CB88A]';
  
  const { user, logout, loading, openAuthModal } = useAuth();
  const { totalItems, openCart } = useCart();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleAuth = (mode: 'login' | 'register') => {
    openAuthModal(mode);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm" style={{ height: '90px' }}>
      <div className="w-full h-full px-6 md:px-16 lg:px-24">
        <div className="h-full flex items-center justify-between relative">
          
          {/* Zona Izquierda: Logo */}
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 flex items-center justify-center">
              <ImageWithFallback src={logoImg} alt="ArteSano Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-caveat font-bold text-5xl tracking-tight">
              <span className="text-black">Arte</span>
              <span className="text-[#8B4513]">Sano</span>
            </span>
          </div>
          
          {/* Zona Central: Links (Absoluto para asegurar centro perfecto) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            <Link to="/" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Inicio</Link>
            <Link to="/menu" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Menú</Link>
            <a href="#testimonios" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Comentarios</a>
            <a href="#contacto" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Contacto</a>
          </div>

          {/* Zona Derecha: Iconos */}
          <div className="hidden md:flex items-center gap-6 z-10">
            {/* Carrito Pastilla */}
            <button 
              onClick={openCart}
              className="flex items-center gap-2 bg-[#9CB88A] rounded-[24px] px-5 py-2.5 transition-transform hover:scale-105 shadow-sm"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF9999] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-white font-montserrat font-medium text-sm">Carrito</span>
            </button>

            {/* Mi Cuenta */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={handleUserClick}
                className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
              >
                <UserCircle size={32} className="text-[#5C5C5C]" fill="white" />
              </button>

              {/* Dropdown Mi Cuenta */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                  {!loading && (
                    user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="font-montserrat text-sm text-gray-500">Conectado como</p>
                          <p className="font-montserrat font-bold text-gray-800 truncate">{user.name}</p>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleAuth('login')}
                          className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-gray-700 hover:bg-gray-50 hover:text-[#064E3B] transition-colors"
                        >
                          Iniciar Sesión
                        </button>
                        <button 
                          onClick={() => handleAuth('register')}
                          className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-gray-700 hover:bg-gray-50 hover:text-[#064E3B] transition-colors"
                        >
                          Regístrate
                        </button>
                      </>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-10">
            <button className={`${textColor} ${hoverColor} focus:outline-none`}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
