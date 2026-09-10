'use client';

import React from 'react';
import Image from 'next/image';
import { INGREDIENTS } from '@/lib/data';

export function IngredientsSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#181514]/10">
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#181514]/60">
          FIVE THINGS, DONE RIGHT
        </span>
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#181514] uppercase leading-[0.9]">
          IT’S ALL ABOUT<br />THE INGREDIENTS
        </h2>
      </div>

      {/* 5 INGREDIENT CIRCLES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 justify-items-center">
        {INGREDIENTS.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center group w-full max-w-[190px]"
          >
            {/* Circular image container */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden relative mb-4 border-2 border-[#181514]/15 shadow-sm group-hover:border-[#E5381B] group-hover:scale-105 transition-all duration-300">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 140px, 180px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Label */}
            <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#181514] uppercase group-hover:text-[#E5381B] transition-colors">
              {item.name}
            </h3>

            {/* Micro description */}
            <p className="text-xs text-[#181514]/70 font-semibold leading-relaxed mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
