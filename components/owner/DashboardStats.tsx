'use client';

import React from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { OrderRecord, ReservationRecord } from '@/lib/ownerStore';

interface DashboardStatsProps {
  orders: OrderRecord[];
  reservations: ReservationRecord[];
  onFilterOrdersByStatus?: (status: string) => void;
}

export function DashboardStats({ orders, reservations }: DashboardStatsProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's orders
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayOrdersCount = todayOrders.length;

  // Pending orders requiring action (NEW or PREPARING)
  const pendingOrders = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PREPARING'
  );
  const pendingOrdersCount = pendingOrders.length;

  // Completed today
  const completedTodayCount = todayOrders.filter(
    (o) => o.status === 'COMPLETED'
  ).length;

  // Today's reservations
  const todayReservations = reservations.filter((r) => r.date === todayStr && r.status !== 'CANCELLED');
  const todayReservationsCount = todayReservations.length;
  const todayTotalGuests = todayReservations.reduce((acc, r) => acc + r.guests, 0);

  // Revenue today
  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  // Upcoming upcoming reservations
  const upcomingReservations = reservations.filter(
    (r) => r.date >= todayStr && (r.status === 'CONFIRMED' || r.status === 'NEW')
  );

  const stats = [
    {
      title: "TODAY'S ORDERS",
      value: todayOrdersCount,
      subtext: `${pendingOrdersCount} active in kitchen/pass`,
      icon: ShoppingBag,
      color: 'bg-[#E5381B]',
      textColor: 'text-white',
      accentColor: 'text-[#FFE8D6]',
    },
    {
      title: 'PENDING KITCHEN',
      value: pendingOrdersCount,
      subtext: `${orders.filter((o) => o.status === 'NEW').length} new unconfirmed`,
      icon: Flame,
      color: 'bg-[#FDB827]',
      textColor: 'text-[#181514]',
      accentColor: 'text-[#181514]/70',
      highlight: pendingOrdersCount > 0,
    },
    {
      title: 'COMPLETED TODAY',
      value: completedTodayCount,
      subtext: 'Pies fired & dispatched',
      icon: CheckCircle2,
      color: 'bg-[#2D5A27]',
      textColor: 'text-white',
      accentColor: 'text-[#A6E3B8]',
    },
    {
      title: 'TODAY RESERVATIONS',
      value: todayReservationsCount,
      subtext: `${todayTotalGuests} seated / expected covers`,
      icon: Calendar,
      color: 'bg-[#181514]',
      textColor: 'text-white',
      accentColor: 'text-white/60',
    },
    {
      title: 'TODAY REVENUE',
      value: `$${todayRevenue.toFixed(2)}`,
      subtext: 'Gross sales (orders)',
      icon: DollarSign,
      color: 'bg-white',
      textColor: 'text-[#181514]',
      accentColor: 'text-[#2D5A27]',
      isMoney: true,
    },
    {
      title: 'UPCOMING BOOKINGS',
      value: upcomingReservations.length,
      subtext: 'Confirmed next 48 hours',
      icon: Users,
      color: 'bg-[#F7F4EE]',
      textColor: 'text-[#181514]',
      accentColor: 'text-[#181514]/70',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`${stat.color} ${stat.textColor} p-4 sm:p-5 rounded-2xl border-2 border-[#181514] shadow-[4px_4px_0px_0px_#181514] flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider opacity-90 truncate">
                {stat.title}
              </span>
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
            </div>

            <div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none">
                {stat.value}
              </div>
              <p
                className={`text-[10px] sm:text-[11px] font-medium mt-1 truncate ${stat.accentColor}`}
              >
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
