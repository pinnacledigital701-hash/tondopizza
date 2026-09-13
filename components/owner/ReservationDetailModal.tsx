'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Ban,
  UtensilsCrossed,
  FileText,
  Trash2,
} from 'lucide-react';
import { ReservationRecord, ReservationStatus, ownerStore } from '@/lib/ownerStore';
import { ReservationStatusBadge } from './ReservationStatusBadge';

interface ReservationDetailModalProps {
  reservation: ReservationRecord | null;
  onClose: () => void;
  onDeleteReservation?: (id: string) => void;
  onUpdateStatus: (
    id: string,
    status: ReservationStatus,
    internalNotes?: string,
    tableNumber?: string
  ) => void;
}

export function ReservationDetailModal({
  reservation,
  onClose,
  onDeleteReservation,
  onUpdateStatus,
}: ReservationDetailModalProps) {
  const [internalNotes, setInternalNotes] = useState(reservation?.internalNotes || '');
  const [tableNumber, setTableNumber] = useState(reservation?.tableNumber || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!reservation) return null;

  const handleStatusChange = (status: ReservationStatus) => {
    onUpdateStatus(reservation.id, status, internalNotes, tableNumber);
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(reservation.id, reservation.status, internalNotes, tableNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-xl bg-[#F7F4EE] text-[#181514] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="bg-[#181514] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#181514]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#FDB827] tracking-wider">
              {reservation.bookingCode}
            </span>
            <ReservationStatusBadge status={reservation.status} size="md" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-200 transition-colors cursor-pointer"
              title="Delete Reservation"
              aria-label="Delete Reservation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close reservation modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* MAIN RESERVATION FACTS */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border-2 border-[#181514] text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold uppercase text-[#181514]/60 mb-0.5">
                <Calendar className="w-3 h-3 text-[#E5381B]" />
                DATE
              </div>
              <p className="font-mono text-sm font-black text-[#181514]">
                {reservation.date}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold uppercase text-[#181514]/60 mb-0.5">
                <Clock className="w-3 h-3 text-[#E5381B]" />
                TIME
              </div>
              <p className="font-mono text-sm font-black text-[#181514]">
                {reservation.time}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold uppercase text-[#181514]/60 mb-0.5">
                <Users className="w-3 h-3 text-[#E5381B]" />
                PARTY
              </div>
              <p className="font-mono text-sm font-black text-[#181514]">
                {reservation.guests} Guests
              </p>
            </div>
          </div>

          {/* CUSTOMER INFO */}
          <div className="p-5 bg-white rounded-2xl border-2 border-[#181514] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block mb-1">
              GUEST CONTACT
            </span>
            <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
              {reservation.customer.name}
            </h3>

            <div className="flex flex-wrap gap-4 text-xs font-mono font-medium text-[#181514]/80 pt-1">
              <a
                href={`tel:${reservation.customer.phone}`}
                className="flex items-center gap-1.5 hover:text-[#E5381B]"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5381B]" />
                <span>{reservation.customer.phone}</span>
              </a>
              {reservation.customer.email && (
                <a
                  href={`mailto:${reservation.customer.email}`}
                  className="flex items-center gap-1.5 hover:text-[#E5381B]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5381B]" />
                  <span>{reservation.customer.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* SPECIAL GUEST REQUESTS */}
          {reservation.specialRequests && (
            <div className="p-4 rounded-2xl border-2 border-[#E5381B]/30 bg-[#FFE8D6]/50">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#E5381B] block mb-1">
                GUEST SPECIAL REQUESTS
              </span>
              <p className="text-xs font-semibold text-[#181514]">
                &quot;{reservation.specialRequests}&quot;
              </p>
            </div>
          )}

          {/* TABLE ASSIGNMENT & INTERNAL NOTES FORM */}
          <form onSubmit={handleSaveMeta} className="p-5 bg-white rounded-2xl border-2 border-[#181514] space-y-3">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#181514] block">
              FLOOR MANAGEMENT
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  ASSIGNED TABLE / BOOTH
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 4 or Oven Bar 2"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  INTERNAL STAFF NOTE
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP, high chair requested"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 px-3 py-1.5 bg-[#181514] text-white text-[11px] font-mono font-bold uppercase rounded-xl hover:bg-[#E5381B] transition-colors cursor-pointer"
            >
              SAVE TABLE DETAILS
            </button>
          </form>

          {/* STATUS TRANSITIONS */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#181514] block">
              RESERVATION STATUS ACTIONS
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {reservation.status === 'NEW' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('CONFIRMED')}
                  className="py-3 px-3 bg-[#2D5A27] hover:bg-[#21471d] text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONFIRM TABLE</span>
                </button>
              )}

              {(reservation.status === 'NEW' || reservation.status === 'CONFIRMED') && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('SEATED')}
                  className="py-3 px-3 bg-[#FDB827] hover:bg-[#e0a21f] text-[#181514] font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>SEAT PARTY</span>
                </button>
              )}

              {reservation.status === 'SEATED' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="py-3 px-3 bg-[#181514] hover:bg-[#2D5A27] text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETE / DEPART</span>
                </button>
              )}

              {reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('NO SHOW')}
                    className="py-3 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-mono font-bold text-xs uppercase rounded-xl transition-all border border-amber-300 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>NO SHOW</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('CANCELLED')}
                    className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-mono font-bold text-xs uppercase rounded-xl transition-all border border-red-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    <span>CANCEL</span>
                  </button>
                </>
              )}
            </div>

            {/* DELETE RESERVATION RECORD */}
            <div className="pt-4 border-t-2 border-[#181514]/10 bg-red-50/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl border-t mt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>DELETE RESERVATION RECORD</span>
                  </h4>
                  <p className="text-[11px] text-red-800/80 mt-0.5">
                    Finished with this table booking? Permanently remove it from the reservation ledger.
                  </p>
                </div>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-red-50 text-red-700 border-2 border-red-300 font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>DELETE RESERVATION</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteReservation) {
                          onDeleteReservation(reservation.id);
                        } else {
                          ownerStore.deleteReservation(reservation.id);
                        }
                        onClose();
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>CONFIRM DELETE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-2 bg-white hover:bg-neutral-100 text-[#181514] border border-[#181514]/20 font-mono font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
