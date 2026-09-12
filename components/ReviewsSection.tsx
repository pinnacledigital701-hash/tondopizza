'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { REVIEWS } from '@/lib/data';

function ReviewAvatar({ src, alt }: { src: string; alt: string }) {
  const fallbackSrc =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt}
      fill
      sizes="44px"
      className="object-cover"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-[#FDB827] py-24 md:py-32 px-6 md:px-12 text-[#181514]">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center space-y-3 mb-16">
          {/* Top 5 black stars */}
          <div className="flex justify-center items-center gap-1.5 text-[#181514]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#181514] text-[#181514]" />
            ))}
          </div>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#181514] uppercase leading-[0.88]">
            PEOPLE ARE<br />OBSESSED
          </h2>
        </div>

        {/* 3 REVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {REVIEWS.map((review, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#181514] rounded-[28px] p-8 sm:p-9 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(24,21,20,1)] hover:shadow-[6px_6px_0px_0px_rgba(24,21,20,1)] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* 5 red stars inside card */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E5381B] text-[#E5381B]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-bold text-base sm:text-lg text-[#181514] leading-snug mb-8">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#181514]/10">
                <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#181514]/20 shrink-0">
                  <ReviewAvatar src={review.avatar} alt={review.author} />
                </div>
                <div>
                  <h4 className="font-display text-base font-black text-[#181514] uppercase">
                    {review.author}
                  </h4>
                  <p className="text-xs font-semibold text-[#181514]/60">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
