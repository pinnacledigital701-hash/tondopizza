'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ownerStore,
  OrderRecord,
  ReservationRecord,
  OrderStatus,
  ReservationStatus,
} from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { DashboardStats } from '@/components/owner/DashboardStats';
import { TodayQueue } from '@/components/owner/TodayQueue';
import { OrdersTable } from '@/components/owner/OrdersTable';
import { OrderDetailModal } from '@/components/owner/OrderDetailModal';
import { ReservationDetailModal } from '@/components/owner/ReservationDetailModal';
import { ArrowRight, ShoppingBag, Calendar } from 'lucide-react';

export default function OwnerDashboardPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const orders = ownerStore.getOrders();
  const reservations = ownerStore.getReservations();

  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedRes, setSelectedRes] = useState<ReservationRecord | null>(null);

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    ownerStore.updateOrderStatus(orderId, nextStatus);
  };

  const handleAdvanceResStatus = (resId: string, nextStatus: ReservationStatus) => {
    ownerStore.updateReservationStatus(resId, nextStatus);
  };

  return (
    <OwnerLayout
      title="RESTAURANT COMMAND"
      subtitle="Today's Service, Active Wood Oven Dispatch & Covers"
    >
      <div className="space-y-8">
        {/* KPI OVERVIEW STATS */}
        <section>
          <DashboardStats orders={orders} reservations={reservations} />
        </section>

        {/* TODAY DISPATCH QUEUE (PRIORITY 1: WHAT NEEDS ATTENTION RIGHT NOW) */}
        <section>
          <TodayQueue
            orders={orders}
            reservations={reservations}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onSelectReservation={(res) => setSelectedRes(res)}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onAdvanceResStatus={handleAdvanceResStatus}
          />
        </section>

        {/* ALL RECENT ORDERS ROSTER */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#181514] pb-3">
            <div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#181514]">
                ORDER LOG & EXPEDITOR
              </h2>
              <p className="text-xs font-mono text-[#181514]/60 uppercase">
                Filter by Status, Order Type, or Customer
              </p>
            </div>

            <Link
              href="/owner/orders"
              className="px-3.5 py-1.5 bg-[#181514] text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#E5381B] transition-colors flex items-center gap-1.5"
            >
              <span>FULL ORDERS VIEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <OrdersTable
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onAdvanceStatus={handleAdvanceOrderStatus}
            onDeleteOrder={(id) => ownerStore.deleteOrder(id)}
          />
        </section>
      </div>

      {/* MODALS */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDeleteOrder={(id) => {
          ownerStore.deleteOrder(id);
          setSelectedOrder(null);
        }}
        onUpdateStatus={(id, status, note) => {
          handleAdvanceOrderStatus(id, status);
          if (note) {
            ownerStore.updateOrderStatus(id, status, note);
          }
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(ownerStore.getOrderById(id) || null);
          }
        }}
      />

      <ReservationDetailModal
        reservation={selectedRes}
        onClose={() => setSelectedRes(null)}
        onDeleteReservation={(id) => {
          ownerStore.deleteReservation(id);
          setSelectedRes(null);
        }}
        onUpdateStatus={(id, status, notes, table) => {
          ownerStore.updateReservationStatus(id, status, notes, table);
          if (selectedRes && selectedRes.id === id) {
            setSelectedRes(ownerStore.getReservationById(id) || null);
          }
        }}
      />
    </OwnerLayout>
  );
}
