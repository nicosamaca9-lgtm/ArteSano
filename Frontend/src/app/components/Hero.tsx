import React from 'react';

export function Hero() {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514995669114-6081e934b693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3AlMjBkb3duJTIwZnJlc2glMjBmcnVpdCUyMHNtb290aGllJTIwaGVhbHRoeSUyMGNvbG9yZnVsfGVufDF8fHx8MTc4MTY0NzIxNnww&ixlib=rb-4.1.0&q=80&w=1080")' }}
      />
      
      {/* Dark Overlay (40% opacity) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-16">
        <h1 className="text-white font-caveat font-bold text-6xl sm:text-7xl md:text-8xl leading-tight mb-6 tracking-tight">
          <span className='x_wd_red_highlight_bold_05' >ArteSano, </span>
          frescura en cada{' '}
          <span className="relative inline-block">
            <span className="relative z-10">sorbo y bocado</span>
            <span className="absolute bottom-2 left-0 w-full h-3 md:h-4 bg-green-400/40 -rotate-1 rounded-sm" />
          </span>.
        </h1>
        <p className="text-white/95 font-caveat text-2xl sm:text-3xl md:text-4xl font-medium mb-10 max-w-2xl">
          Ingredientes 100% naturales.{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Sin conservantes</span>
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FBBF24] rounded-full" />
          </span>. Directo a tu puerta.
        </p>
        <button className="bg-green-500 hover:bg-green-400 text-white font-montserrat font-bold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 tracking-wide">
          PIDE ONLINE AHORA
        </button>
      </div>
    </div>
  );
}
