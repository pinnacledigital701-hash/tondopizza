'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  UtensilsCrossed,
  AlertCircle,
  Ban,
  Trash2,
  X,
} from 'lucide-react';
import { ReservationRecord, ReservationStatus, ownerStore } from '@/lib/ownerStore';
import { ReservationStatusBadge } from './ReservationStatusBadge';

interface ReservationsTableProps {
  reservations: ReservationRecord[];
  onSelectReservation: (res: ReservationRecord) => void;
  onAdvanceStatus: (id: string, status: ReservationStatus) => void;
  onDeleteReservation?: (id: string) => void;
}

export function ReservationsTable({
  reservations,
  onSelectReservation,
  onAdvanceStatus,
  onDeleteReservation,
}: ReservationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'today' | 'upcoming' | 'all'>('today');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // Date filter
      if (dateFilter === 'today' && r.date !== todayStr) return false;
      if (dateFilter === 'upcoming' && r.date < todayStr) return false;

      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = r.bookingCode.toLowerCase().includes(q);
        const matchName = r.customer.name.toLowerCase().includes(q);
        const matchPhone = r.customer.phone.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter, todayStr]);

  const statusTabs = [
    { label: 'ALL BOOKINGS', value: 'ALL', count: reservations.length },
    {
      label: 'NEW',
      value: 'NEW',
      count: reservations.filter((r) => r.status === 'NEW').length,
    },
    {
      label: 'CONFIRMED',
      value: 'CONFIRMED',
      count: reservations.filter((r) => r.status === 'CONFIRMED').length,
    },
    {
      label: 'SEATED',
      value: 'SEATED',
      count: reservations.filter((r) => r.status === 'SEATED').length,
    },
    {
      label: 'COMPLETED',
      value: 'COMPLETED',
      count: reservations.filter((r) => r.status === 'COMPLETED').length,
    },
    {
      label: 'NO SHOW / CANCELLED',
      value: 'CANCELLED',
      count: reservations.filter((r) => r.status === 'CANCELLED' || r.status === 'NO SHOW').length,
    },
  ];

  return (
    <div className="space-y-5">
      {/* FILTERS */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 space-y-4">
        {/* TABS */}
        <div className="flex flex-wrap gap-2 border-b border-[#181514]/10 pb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'bg-[#F7F4EE] text-[#181514]/70 hover:bg-[#181514]/10 hover:text-[#181514]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.value
                      ? 'bg-[#E5381B] text-white'
                      : 'bg-[#181514]/10 text-[#181514]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SEARCH & DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#181514]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by booking code, guest name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden text-xs font-medium text-[#181514]"
            />
          </div>

          <div className="sm:col-span-4 flex rounded-xl border-2 border-[#181514]/20 p-1 bg-[#F7F4EE]">
            <button
              onClick={() => setDateFilter('today')}
              className={`flex-1 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'text-[#181514]/60 hover:text-[#181514]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('upcoming')}
              className={`flex-1 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'upcoming'
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'text-[#181514]/60 hover:text-[#181514]'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`flex-1 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'text-[#181514]/60 hover:text-[#181514]'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] overflow-hidden">
        {reservations.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#181514]/5 border-2 border-[#181514]/10 flex items-center justify-center mx-auto text-[#181514]/40">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl uppercase font-black text-[#181514]">
              NO TABLE RESERVATIONS YET
            </h3>
            <p className="text-xs font-mono text-[#181514]/60 max-w-md mx-auto leading-relaxed">
              Table reservation book is completely open. Customer bookings submitted online or by phone will appear here in real-time.
            </p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Calendar className="w-10 h-10 text-[#181514]/20 mx-auto" />
            <h3 className="font-display text-xl uppercase font-black text-[#181514]">
              NO RESERVATIONS FOUND
            </h3>
            <p className="text-xs text-[#181514]/50 max-w-sm mx-auto">
              No table bookings match your selected criteria or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181514] text-white font-mono uppercase tracking-wider text-[11px] border-b-2 border-[#181514]">
                  <th className="py-3.5 px-4 font-black">CODE</th>
                  <th className="py-3.5 px-4 font-black">DATE & TIME</th>
                  <th className="py-3.5 px-4 font-black">GUEST</th>
                  <th className="py-3.5 px-4 font-black">PARTY</th>
                  <th className="py-3.5 px-4 font-black">TABLE / SPECIAL REQUESTS</th>
                  <th className="py-3.5 px-4 font-black">STATUS</th>
                  <th className="py-3.5 px-4 font-black text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181514]/10">
                {filteredReservations.map((res) => (
                  <tr
                    key={res.id}
                    onClick={() => onSelectReservation(res)}
                    className="hover:bg-[#F7F4EE] transition-colors cursor-pointer group"
                  >
                    {/* BOOKING CODE */}
                    <td className="py-4 px-4 font-mono font-black text-sm text-[#E5381B] group-hover:underline">
                      {res.bookingCode}
                    </td>

                    {/* DATE & TIME */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-1 font-bold text-[#181514]">
                        <Clock className="w-3 h-3 text-[#E5381B]" />
                        <span>{res.time}</span>
                      </div>
                      <span className="text-[10px] text-[#181514]/50">{res.date}</span>
                    </td>

                    {/* GUEST */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-sm text-[#181514] block">
                        {res.customer.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#181514]/60">
                        {res.customer.phone}
                      </span>
                    </td>

                    {/* PARTY SIZE */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-[#181514]/5 text-[#181514] inline-flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#E5381B]" />
                        {res.guests} Guests
                      </span>
                    </td>

                    {/* TABLE / NOTES */}
                    <td className="py-4 px-4 max-w-xs truncate">
                      {res.tableNumber && (
                        <span className="font-mono font-bold text-[10px] text-[#2D5A27] bg-[#2D5A27]/10 px-2 py-0.5 rounded-sm mr-2">
                          {res.tableNumber}
                        </span>
                      )}
                      <span className="text-xs text-[#181514]/70 font-medium truncate">
                        {res.specialRequests || res.internalNotes || 'Standard reservation'}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4">
                      <ReservationStatusBadge status={res.status} size="sm" />
                    </td>

                    {/* ACTIONS */}
                    <td
                      className="py-4 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'NEW' && (
                          <button
                            type="button"
                            onClick={() => onAdvanceStatus(res.id, 'CONFIRMED')}
                            className="px-2.5 py-1 bg-[#2D5A27] hover:bg-[#20421c] text-white font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CONFIRM</span>
                          </button>
                        )}

                        {res.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => onAdvanceStatus(res.id, 'SEATED')}
                            className="px-2.5 py-1 bg-[#FDB827] hover:bg-[#e0a21f] text-[#181514] font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <UtensilsCrossed className="w-3 h-3" />
                            <span>SEAT</span>
                          </button>
                        )}

                        {res.status === 'SEATED' && (
                          <button
                            type="button"
                            onClick={() => onAdvanceStatus(res.id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-[#181514] hover:bg-[#2D5A27] text-white font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DONE</span>
                          </button>
                        )}

                        {deletingId === res.id ? (
                          <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                            <button
                              type="button"
                              onClick={() => {
                                if (onDeleteReservation) {
                                  onDeleteReservation(res.id);
                                } else {
                                  ownerStore.deleteReservation(res.id);
                                }
                                setDeletingId(null);
                              }}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-[9px] uppercase rounded-sm transition-colors cursor-pointer"
                              title="Confirm Delete"
                            >
                              CONFIRM
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="p-0.5 text-neutral-500 hover:text-neutral-800"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(res.id)}
                            className="p-1.5 text-[#181514]/30 hover:text-red-600 transition-colors"
                            title="Delete Reservation"
                            aria-label="Delete Reservation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectReservation(res)}
                          className="p-1.5 text-[#181514]/40 hover:text-[#181514] transition-colors"
                          aria-label="View reservation detail"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
