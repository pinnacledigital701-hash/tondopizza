'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ownerStore,
  ReservationRecord,
  ReservationStatus,
} from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { ReservationsTable } from '@/components/owner/ReservationsTable';
import { ReservationDetailModal } from '@/components/owner/ReservationDetailModal';

export default function OwnerReservationsPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const reservations = ownerStore.getReservations();
  const [selectedRes, setSelectedRes] = useState<ReservationRecord | null>(null);

  const handleAdvanceStatus = (resId: string, status: ReservationStatus) => {
    ownerStore.updateReservationStatus(resId, status);
  };

  return (
    <OwnerLayout
      title="TABLE BOOKINGS"
      subtitle="Floor Capacity, Arrival Times & Guest Requests"
    >
      <div className="space-y-6">
        <ReservationsTable
          reservations={reservations}
          onSelectReservation={(res) => setSelectedRes(res)}
          onAdvanceStatus={handleAdvanceStatus}
          onDeleteReservation={(id) => {
            ownerStore.deleteReservation(id);
            if (selectedRes?.id === id) {
              setSelectedRes(null);
            }
          }}
        />
      </div>

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
