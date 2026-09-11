'use client';

import React from 'react';
import Image from 'next/image';
import { ALL_MENU_ITEMS, SIGNATURE_BURGERS, SIGNATURE_PIZZAS, MenuItem } from '@/lib/restaurantData';

interface MenuPreviewProps {
  onSelectItem?: (item: MenuItem) => void;
}

const normalizeSrc = (src?: string) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  return `/${src}`;
};

export function MenuPreview({ onSelectItem }: MenuPreviewProps) {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ALL_MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem?.(item)}
            className="bg-white border border-[#181514]/10 rounded-2xl p-5 hover:border-[#E5381B] transition-all cursor-pointer flex flex-col justify-between"
          >
            {item.image && (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#F7F4EE]">
                <Image
                  src={normalizeSrc(item.image)}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-display font-black text-lg text-[#181514]">{item.name}</h4>
                <span className="font-bold text-[#E5381B]">${item.price}</span>
              </div>
              <p className="text-xs text-[#181514]/70 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { SIGNATURE_BURGERS, SIGNATURE_PIZZAS };
