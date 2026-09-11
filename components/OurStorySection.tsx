'use client';

import React from 'react';
import Image from 'next/image';

export function OurStorySection() {
  return (
    <section id="story" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN: EDITORIAL DOUGH TOSS PHOTOGRAPHY */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-lg mx-auto rounded-[36px] overflow-hidden border-2 border-[#181514]/10 shadow-lg group">
            <Image
              src="/storeinside.png"
              alt="Artisanal Neapolitan Pizza Dough Making"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Subtle dark vignette overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            
            {/* Decorative bottom stamp */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-bold tracking-widest uppercase">
              <span className="bg-[#181514]/70 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/20">
                Crafted In Eastside
              </span>
              <span className="text-white/80">Est. 2014</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STORY NARRATIVE */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E5381B] block mb-2">
              SINCE 2014
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#181514] uppercase leading-[0.9]">
              A TINY OVEN<br />
              AND A BIG<br />
              <span className="text-[#E5381B]">OBSESSION</span>
            </h2>
          </div>

          <div className="space-y-4 text-[#181514]/80 text-base sm:text-lg font-medium leading-relaxed">
            <p>
              Tondo started as a single wood oven in a converted garage. We had one rule:
              do one thing, and refuse to do it badly. A decade later that rule hasn’t changed
              — just the line out the door.
            </p>
            <p>
              We mill our own dough flour blend, crush tomatoes by hand each morning, and
              pull mozzarella daily. Nothing sits. Nothing freezes. Everything is round.
            </p>
          </div>

          {/* FOUNDER PROFILE BADGE */}
          <div className="pt-6 border-t border-[#181514]/15 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-[#181514]/20 shrink-0">
              <Image
                src="/ameliasanders.png"
                alt="Marco Tonelli - Head Pizzaiolo"
                fill
                sizes="64px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="font-display text-lg font-black tracking-wide text-[#181514] uppercase">
                AMELIA SANDERS
              </h4>
              <p className="text-xs font-semibold text-[#181514]/60 tracking-wider">
                Founder & head pizzaiolo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
