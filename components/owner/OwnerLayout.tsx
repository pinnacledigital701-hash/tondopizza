'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ownerStore,
  OrderRecord,
  ReservationRecord,
  OrderStatus,
  ReservationStatus,
  ManagedMenuItem,
} from '@/lib/ownerStore';
import { OwnerSidebar } from './OwnerSidebar';
import { OwnerHeader } from './OwnerHeader';
import { OwnerLogin } from './OwnerLogin';
import { OrderDetailModal } from './OrderDetailModal';
import { ReservationDetailModal } from './ReservationDetailModal';
import { NewOrderModal } from './NewOrderModal';
import { NewReservationModal } from './NewReservationModal';

interface OwnerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onOpenOrderModal?: (order: OrderRecord) => void;
  onOpenReservationModal?: (res: ReservationRecord) => void;
}

export function OwnerLayout({ children, title, subtitle }: OwnerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedRes, setSelectedRes] = useState<ReservationRecord | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewResOpen, setIsNewResOpen] = useState(false);

  const isAuthenticated = isMounted ? ownerStore.isAuthenticated() : null;
  const orders = isMounted ? ownerStore.getOrders() : [];
  const reservations = isMounted ? ownerStore.getReservations() : [];
  const menuItems = isMounted ? ownerStore.getMenuItems() : [];

  useEffect(() => {
    ownerStore.initFirebaseSync();
  }, []);

  const handleAuthSuccess = () => {
    // Authenticated state updates via store subscription
  };

  const handleLogout = () => {
    ownerStore.logout();
  };

  // Pending counts for badges
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PREPARING'
  ).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReservationsCount = reservations.filter(
    (r) => r.date === todayStr && r.status !== 'CANCELLED'
  ).length;

  const handleUpdateOrderStatus = (
    id: string,
    status: OrderStatus,
    note?: string
  ) => {
    ownerStore.updateOrderStatus(id, status, note);
    if (selectedOrder && selectedOrder.id === id) {
      const updated = ownerStore.getOrderById(id);
      setSelectedOrder(updated || null);
    }
  };

  const handleUpdateResStatus = (
    id: string,
    status: ReservationStatus,
    internalNotes?: string,
    tableNumber?: string
  ) => {
    ownerStore.updateReservationStatus(id, status, internalNotes, tableNumber);
    if (selectedRes && selectedRes.id === id) {
      const updated = ownerStore.getReservationById(id);
      setSelectedRes(updated || null);
    }
  };

  if (isAuthenticated === null) {
    // Loading splash
    return (
      <div className="min-h-screen bg-[#181514] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <img
            src="/tondologo.png"
            alt="Tondo"
            className="h-12 w-auto animate-pulse"
          />
          <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
            AUTHENTICATING MANAGEMENT...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <OwnerLogin onAuthenticated={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181514] font-sans antialiased flex">
      {/* SIDEBAR NAVIGATION */}
      <OwnerSidebar
        pendingOrdersCount={pendingOrdersCount}
        todayReservationsCount={todayReservationsCount}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 md:pl-64 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <OwnerHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onNewOrder={() => setIsNewOrderOpen(true)}
          onNewReservation={() => setIsNewResOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* GLOBAL MODALS ACCESSIBLE ANYWHERE IN OWNER PORTAL */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDeleteOrder={(id) => {
          ownerStore.deleteOrder(id);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <ReservationDetailModal
        reservation={selectedRes}
        onClose={() => setSelectedRes(null)}
        onDeleteReservation={(id) => {
          ownerStore.deleteReservation(id);
          setSelectedRes(null);
        }}
        onUpdateStatus={handleUpdateResStatus}
      />

      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onOrderCreated={(ord) => setSelectedOrder(ord)}
        menuItems={menuItems}
      />

      <NewReservationModal
        isOpen={isNewResOpen}
        onClose={() => setIsNewResOpen(false)}
        onReservationCreated={(res) => setSelectedRes(res)}
      />
    </div>
  );
}
