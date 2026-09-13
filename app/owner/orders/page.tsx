'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ownerStore,
  OrderRecord,
  OrderStatus,
} from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { OrdersTable } from '@/components/owner/OrdersTable';
import { OrderDetailModal } from '@/components/owner/OrderDetailModal';

export default function OwnerOrdersPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const orders = ownerStore.getOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const handleAdvanceStatus = (orderId: string, nextStatus: OrderStatus) => {
    ownerStore.updateOrderStatus(orderId, nextStatus);
  };

  return (
    <OwnerLayout
      title="ORDERS DISPATCH"
      subtitle="Full Ledger, Status Workflows & Expeditor Controls"
    >
      <div className="space-y-6">
        <OrdersTable
          orders={orders}
          onSelectOrder={(ord) => setSelectedOrder(ord)}
          onAdvanceStatus={handleAdvanceStatus}
          onDeleteOrder={(id) => {
            ownerStore.deleteOrder(id);
            if (selectedOrder?.id === id) {
              setSelectedOrder(null);
            }
          }}
        />
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDeleteOrder={(id) => {
          ownerStore.deleteOrder(id);
          setSelectedOrder(null);
        }}
        onUpdateStatus={(id, status, note) => {
          ownerStore.updateOrderStatus(id, status, note);
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(ownerStore.getOrderById(id) || null);
          }
        }}
      />
    </OwnerLayout>
  );
}
