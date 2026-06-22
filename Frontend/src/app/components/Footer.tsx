import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImg from '@/app/assets/logo_transparente.png';

export function Footer() {
  return (
    <footer className="w-full flex flex-col font-montserrat bg-[#064E3B]">
      {/* Main Footer */}
      <div className="py-16 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Logo and Brief */}
        <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-left">
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <ImageWithFallback src={logoImg} alt="ArteSano Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-caveat font-bold text-4xl text-white mb-2 tracking-tight">ArteSano</h3>
          <p className="text-sm text-green-100/80">
            Comida real para gente real. Cuidamos cada ingrediente para nutrirte por dentro y por fuera.
          </p>
        </div>

        {/* Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">Encuéntranos</h4>
          <p className="text-green-100/80 text-sm mb-1">W943+C7R Merida, Yucatan, Mexico</p>
          <p className="text-green-100/80 text-sm">Lunes - Sábado: 8am - 9pm</p>
          <p className="text-green-300 text-sm mt-2 font-medium hover:text-green-200 transition-colors cursor-pointer">artesanoexpressmx@gmail.com</p>
        </div>

        {/* Map Preview */}
        <div className="relative w-full max-w-[260px] h-36 rounded-lg overflow-hidden shadow-xl border border-white/20 group flex-shrink-0">
          <iframe 
            src="https://maps.google.com/maps?q=W943+C7R%20Merida,%20Yucatan,%20Mexico&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-full pointer-events-none grayscale-[10%]"
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center transition-all duration-300 group-hover:bg-black/10">
            <a 
              href="https://maps.app.goo.gl/xtuAziKzFwJDMJH56" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#0071c2] hover:bg-[#005999] text-white font-bold text-sm py-2.5 px-4 rounded shadow-md transform transition-transform hover:scale-105 flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Ver en el mapa
            </a>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">Síguenos</h4>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/arte.sanoexpress?igsh=MTQ2dWNmZ2dnYTB3aA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#064E3B] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://wa.link/kmw0ua" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#064E3B] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Sub-footer */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-green-100/60 font-medium tracking-wide">
        <p className="mb-2 sm:mb-0">© 2026 ArteSano. Todos los derechos reservados.</p>
        <p>Hecho con amor y mucho 🥑</p>
      </div>
    </footer>
  );
}
