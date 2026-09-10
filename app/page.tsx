'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { TickerBanner } from '@/components/TickerBanner';
import { SignatureSection } from '@/components/SignatureSection';
import { FullMenuSection } from '@/components/FullMenuSection';
import { OurStorySection } from '@/components/OurStorySection';
import { IngredientsSection } from '@/components/IngredientsSection';
import { ProcessSection } from '@/components/ProcessSection';
import { GallerySection } from '@/components/GallerySection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { VisitAndReserveSection } from '@/components/VisitAndReserveSection';
import { Footer } from '@/components/Footer';
import { OrderDrawer, CartItem } from '@/components/OrderDrawer';
import { MenuItem } from '@/lib/data';

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleScrollToReserve = () => {
    const el = document.getElementById('visit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#181514] selection:bg-[#E5381B] selection:text-white relative">
      {/* 1. TOP NAVIGATION */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReserve={handleScrollToReserve}
      />

      {/* 2. HERO SECTION */}
      <HeroSection onOpenReserve={handleScrollToReserve} />

      {/* 3. INFINITE MARQUEE TICKER BANNER */}
      <TickerBanner />

      {/* 4. SIGNATURE PIZZAS ("THE FAMOUS FEW") */}
      <SignatureSection onAddToCart={handleAddToCart} />

      {/* 5. FULL MENU (EMERALD GREEN PRICE LEDGER) */}
      <FullMenuSection onAddToCart={handleAddToCart} />

      {/* 6. OUR STORY ("A TINY OVEN AND A BIG OBSESSION") */}
      <OurStorySection />

      {/* 7. INGREDIENTS ("FIVE THINGS, DONE RIGHT") */}
      <IngredientsSection />

      {/* 8. PROCESS ("HOW A TONDO GETS MADE" - 01, 02, 03) */}
      <ProcessSection />

      {/* 9. GALLERY ("STRAIGHT FROM THE PASS") */}
      <GallerySection />

      {/* 10. REVIEWS ("PEOPLE ARE OBSESSED" - GOLDEN AMBER) */}
      <ReviewsSection />

      {/* 11. VISIT & TABLE RESERVATION ("COME GET A SLICE" - RED) */}
      <VisitAndReserveSection />

      {/* 12. FOOTER */}
      <Footer />

      {/* SLIDE-OVER ORDER BAG DRAWER */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </main>
  );
}
