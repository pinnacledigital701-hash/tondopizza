'use client';

import React from 'react';
import { ArrowDown, Flame } from 'lucide-react';

interface HeroSectionProps {
  onOpenReserve: () => void;
}

export function HeroSection({ onOpenReserve }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT COLUMN: HEADLINE & COPY */}
        <div className="lg:col-span-7 space-y-6 text-left z-10">
          <div className="space-y-0 select-none">
            <h1 className="font-display text-6xl sm:text-8xl xl:text-9xl tracking-tight text-[#181514] uppercase leading-[0.88]">
              BIG.<br />
              <span className="text-[#E5381B]">BOLD.</span><br />
              PERFECTLY<br />
              ROUND.
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[#181514]/80 max-w-xl font-medium leading-relaxed pt-2">
            48-hour dough, San Marzano tomatoes, and a 450°C wood oven. We make
            exactly one thing pizza — and we make it ridiculously well.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <a
              href="#menu"
              className="px-8 py-4 bg-[#E5381B] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#c92f15] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center gap-2"
              id="hero-see-menu-btn"
            >
              SEE THE MENU
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenReserve}
              className="px-8 py-4 border-2 border-[#181514] text-[#181514] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#181514] hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              id="hero-book-table-btn"
            >
              BOOK A TABLE
            </button>
          </div>

          {/* Quick micro-badges */}
          <div className="pt-6 flex items-center gap-6 text-xs text-[#181514]/60 font-semibold tracking-wide">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#E5381B]" /> Oak Woodfired
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#181514]/30" />
            <span>48hr Cold Ferment</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#181514]/30" />
            <span>D.O.P. Certified</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PREMIUM HIGH-END PHOTOGRAPHY MATRIX */}
        <div className="lg:col-span-5 relative flex justify-center items-center select-none py-6 lg:pl-6">
          {/* Soft premium ambient warm background glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#E5381B]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* 
            SCALED UP RECTANGLE ENVELOPE: 
            Increased mobile dimension from max-w-[420px] to max-w-[460px].
            Increased desktop bounding grid from default to max-w-[560px].
          */}
          <div className="relative w-full max-w-[460px] sm:max-w-[560px] aspect-square animate-float-pizza flex items-center justify-center">
            <img 
              src="/hero-pizza.png" 
              alt="Bjorbun Woodfired Pizza Masterpiece" 
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(24,21,20,0.35)] transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
