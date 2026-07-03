import React from 'react';
import { Instagram, MapPin, Clock, Mail, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImg from '@/app/assets/logo_transparente.png';

export function Footer() {
  return (
    <footer id="contacto" className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#FCFBF8] border-t border-[#ECE8E2]">
      {/* Main Footer Content */}
      <div className="max-w-[1360px] mx-auto py-16 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-center">
          
          {/* Column 1: Logo and Brand */}
          <div className="flex items-center gap-5 justify-center lg:justify-start">
            <div 
              className="w-[88px] h-[88px] flex items-center justify-center"
            >
              <ImageWithFallback src={logoImg} alt="ArteSano Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-poppins font-medium text-[26px] text-[#1F2530] tracking-tight leading-none mb-1">
                Arte<span className="text-[#EF735F]">Sano</span>
              </h3>
              <p className="font-inter text-[9px] sm:text-[10px] text-[#6F6F6F] tracking-[0.2em] uppercase">
                Alimentos que te hacen bien
              </p>
            </div>
          </div>

          {/* Column 2: Encuéntranos */}
          <div className="flex flex-col gap-5 justify-center lg:justify-start">
            <h4 className="font-poppins font-semibold text-[13px] text-[#1F2530] uppercase tracking-wider text-center lg:text-left">
              Encuéntranos
            </h4>
            <div className="flex flex-col gap-3.5 mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-[#6F6F6F]">
                <MapPin size={18} strokeWidth={1.5} className="shrink-0" />
                <span className="font-inter text-[14px]">W943+C7R Merida, Yucatan, Mexico</span>
              </div>
              <div className="flex items-center gap-3 text-[#6F6F6F]">
                <Clock size={18} strokeWidth={1.5} className="shrink-0" />
                <span className="font-inter text-[14px]">Lunes - Sábado: 8am - 9pm</span>
              </div>
              <div className="flex items-center gap-3 text-[#6F6F6F]">
                <Mail size={18} strokeWidth={1.5} className="shrink-0" />
                <span className="font-inter text-[14px]">artesanoexpressmx@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-[#6F6F6F]">
                <Phone size={18} strokeWidth={1.5} className="shrink-0" />
                <span className="font-inter text-[14px]">+52 999 123 4567</span>
              </div>
            </div>
          </div>

          {/* Column 3: Map Preview */}
          <div className="flex justify-center">
            <div 
              className="bg-white p-2 rounded-[24px] w-full max-w-[280px]" 
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
            >
              <div className="w-full h-[110px] rounded-[18px] overflow-hidden mb-2 relative bg-[#F5F3ED] flex items-center justify-center">
                <iframe 
                  src="https://maps.google.com/maps?q=W943+C7R%20Merida,%20Yucatan,%20Mexico&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  className="absolute inset-0 w-full h-full opacity-50 pointer-events-none grayscale"
                  style={{ border: 0 }} 
                  loading="lazy" 
                />
                <MapPin size={34} className="text-[#2C8A58] relative z-10 drop-shadow-md" fill="white" />
              </div>
              <a 
                href="https://maps.app.goo.gl/xtuAziKzFwJDMJH56" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#2C8A58] hover:bg-[#236b44] text-white font-poppins font-medium text-[14px] py-3 rounded-[16px] flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin size={16} />
                Ver en el mapa
              </a>
            </div>
          </div>

          {/* Column 4: Síguenos */}
          <div className="flex flex-col gap-5 items-center lg:items-start">
            <h4 className="font-poppins font-semibold text-[13px] text-[#1F2530] uppercase tracking-wider">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/arte.sanoexpress?igsh=MTQ2dWNmZ2dnYTB3aA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-[#7FA87A] hover:text-[#2C8A58] transition-colors"
                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}
              >
                <Instagram size={18} strokeWidth={2} />
              </a>
              <a 
                href="https://wa.link/kmw0ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-[#7FA87A] hover:text-[#2C8A58] transition-colors"
                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}
              >
                {/* WhatsApp SVG Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[#ECE8E2] bg-transparent">
        <div className="max-w-[1360px] mx-auto py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-[13px] text-[#6F6F6F] font-inter">
          <p className="mb-2 sm:mb-0">© 2026 ArteSano. Todos los derechos reservados.</p>
          <p>Hecho con amor y mucho 🥑</p>
        </div>
      </div>
    </footer>
  );
}
