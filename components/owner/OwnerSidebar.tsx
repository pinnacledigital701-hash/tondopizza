'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Users,
  BookOpen,
  Settings,
  ExternalLink,
  LogOut,
  Flame,
  X,
} from 'lucide-react';
import { ownerStore } from '@/lib/ownerStore';

interface OwnerSidebarProps {
  pendingOrdersCount: number;
  todayReservationsCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout: () => void;
}

export function OwnerSidebar({
  pendingOrdersCount,
  todayReservationsCount,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: OwnerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'DASHBOARD',
      sublabel: 'Overview & Queue',
      href: '/owner',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'ORDERS',
      sublabel: 'Kitchen & Takeaway',
      href: '/owner/orders',
      icon: UtensilsCrossed,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeAlert: true,
    },
    {
      label: 'RESERVATIONS',
      sublabel: 'Table Bookings',
      href: '/owner/reservations',
      icon: CalendarDays,
      badge: todayReservationsCount > 0 ? todayReservationsCount : null,
      badgeAlert: false,
    },
    {
      label: 'CUSTOMERS',
      sublabel: 'Guest Directory',
      href: '/owner/customers',
      icon: Users,
      badge: null,
    },
    {
      label: 'MENU',
      sublabel: 'Items & 86 List',
      href: '/owner/menu',
      icon: BookOpen,
      badge: null,
    },
    {
      label: 'SETTINGS',
      sublabel: 'Oven & Hours',
      href: '/owner/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#181514] text-[#F7F4EE] border-r border-[#181514] shadow-xl">
      {/* BRAND HEADER */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/owner" className="flex items-center gap-3.5 group select-none">
          <img
            src="/tondologo.png"
            alt="Tondo Logo"
            className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(229,56,27,0.3)]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-black tracking-tight text-white">
                TONDO
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#E5381B] text-white px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                OPS
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              RESTAURANT CONSOLE
            </p>
          </div>
        </Link>

        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-white/60 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* OVEN STATUS CARD */}
      <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-[#221E1D] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E5381B]/15 text-[#E5381B] flex items-center justify-center">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#FDB827] uppercase tracking-wider font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A27] animate-ping" />
              900°F WOOD OVEN
            </div>
            <p className="text-xs font-bold text-white uppercase">Forno Fired & Live</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/owner'
              ? pathname === '/owner'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold transition-all group ${
                isActive
                  ? 'bg-[#E5381B] text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white'
                  }`}
                />
                <div>
                  <span className="font-display text-sm tracking-wide block uppercase leading-none">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono block mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-white/40'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>
              </div>

              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-black ${
                    isActive
                      ? 'bg-[#181514] text-white'
                      : item.badgeAlert
                      ? 'bg-[#E5381B] text-white animate-pulse'
                      : 'bg-[#FDB827] text-[#181514]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider">Firebase Cloud</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400/90 font-bold uppercase tracking-wider">Online</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Public Website
          </span>
          <span className="text-[10px] font-mono text-white/40">Live Tab</span>
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Console</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP STATIC SIDEBAR */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-col fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
