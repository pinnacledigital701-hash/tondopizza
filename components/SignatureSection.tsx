'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Sparkles } from 'lucide-react';
import { SIGNATURE_PIZZAS, MenuItem } from '@/lib/data';

interface SignatureSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

const normalizeSrc = (src?: string) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  return `/${src}`;
};

export function SignatureSection({ onAddToCart }: SignatureSectionProps) {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  return (
    <section id="signature" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#181514]/60">
          THE FAMOUS FEW
        </span>
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#181514] uppercase leading-[0.9]">
          SIGNATURE PIZZAS<br />WORTH THE TRIP
        </h2>
      </div>

      {/* 3 SIGNATURE PIZZA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 max-w-6xl mx-auto">
        {SIGNATURE_PIZZAS.map((pizza) => {
          const isAdded = addedId === pizza.id;

          // Determine pill badge style
          const badgeStyle =
            pizza.badgeType === 'green'
              ? 'bg-[#157C41] text-white'
              : pizza.badgeType === 'black'
              ? 'bg-[#181514] text-white'
              : 'bg-[#E5381B] text-white';

          return (
            <div
              key={pizza.id}
              className="bg-[#FFFFFF] border-2 border-[#181514]/15 rounded-[32px] p-6 sm:p-7 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-[#181514] hover:shadow-xl group relative overflow-hidden"
            >
              {/* Top circle image showcase */}
              <div className="w-full aspect-square max-w-[260px] mx-auto relative mb-6 rounded-full overflow-hidden p-2 flex items-center justify-center">
                {/* Subtle backplate ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#181514]/15 group-hover:border-[#E5381B]/40 group-hover:rotate-45 transition-all duration-700" />
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-md group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={normalizeSrc(pizza.image)}
                    alt={pizza.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Pill badge */}
              <div className="mb-4">
                <span
                  className={`inline-block text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full ${badgeStyle}`}
                >
                  {pizza.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-6 w-full flex-1 flex flex-col justify-start">
                <h3 className="font-display text-3xl font-black tracking-tight text-[#181514] uppercase">
                  {pizza.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#181514]/75 font-medium leading-relaxed max-w-xs mx-auto">
                  {pizza.description}
                </p>

                {/* Key Ingredients tags */}
                {pizza.ingredients && (
                  <div className="pt-3 flex flex-wrap justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {pizza.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-[#F7F4EE] text-[#181514]/80 px-2.5 py-0.5 rounded-md border border-[#181514]/5"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Price & Add to Bag CTA */}
              <div className="w-full pt-4 border-t border-[#181514]/10 flex flex-col items-center gap-3">
                <span className="font-display text-3xl sm:text-4xl font-black text-[#E5381B] tracking-tight">
                  ${pizza.price}
                </span>

                <button
                  onClick={() => handleAdd(pizza)}
                  className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-[#157C41] text-white shadow-md'
                      : 'bg-[#181514] text-white hover:bg-[#E5381B] active:scale-95 shadow-xs'
                  }`}
                  id={`add-signature-${pizza.id}`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      ADDED TO BAG!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      ADD TO ORDER
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
