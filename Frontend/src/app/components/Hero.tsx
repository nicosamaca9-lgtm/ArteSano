import React from 'react';
import { Leaf, ShoppingBag } from 'lucide-react';
import fondoHero from '../assets/fondo_hero.png';

export function Hero() {
  return (
    <div className="relative w-full min-h-screen bg-[#FCFBF8] flex items-center overflow-hidden">
      
      {/* Background Image Container (Right Side Full Bleed) */}
      <div className="absolute top-0 right-0 w-full md:w-[60%] h-full z-0">
        <img 
          src={fondoHero} 
          alt="Premium lifestyle fresh food smoothie" 
          className="w-full h-full object-cover object-right"
        />
        {/* Gradient overlay to blend the image smoothly into the background color on the left edge */}
        <div className="hidden md:block absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-[#FCFBF8] to-transparent pointer-events-none" />
        {/* Gradient overlay for mobile (top edge) */}
        <div className="md:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FCFBF8] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center h-full pt-[90px] md:pt-0">
        
        {/* Left Column (Content) */}
        <div className="w-full md:w-[50%] flex flex-col items-start justify-center py-12 md:py-20 bg-[#FCFBF8]/90 md:bg-transparent rounded-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none p-6 md:p-0 mt-20 md:mt-0 shadow-lg md:shadow-none">
          
          {/* Badge */}
          <div className="flex items-center gap-2 bg-[#EAF4EB] rounded-full px-4 py-2 mb-6 shadow-sm">
            <Leaf className="w-4 h-4 text-[#7FA87A]" />
            <span 
              className="text-[#7FA87A] font-medium text-sm tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              100% NATURALES
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className="font-bold text-5xl sm:text-6xl md:text-[76px] leading-[1.1] text-[#1F2530] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-[#7FA87A]">Frescura</span> en <br />
            cada{' '}
            <span className="relative inline-block text-[#EF8A7A]">
              <span className="relative z-10">bocado</span>
              <span className="absolute bottom-2 left-0 w-full h-[8px] bg-[#F3D8B8] -z-10 rounded-full" />
            </span>
            <span className="inline-block ml-3 transform -translate-y-2">
              <Leaf className="w-8 h-8 text-[#7FA87A] -rotate-12" />
            </span>
          </h1>

          {/* Supporting paragraph */}
          <p 
            className="text-[#6F6F6F] text-lg sm:text-[20px] leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ingredientes 100% naturales y frescos para cuidar de ti en cada momento. Descubre el verdadero sabor de lo natural, sin conservantes, directo a tu mesa.
          </p>

          {/* CTA & Trust Indicator */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 w-full">
            {/* CTA Button */}
            <a 
              href="https://wa.link/kmw0ua" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-3 bg-[#FF6F6A] hover:bg-[#F45C57] text-white font-medium text-lg px-8 py-4 rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_45px_rgba(255,111,106,0.3)] transition-all duration-300 transform hover:-translate-y-0.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <ShoppingBag className="w-6 h-6" />
              Pide Online Ahora
            </a>
            
            {/* Trust Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF4EB] flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-[#7FA87A]" />
              </div>
              <span 
                className="text-sm text-[#6F6F6F] leading-tight max-w-[120px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Ingredientes 100% naturales
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
