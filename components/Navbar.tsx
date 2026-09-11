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

  const handleScrollToReserve = () => {
    onOpenReserve();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuLinks = [
    { label: 'MENU', href: '#menu' },
    { label: 'STORY', href: '#story' },
    { label: 'HOW', href: '#how' },
    { label: 'VISIT', href: '#visit' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F4EE]/90 backdrop-blur-md shadow-xs border-b border-[#181514]/10 py-3.5'
          : 'bg-[#F7F4EE]/80 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="#home"
          className="flex items-center gap-3.5 group relative select-none transition-transform duration-200 active:scale-95"
          id="brand-logo"
        >
          <img 
            src="/tondologo.png" 
            alt="Tondo Logo" 
            className="h-[86px] sm:h-[98px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(24,21,20,0.12)] -my-4 relative z-10" 
          />
          <span className="font-display text-2xl tracking-tighter text-[#181514] font-black">
            
          </span>
        </a>

        {/* DESKTOP NAV LINKS WITH EXPANDING UNDERLINE TRACKS */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-[#181514]">
          {menuLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-1 group/link transition-colors duration-200 hover:text-[#E5381B]"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#E5381B] transition-all duration-300 ease-out group-hover/link:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA & CART ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full border border-[#181514]/20 hover:border-[#181514] hover:bg-[#181514]/5 transition-all text-[#181514] cursor-pointer active:scale-90"
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
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#E5381B] active:scale-95 transition-all shadow-xs cursor-pointer"
            id="order-now-btn"
          >
            ORDER NOW
          </button>

          {/* MOBILE TOGGLE WITH HAPTIC POP EFFECT */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#181514] rounded-lg hover:bg-[#181514]/5 transition-colors cursor-pointer active:scale-90"
            aria-label="Toggle navigation menu"
            id="mobile-nav-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6 animate-in spin-in-90 duration-200" /> : <MenuIcon className="w-6 h-6 animate-in fade-in duration-200" />}
          </button>
        </div>
      </div>

      {/* RE-ARCHITECTED MOBILE OVERLAY WITH SPRING SELECTION LINKS */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F7F4EE] border-b border-[#181514]/10 px-8 py-8 space-y-5 shadow-xl animate-in slide-in-from-top-4 duration-300 ease-out">
          {menuLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="block font-display text-2xl font-black uppercase tracking-wide py-2 text-[#181514] hover:text-[#E5381B] active:translate-x-2 transition-all duration-200 animate-in slide-in-from-left-4"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3.5">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCart();
              }}
              className="w-full py-4 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-full text-center hover:bg-[#E5381B] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              ORDER NOW ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleScrollToReserve();
              }}
              className="w-full py-4 border-2 border-[#181514] text-[#181514] font-bold text-xs uppercase tracking-wider rounded-full text-center hover:bg-[#181514] hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              BOOK A TABLE
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
