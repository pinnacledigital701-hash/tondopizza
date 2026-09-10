'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export function GallerySection() {
  const photos = [
    {
      src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      alt: 'Woodfired Pizza Straight From The Pass',
      className: 'col-span-1 md:col-span-1 row-span-2 aspect-[3/4] md:aspect-auto',
    },
    {
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      alt: 'Brick Oven Pizza Hot Pan',
      className: 'col-span-1 aspect-square',
    },
    {
      src: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800&auto=format&fit=crop',
      alt: 'Burrata and Basil Neapolitan Pizza',
      className: 'col-span-1 aspect-square',
    },
    {
      src: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800&auto=format&fit=crop',
      alt: 'Artisanal Leopard Crust Pizza Round',
      className: 'col-span-1 md:col-span-1 row-span-2 aspect-[3/4] md:aspect-auto',
    },
    {
      src: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop',
      alt: 'Crispy Charred Pepperoni Cups with Chili Honey',
      className: 'col-span-1 aspect-square',
    },
    {
      src: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop',
      alt: 'Epic Molten Fior di Latte Cheese Stretch',
      className: 'col-span-1 aspect-square',
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#181514] uppercase leading-[0.9]">
          STRAIGHT FROM<br />THE PASS
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-bold text-[#181514]/70 hover:text-[#E5381B] transition-colors flex items-center gap-1.5"
        >
          <Instagram className="w-4 h-4 text-[#E5381B]" />
          Tag <span className="text-[#E5381B]">@tondopizza</span> and you might end up on the wall.
        </a>
      </div>

      {/* MOSAIC BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {photos.map((photo, i) => (
          <div
            key={i}
            className={`relative rounded-[24px] overflow-hidden group border border-[#181514]/10 shadow-xs ${photo.className}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Subtle hover overlay with Instagram tag icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <span className="text-white font-bold text-xs uppercase tracking-wider bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#E5381B]" />
                @tondopizza
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
