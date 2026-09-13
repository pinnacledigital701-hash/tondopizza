'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Plus, Clock, Store, RefreshCw, Bell } from 'lucide-react';
import { ownerStore } from '@/lib/ownerStore';

interface OwnerHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileNav: () => void;
  onNewOrder?: () => void;
  onNewReservation?: () => void;
}

export function OwnerHeader({
  title,
  subtitle,
  onOpenMobileNav,
  onNewOrder,
  onNewReservation,
}: OwnerHeaderProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isAccepting, setIsAccepting] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStore = () => {
    const settings = ownerStore.getSettings();
    const updated = {
      ...settings,
      orderAcceptingEnabled: !settings.orderAcceptingEnabled,
    };
    ownerStore.saveSettings(updated);
    setIsAccepting(updated.orderAcceptingEnabled);
  };

  return (
    <header className="sticky top-0 z-20 bg-[#F7F4EE]/95 backdrop-blur-md border-b-2 border-[#181514] px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
      {/* LEFT: TITLE & MOBILE TOGGLE */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 text-[#181514] bg-white rounded-xl border border-[#181514]/20 hover:bg-[#181514]/5 cursor-pointer active:scale-95"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#181514] uppercase tracking-tight leading-none">
              {title}
            </h1>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#E5381B]" />
          </div>
          {subtitle && (
            <p className="text-xs font-semibold text-[#181514]/60 uppercase tracking-wider mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: CLOCK, STATUS & QUICK ACTIONS */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* LIVE TIME & DATE */}
        <div className="hidden lg:flex flex-col items-end text-right pr-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#181514]">
            <Clock className="w-3.5 h-3.5 text-[#E5381B]" />
            <span>{timeStr || '12:00:00 PM'}</span>
          </div>
          <span className="text-[10px] font-mono text-[#181514]/60 uppercase tracking-wider">
            {dateStr || 'Today'}
          </span>
        </div>

        {/* ACCEPTING ORDERS TOGGLE */}
        <button
          onClick={handleToggleStore}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border-2 transition-all cursor-pointer active:scale-95 ${
            isAccepting
              ? 'bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/30 hover:bg-[#2D5A27]/20'
              : 'bg-red-50 text-red-700 border-red-300'
          }`}
          title="Toggle store online/offline for orders"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAccepting ? 'bg-[#2D5A27] animate-pulse' : 'bg-red-500'
            }`}
          />
          <span>{isAccepting ? 'ORDERS OPEN' : 'ORDERS PAUSED'}</span>
        </button>

        {/* QUICK NEW ORDER BUTTON */}
        {onNewOrder && (
          <button
            onClick={onNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E5381B] active:scale-95 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">NEW ORDER</span>
            <span className="sm:hidden">ORDER</span>
          </button>
        )}

        {/* QUICK NEW RESERVATION BUTTON */}
        {onNewReservation && (
          <button
            onClick={onNewReservation}
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#181514] border-2 border-[#181514] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#181514] hover:text-white active:scale-95 transition-all shadow-[2px_2px_0px_0px_#181514] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>BOOK TABLE</span>
          </button>
        )}
      </div>
    </header>
  );
}
