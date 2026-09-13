'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ownerStore,
  OrderRecord,
} from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { CustomerList } from '@/components/owner/CustomerList';
import { OrderDetailModal } from '@/components/owner/OrderDetailModal';

export default function OwnerCustomersPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const customers = ownerStore.getCustomerSummaries();
  const orders = ownerStore.getOrders();
  const reservations = ownerStore.getReservations();
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  return (
    <OwnerLayout
      title="GUEST DIRECTORY"
      subtitle="Customer Profiles, Spending History & Loyalty"
    >
      <div className="space-y-6">
        <CustomerList
          customers={customers}
          orders={orders}
          reservations={reservations}
          onSelectOrder={(ord) => setSelectedOrder(ord)}
        />
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, note) => {
          ownerStore.updateOrderStatus(id, status, note);
        }}
      />
    </OwnerLayout>
  );
}
