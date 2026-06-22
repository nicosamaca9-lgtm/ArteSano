import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Using the attached image as a logo fallback if it exists
import logoImg from '@/app/assets/logo_transparente.png';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';
  const textColor = isMenuPage ? 'text-black' : 'text-white';
  const hoverColor = isMenuPage ? 'hover:text-green-700' : 'hover:text-green-300';
  
  const { user, logout, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-14 h-14 flex items-center justify-center">
              <ImageWithFallback src={logoImg} alt="ArteSano Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`${textColor} font-caveat font-bold text-4xl tracking-tight`}>ArteSano</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Inicio</Link>
            <Link to="/menu" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Menú</Link>
            <a href="#contacto" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Contacto</a>
            <a href="#testimonios" className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors`}>Comentarios</a>
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                  <span className={`${textColor} font-montserrat font-medium`}>Hola, {user.name}</span>
                  <button onClick={logout} className={`${textColor} hover:text-red-400 font-montserrat font-medium transition-colors text-sm`}>Cerrar Sesión</button>
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className={`${textColor} ${hoverColor} font-montserrat font-medium transition-colors ml-4 pl-4 border-l border-white/20`}>
                  Iniciar Sesión
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className={`${textColor} ${hoverColor} focus:outline-none`}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
