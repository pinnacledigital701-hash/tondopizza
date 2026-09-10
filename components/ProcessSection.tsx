'use client';

import React from 'react';
import { PROCESS_STEPS } from '@/lib/data';

export function ProcessSection() {
  return (
    <section id="how" className="bg-[#1C1715] text-white py-24 md:py-32 px-6 md:px-12 my-12">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="space-y-3 mb-16 text-left">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E5381B] block">
            FROM FLOUR TO FIRE
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[0.9]">
            HOW A TONDO<br />GETS MADE
          </h2>
        </div>

        {/* 3 PROCESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={index}
              className="bg-[#241E1C] border border-[#3A2F2C] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:border-[#E5381B]/50 transition-all duration-300 group"
            >
              <div>
                {/* Big Step Number */}
                <span className={`font-display text-6xl sm:text-7xl font-black block mb-6 leading-none ${step.numberColor}`}>
                  {step.number}
                </span>

                {/* Step Title */}
                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wide text-white uppercase mb-4 group-hover:text-[#FDB827] transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress indicator bar */}
              <div className="mt-8 pt-6 border-t border-[#3A2F2C] flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-widest">
                <span>Phase {step.number} of 03</span>
                <div className="w-12 h-1 bg-[#3A2F2C] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E5381B]"
                    style={{ width: `${((index + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
