'use client';

import React from 'react';
import {
  Flame,
  AlertCircle,
  BellRing,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  MapPin,
  ChefHat,
  PackageCheck,
} from 'lucide-react';
import { OrderRecord, ReservationRecord } from '@/lib/ownerStore';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ReservationStatusBadge } from './ReservationStatusBadge';

interface TodayQueueProps {
  orders: OrderRecord[];
  reservations: ReservationRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  onSelectReservation: (res: ReservationRecord) => void;
  onAdvanceOrderStatus: (orderId: string, nextStatus: any) => void;
  onAdvanceResStatus: (resId: string, nextStatus: any) => void;
}

export function TodayQueue({
  orders,
  reservations,
  onSelectOrder,
  onSelectReservation,
  onAdvanceOrderStatus,
  onAdvanceResStatus,
}: TodayQueueProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const newOrders = orders.filter((o) => o.status === 'NEW');
  const inPrepOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const todayUpcomingRes = reservations.filter(
    (r) => r.date === todayStr && (r.status === 'NEW' || r.status === 'CONFIRMED')
  );

  return (
    <div className="space-y-6">
      {/* SECTION BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#181514] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#E5381B] animate-ping" />
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#181514]">
            LIVE SERVICE DISPATCH QUEUE
          </h2>
        </div>
        <span className="text-xs font-mono font-bold uppercase text-[#181514]/60 tracking-wider">
          Realtime Kitchen & Pass
        </span>
      </div>

      {/* 3 OPERATIONAL COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. NEW ORDERS (INCOMING) */}
        <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#E5381B]" />
                <h3 className="font-display text-xl font-black uppercase text-[#181514]">
                  NEW ORDERS
                </h3>
              </div>
              <span className="font-mono text-xs font-black bg-[#E5381B] text-white px-2.5 py-0.5 rounded-full">
                {newOrders.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {newOrders.length === 0 ? (
                <div className="py-8 text-center text-[#181514]/40 font-mono text-xs uppercase tracking-wider">
                  No unacknowledged orders
                </div>
              ) : (
                newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl border-2 border-[#181514] bg-[#F7F4EE] hover:bg-[#FFE8D6] transition-colors cursor-pointer group"
                    onClick={() => onSelectOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-black text-sm text-[#E5381B]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-[#181514] text-white">
                        {order.orderType}
                      </span>
                    </div>

                    <p className="font-bold text-sm text-[#181514] truncate">
                      {order.customer.name}
                    </p>

                    <div className="text-xs text-[#181514]/70 mt-1 line-clamp-2">
                      {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#181514]/10 flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#181514]">
                        ${order.total.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdvanceOrderStatus(order.id, 'PREPARING');
                        }}
                        className="px-3 py-1 bg-[#181514] text-white hover:bg-[#E5381B] text-[10px] font-mono font-black uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>SEND TO FORNO</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. IN FORNO / PREPARING */}
        <div className="bg-[#FFFDF5] rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FDB827] fill-[#FDB827]" />
                <h3 className="font-display text-xl font-black uppercase text-[#181514]">
                  IN FORNO (PREP)
                </h3>
              </div>
              <span className="font-mono text-xs font-black bg-[#FDB827] text-[#181514] px-2.5 py-0.5 rounded-full">
                {inPrepOrders.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {inPrepOrders.length === 0 ? (
                <div className="py-8 text-center text-[#181514]/40 font-mono text-xs uppercase tracking-wider">
                  Oven deck clear
                </div>
              ) : (
                inPrepOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl border-2 border-[#181514] bg-white hover:bg-[#FFF8DC] transition-colors cursor-pointer group"
                    onClick={() => onSelectOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-black text-sm text-[#181514]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#FDB827] text-[#181514] px-2 py-0.5 rounded-sm">
                        FIRING
                      </span>
                    </div>

                    <p className="font-bold text-sm text-[#181514] truncate">
                      {order.customer.name}
                    </p>

                    <div className="text-xs text-[#181514]/80 mt-1 line-clamp-2 font-medium">
                      {order.items.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-[#E5381B] font-bold mt-1.5 truncate">
                        Note: {order.notes}
                      </p>
                    )}

                    <div className="mt-3 pt-2 border-t border-[#181514]/10 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#181514]/60">
                        Total ${order.total.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdvanceOrderStatus(order.id, 'READY');
                        }}
                        className="px-3 py-1 bg-[#2D5A27] text-white hover:bg-[#23471f] text-[10px] font-mono font-black uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <PackageCheck className="w-3 h-3" />
                        <span>MARK READY</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. READY ON PASS / TODAY'S ARRIVALS */}
        <div className="bg-[#F7F4EE] rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#2D5A27]" />
                <h3 className="font-display text-xl font-black uppercase text-[#181514]">
                  READY ON PASS ({readyOrders.length})
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {readyOrders.length === 0 ? (
                <div className="py-6 text-center text-[#181514]/40 font-mono text-xs uppercase tracking-wider">
                  Pass is clear
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl border-2 border-[#2D5A27] bg-white hover:bg-[#EBF7EE] transition-colors cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-[#2D5A27]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#2D5A27] text-white px-2 py-0.5 rounded-sm">
                        AWAITING PICKUP
                      </span>
                    </div>
                    <p className="font-bold text-sm text-[#181514] mt-1">
                      {order.customer.name} · {order.customer.phone}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#181514]">
                        ${order.total.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdvanceOrderStatus(order.id, 'COMPLETED');
                        }}
                        className="px-3 py-1 bg-[#181514] text-white hover:bg-[#2D5A27] text-[10px] font-mono font-black uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>DISPATCH / COMPLETE</span>
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* UPCOMING TABLES CALLOUT */}
              <div className="pt-4 mt-4 border-t-2 border-[#181514]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-black uppercase text-[#181514] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E5381B]" />
                    UPCOMING COVERS TODAY
                  </span>
                  <span className="font-mono text-xs font-bold text-[#E5381B]">
                    {todayUpcomingRes.length} Tables
                  </span>
                </div>

                <div className="space-y-2">
                  {todayUpcomingRes.slice(0, 3).map((res) => (
                    <div
                      key={res.id}
                      onClick={() => onSelectReservation(res)}
                      className="p-2.5 rounded-xl border border-[#181514]/20 bg-white hover:bg-[#FFE8D6] transition-colors flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#E5381B] mr-2">
                          {res.time}
                        </span>
                        <strong className="text-[#181514]">{res.customer.name}</strong>
                        <span className="text-[#181514]/60 ml-1.5">({res.guests}p)</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdvanceResStatus(res.id, 'SEATED');
                        }}
                        className="px-2 py-0.5 bg-[#FDB827] text-[#181514] font-mono font-bold text-[9px] uppercase rounded-sm hover:bg-[#181514] hover:text-white transition-colors cursor-pointer"
                      >
                        SEAT
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
