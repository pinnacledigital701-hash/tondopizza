'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReserve: () => void;
}

export function Navbar({ cartCount, onOpenCart, onOpenReserve }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F4EE]/90 backdrop-blur-md shadow-xs border-b border-[#181514]/10 py-3.5'
          : 'bg-[#F7F4EE]/80 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="#home"
          className="flex items-center gap-2 group transition-transform duration-200 active:scale-95"
          id="brand-logo"
        >
          {/* Tondo circular icon */}
          <div className="w-8 h-8 rounded-full border-2 border-[#181514] flex items-center justify-center relative overflow-hidden bg-transparent group-hover:border-[#E5381B] transition-colors">
            <div className="w-4 h-4 rounded-full border border-dashed border-[#181514] group-hover:border-[#E5381B] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E5381B]" />
            </div>
            <span className="sr-only">Tondo</span>
          </div>
          <span className="font-display text-2xl tracking-tighter text-[#181514] font-black">
            TONDO
          </span>
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-[#181514]">
          <a
            href="#menu"
            className="hover:text-[#E5381B] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E5381B] hover:after:w-full after:transition-all"
          >
            MENU
          </a>
          <a
            href="#story"
            className="hover:text-[#E5381B] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E5381B] hover:after:w-full after:transition-all"
          >
            STORY
          </a>
          <a
            href="#how"
            className="hover:text-[#E5381B] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E5381B] hover:after:w-full after:transition-all"
          >
            HOW
          </a>
          <a
            href="#visit"
            className="hover:text-[#E5381B] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E5381B] hover:after:w-full after:transition-all"
          >
            VISIT
          </a>
        </nav>

        {/* CTA & CART ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full border border-[#181514]/20 hover:border-[#181514] hover:bg-[#181514]/5 transition-all text-[#181514]"
            aria-label="View order bag"
            id="open-cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E5381B] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#E5381B] active:scale-95 transition-all shadow-xs"
            id="order-now-btn"
          >
            ORDER NOW
          </button>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#181514] rounded-lg hover:bg-[#181514]/5 transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-nav-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F7F4EE] border-b border-[#181514]/10 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <a
            href="#menu"
            onClick={() => setMobileOpen(false)}
            className="block font-bold uppercase tracking-wider text-sm py-2 hover:text-[#E5381B]"
          >
            MENU
          </a>
          <a
            href="#story"
            onClick={() => setMobileOpen(false)}
            className="block font-bold uppercase tracking-wider text-sm py-2 hover:text-[#E5381B]"
          >
            STORY
          </a>
          <a
            href="#how"
            onClick={() => setMobileOpen(false)}
            className="block font-bold uppercase tracking-wider text-sm py-2 hover:text-[#E5381B]"
          >
            HOW
          </a>
          <a
            href="#visit"
            onClick={() => setMobileOpen(false)}
            className="block font-bold uppercase tracking-wider text-sm py-2 hover:text-[#E5381B]"
          >
            VISIT
          </a>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCart();
              }}
              className="w-full py-3 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-full text-center hover:bg-[#E5381B] transition-colors"
            >
              ORDER NOW ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenReserve();
              }}
              className="w-full py-3 border border-[#181514] text-[#181514] font-bold text-xs uppercase tracking-wider rounded-full text-center hover:bg-[#181514]/5 transition-colors"
            >
              BOOK A TABLE
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
