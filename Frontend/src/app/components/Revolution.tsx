import React from 'react';
import logoArtesano from '@/app/assets/Logo_ArteSano.jpeg';

export function Revolution() {
  return (
    <section className="w-full bg-white">
      <div className="flex flex-col md:flex-row w-full min-h-[500px]">
        {/* Left: Large Top-down photo */}
        <div 
          className="w-full md:w-1/2 h-80 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: ` url(${logoArtesano})` }}
        />

        {/* Right: Content */}
        {/* 1. Cambiamos bg-stone-50 por bg-[#064E3B] */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 sm:p-12 lg:p-20 bg-[#064E3B]">
          
          {/* 2. Cambiamos text-[#064E3B] por text-white */}
          <h2 className="text-white font-caveat font-bold text-5xl sm:text-6xl leading-tight mb-6 tracking-tight">
            El arte de comer<br />
            <span className="relative inline-block">
              <span className="relative z-10">sano</span>
              {/* Le subí un poquito la opacidad al amarillo (/60) para que contraste mejor en el fondo oscuro */}
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-[#FBBF24]/60 -rotate-1 rounded-sm" />
            </span><br />y delicioso.
          </h2>
          
          {/* 3. Cambiamos text-gray-600 por text-white/90 (un blanco ligeramente suave para mejor lectura) */}
          <p className="text-white/90 font-montserrat text-lg mb-10 max-w-md leading-relaxed">
            Transformamos ingredientes naturales en experiencias llenas de sabor, energía y bienestar. Disfruta preparaciones equilibradas, nutritivas y creadas para cuidar de ti en cada bocado.
          </p>
          
          {/* 4. Invertimos el botón: fondo blanco y texto verde. También le añadí un hover gris claro. */}
          <button className="bg-white hover:bg-green-400 hover:text-white text-[#064E3B] font-montserrat font-semibold text-lg px-8 py-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            Pide por WhatsApp
          </button>
          
        </div>
      </div>
    </section>
  );
}