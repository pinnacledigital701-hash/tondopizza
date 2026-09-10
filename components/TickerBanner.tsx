'use client';

import React from 'react';
import { TICKER_ITEMS } from '@/lib/data';

export function TickerBanner() {
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-[#E5381B] py-3.5 sm:py-4.5 overflow-hidden border-y border-[#181514]/10 select-none shadow-xs">
      <div className="animate-marquee-slow flex items-center gap-6 sm:gap-10 text-white font-display text-sm sm:text-base tracking-widest uppercase whitespace-nowrap">
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-6 sm:gap-10">
            <span className="tracking-widest font-black">{item}</span>
            <span className="text-white/80 text-lg leading-none font-sans">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
}
