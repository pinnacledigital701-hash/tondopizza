'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ChevronRight,
  X,
  Award,
} from 'lucide-react';
import { CustomerSummary, OrderRecord, ReservationRecord } from '@/lib/ownerStore';
import { OrderStatusBadge } from './OrderStatusBadge';

interface CustomerListProps {
  customers: CustomerSummary[];
  orders: OrderRecord[];
  reservations: ReservationRecord[];
  onSelectOrder?: (order: OrderRecord) => void;
}

export function CustomerList({
  customers,
  orders,
  reservations,
  onSelectOrder,
}: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  // Customer specific orders and reservations
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customer.phone === selectedCustomer.phone ||
        (o.customer.email && o.customer.email === selectedCustomer.email) ||
        o.customer.name.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [selectedCustomer, orders]);

  const customerReservations = useMemo(() => {
    if (!selectedCustomer) return [];
    return reservations.filter(
      (r) =>
        r.customer.phone === selectedCustomer.phone ||
        (r.customer.email && r.customer.email === selectedCustomer.email) ||
        r.customer.name.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [selectedCustomer, reservations]);

  return (
    <div className="space-y-5">
      {/* SEARCH AND SUMMARY CARDS */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#181514]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guests by name, phone number, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden text-xs font-medium text-[#181514]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#181514]/60 uppercase">
              Total Guest Profiles: <strong className="text-[#181514]">{customers.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOMER DIRECTORY TABLE */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-[#181514]/20 mx-auto" />
            <h3 className="font-display text-xl uppercase font-black text-[#181514]">
              NO GUESTS FOUND
            </h3>
            <p className="text-xs text-[#181514]/50 max-w-sm mx-auto">
              No customer profiles matched your query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181514] text-white font-mono uppercase tracking-wider text-[11px] border-b-2 border-[#181514]">
                  <th className="py-3.5 px-4 font-black">GUEST NAME</th>
                  <th className="py-3.5 px-4 font-black">CONTACT</th>
                  <th className="py-3.5 px-4 font-black">ORDERS</th>
                  <th className="py-3.5 px-4 font-black">TOTAL SPENT</th>
                  <th className="py-3.5 px-4 font-black">LAST ORDER</th>
                  <th className="py-3.5 px-4 font-black">RESERVATIONS</th>
                  <th className="py-3.5 px-4 font-black text-right">PROFILE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181514]/10">
                {filtered.map((c, idx) => {
                  const lastOrderFormatted = c.lastOrderDate
                    ? new Date(c.lastOrderDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—';

                  const isVip = c.totalSpent > 100 || c.totalOrders >= 3;

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-[#F7F4EE] transition-colors cursor-pointer group"
                    >
                      {/* NAME */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#181514] group-hover:text-[#E5381B] transition-colors">
                            {c.name}
                          </span>
                          {isVip && (
                            <span className="bg-[#FDB827] text-[#181514] text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5" />
                              REGULAR
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="py-4 px-4 font-mono">
                        <div className="text-[#181514] font-bold">{c.phone}</div>
                        {c.email && (
                          <div className="text-[10px] text-[#181514]/60 truncate max-w-xs">
                            {c.email}
                          </div>
                        )}
                      </td>

                      {/* ORDERS */}
                      <td className="py-4 px-4 font-mono font-bold text-xs text-[#181514]">
                        {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                      </td>

                      {/* TOTAL SPENT */}
                      <td className="py-4 px-4 font-mono font-black text-sm text-[#2D5A27]">
                        ${c.totalSpent.toFixed(2)}
                      </td>

                      {/* LAST ORDER */}
                      <td className="py-4 px-4 font-mono text-[11px] text-[#181514]/70">
                        {lastOrderFormatted}
                      </td>

                      {/* RESERVATIONS */}
                      <td className="py-4 px-4 font-mono text-xs text-[#181514]">
                        {c.totalReservations} bookings
                      </td>

                      {/* VIEW DOSSIER */}
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1 bg-[#181514] text-white font-mono text-[10px] font-bold uppercase rounded-lg hover:bg-[#E5381B] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>HISTORY</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#F7F4EE] text-[#181514] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-[#181514] text-white p-6 flex items-center justify-between border-b-2 border-[#181514]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FDB827] block mb-1">
                  GUEST DOSSIER & HISTORY
                </span>
                <h3 className="font-display text-2xl font-black uppercase text-white">
                  {selectedCustomer.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* CONTACT & LIFETIME STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border-2 border-[#181514] text-center">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                    ORDERS
                  </span>
                  <p className="font-mono text-base font-black text-[#181514]">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                    LIFETIME SPENT
                  </span>
                  <p className="font-mono text-base font-black text-[#2D5A27]">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                    BOOKINGS
                  </span>
                  <p className="font-mono text-base font-black text-[#181514]">
                    {selectedCustomer.totalReservations}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                    STATUS
                  </span>
                  <p className="font-mono text-xs font-black uppercase text-[#E5381B]">
                    {selectedCustomer.totalSpent > 100 ? 'VIP TASTEMAKER' : 'LOYAL GUEST'}
                  </p>
                </div>
              </div>

              {/* PAST ORDERS LIST */}
              <div className="space-y-3">
                <h4 className="font-display text-lg font-black uppercase text-[#181514]">
                  ORDER HISTORY ({customerOrders.length})
                </h4>

                {customerOrders.length === 0 ? (
                  <p className="text-xs text-[#181514]/60 italic">No orders logged.</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 bg-white rounded-2xl border border-[#181514]/20 flex items-center justify-between text-xs cursor-pointer hover:border-[#181514]"
                        onClick={() => {
                          if (onSelectOrder) {
                            setSelectedCustomer(null);
                            onSelectOrder(ord);
                          }
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#E5381B]">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[#181514]/60 font-mono text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[#181514] font-medium mt-0.5">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#181514]">
                            ${ord.total.toFixed(2)}
                          </span>
                          <OrderStatusBadge status={ord.status} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PAST RESERVATIONS LIST */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display text-lg font-black uppercase text-[#181514]">
                  RESERVATION HISTORY ({customerReservations.length})
                </h4>

                {customerReservations.length === 0 ? (
                  <p className="text-xs text-[#181514]/60 italic">No reservations logged.</p>
                ) : (
                  <div className="space-y-2">
                    {customerReservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 bg-white rounded-2xl border border-[#181514]/20 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#FDB827] bg-[#181514] px-2 py-0.5 rounded-sm">
                              {res.bookingCode}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#181514]">
                              {res.date} at {res.time}
                            </span>
                          </div>
                          <p className="text-[#181514]/70 mt-1">
                            Party of {res.guests} · {res.tableNumber || 'No table assigned'}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-[10px] uppercase px-2 py-1 rounded-sm bg-[#181514]/5 text-[#181514]">
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
