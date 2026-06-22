import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Headline with handwritten font + highlights */}
        <h2 className="font-caveat font-bold text-5xl md:text-6xl lg:text-7xl text-center text-gray-900 mb-4 leading-tight">
          Mira cómo{' '}
          <span className="relative inline-block">
            <span className="relative z-10">preparamos</span>
            <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-green-300/50 -rotate-1 rounded-sm" />
          </span>{' '}
          tu pedido
        </h2>
        <p className="font-caveat text-2xl md:text-3xl text-gray-500 text-center mb-14">
          ¡Del campo a tu mesa,{' '}
          <span className="relative inline-block">
            <span className="relative z-10">100% natural</span>
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4DD0E1] rounded-full" />
          </span>
          !
        </p>

        {/* Browser-style video frame */}
        <div className="w-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-gray-200/80 bg-white transition-transform hover:shadow-[0_30px_70px_rgba(0,0,0,0.16)] duration-500">
          {/* Browser top bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5F5] border-b border-gray-200">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white rounded-lg px-6 py-1.5 text-xs text-gray-400 border border-gray-200 max-w-xs w-full text-center font-montserrat tracking-wide">
                artesano.com/nuestro-proceso
              </div>
            </div>
            <div className="w-[52px]" /> {/* Spacer for symmetry */}
          </div>

          {/* Video area */}
          <div className="relative aspect-video bg-[#064E3B] overflow-hidden">
            {!isPlaying ? (
              <>
                {/* Video thumbnail */}
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1280"
                  alt="Nuestro proceso de preparación"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-80"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                {/* Play button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  aria-label="Reproducir video"
                >
                  <div className="relative">
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '2s' }} />
                    {/* Button */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <Play size={32} className="text-[#064E3B] ml-1 md:w-10 md:h-10" fill="currentColor" />
                    </div>
                  </div>
                </button>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-white/90 font-montserrat font-semibold text-lg md:text-xl">
                    Nuestro Proceso
                  </p>
                  <p className="text-white/60 font-montserrat text-sm mt-1">
                    2:45 min · Ingredientes frescos cada mañana
                  </p>
                </div>
              </>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                {/* Placeholder for embedded video - replace src with actual video URL */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title="ArteSano - Nuestro Proceso"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Close button */}
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar video"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
