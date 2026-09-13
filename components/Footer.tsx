'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Lock } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#171312] text-white pt-20 pb-12 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          {/* LEFT: BRAND & NEWSLETTER */}
          <div className="lg:col-span-6 space-y-6">
            <a href="#home" className="flex items-center gap-3.5 group select-none">
              {/* 
                DYNAMIC FOOTER LOGO INTEGRATION:
                Wiped out the hardcoded double-nested placeholder circles.
                Dropped a clean image element linked to your root public asset directory.
              */}
              <img 
                src="/tondologo.png" 
                alt="Tondo Pizza Brand Signature Emblem Logo" 
                className="h-[76px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]" 
              />
              <span className="font-display text-2xl tracking-tighter text-white font-black">
                
              </span>
            </a>

            <p className="text-sm text-white/70 max-w-sm font-medium leading-relaxed">
              Get one new pizza drop, supper-club invites, and zero spam. Round things only.
            </p>

            {/* Newsletter input form */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-full bg-[#241E1C] border border-white/20 text-sm text-white placeholder-white/40 focus:outline-hidden focus:border-[#FDB827] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FDB827] text-[#181514] font-display text-xs font-black tracking-wider uppercase rounded-full hover:bg-[#e2a21e] active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  JOIN
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[#FDB827] bg-[#241E1C] px-5 py-3 rounded-full w-fit border border-[#FDB827]/30 animate-in fade-in">
                <Check className="w-4 h-4" />
                You’re in the pizza club. Watch your inbox.
              </div>
            )}
          </div>

          {/* RIGHT: EXPLORE & FOLLOW COLUMNS */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-12">
            {/* EXPLORE */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#FDB827]">
                EXPLORE
              </h4>
              <ul className="space-y-2.5 text-sm font-medium text-white/75">
                <li>
                  <a href="#menu" className="hover:text-white transition-colors">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#story" className="hover:text-white transition-colors">
                    Our story
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-white transition-colors">
                    How it&apos;s made
                  </a>
                </li>
                <li>
                  <a href="#visit" className="hover:text-white transition-colors">
                    Visit
                  </a>
                </li>
              </ul>
            </div>

            {/* FOLLOW */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#FDB827]">
                FOLLOW
              </h4>
              <ul className="space-y-2.5 text-sm font-medium text-white/75">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-white transition-colors">
                    Order delivery
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & OWNER ACCESS */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50 font-medium">
          <p>© 2026 Tondo Pizza Co. All pies reserved.</p>
          <div className="flex items-center gap-6">
            <p>Made by Pinnacle Digital Studios.</p>
            <Link
              href="/owner"
              className="flex items-center gap-1.5 text-white/30 hover:text-[#FDB827] font-mono text-[11px] uppercase tracking-wider transition-colors"
              title="Restaurant Owner Management Console"
            >
              <Lock className="w-3 h-3" />
              <span>OWNER ACCESS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
