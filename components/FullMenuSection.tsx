'use client';

import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { MENU_CATEGORIES, MenuItem } from '@/lib/data';

interface FullMenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export function FullMenuSection({ onAddToCart }: FullMenuSectionProps) {
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const handleAdd = (item: { id: string; name: string; description: string; price: number }, catId: string) => {
    onAddToCart({
      id: item.id,
      name: item.name.toUpperCase(),
      description: item.description,
      price: item.price,
      category: catId as any,
    });
    setAddedItemName(item.id);
    setTimeout(() => {
      setAddedItemName(null);
    }, 1500);
  };

  return (
    <section id="menu" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      <div className="bg-[#2D5A27] text-white rounded-[36px] sm:rounded-[48px] p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full border-[30px] border-white/5 pointer-events-none" />

        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/15">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#A6E3B8] block mb-2">
              LA CARTA COMPLETA
            </span>
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-[0.88]">
              THE FULL<br />MENU
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#D4F1DE] max-w-sm font-medium leading-relaxed">
            Every pie is 12&quot;. Add a side, grab a Negroni, stay a while. Prices in USD.
          </p>
        </div>

        {/* 4 QUADRANT MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pt-12">
          {MENU_CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-6">
              {/* Category Title */}
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wide text-white uppercase border-b border-white/20 pb-2 flex items-center justify-between">
                <span>{cat.title}</span>
                <span className="text-xs font-normal tracking-widest text-[#A6E3B8]">
                  {cat.items.length} OPTIONS
                </span>
              </h3>

              {/* Items List */}
              <div className="space-y-5">
                {cat.items.map((item) => {
                  const isAdded = addedItemName === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAdd(item, cat.id)}
                      className="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-white/10 transition-colors"
                      id={`menu-item-${item.id}`}
                    >
                      {/* Name + Dotted Leader + Price */}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-base sm:text-lg text-white group-hover:text-[#FFF8DC] transition-colors flex items-center gap-2">
                          {item.name}
                        </span>

                        {/* Dotted Leader line */}
                        <div className="flex-1 mx-2 border-b-2 border-dotted border-white/25 min-w-[20px]" />

                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg sm:text-xl font-black text-white">
                            ${item.price}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdd(item, cat.id);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isAdded
                                ? 'bg-[#FDB827] text-[#181514]'
                                : 'bg-white/20 group-hover:bg-white text-white group-hover:text-[#157C41]'
                            }`}
                            title="Add to order bag"
                            aria-label={`Add ${item.name} to order`}
                          >
                            {isAdded ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#C2E9CF] font-medium leading-normal mt-0.5 pr-8">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom allergen note */}
        <div className="mt-14 pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#A6E3B8]">
          <p>Dough made with organic Italian wheat. Gluten-friendly options available upon request.</p>
          <div className="flex gap-4 uppercase font-bold tracking-wider text-[11px]">
            <span> Vegetarian Options</span>
            <span> Woodfired 450°C</span>
          </div>
        </div>
      </div>
    </section>
  );
}
