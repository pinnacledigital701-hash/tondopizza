'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChefHat,
  PackageCheck,
  Ban,
  FileText,
  Trash2,
} from 'lucide-react';
import { OrderRecord, OrderStatus, ownerStore } from '@/lib/ownerStore';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, note?: string) => void;
  onDeleteOrder?: (id: string) => void;
}

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onDeleteOrder,
}: OrderDetailModalProps) {
  const [internalNote, setInternalNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleStatusChange = (status: OrderStatus) => {
    onUpdateStatus(order.id, status, internalNote.trim() || undefined);
    setInternalNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* MODAL WINDOW / EXPEDITOR TICKET */}
      <div className="relative w-full max-w-2xl bg-[#F7F4EE] text-[#181514] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* TOP BAR */}
        <div className="bg-[#181514] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#181514]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#E5381B] tracking-wider">
              {order.orderNumber}
            </span>
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-200 transition-colors cursor-pointer"
              title="Delete Order Ticket"
              aria-label="Delete Order Ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Print Kitchen Ticket"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close ticket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TICKET BODY */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* META BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border-2 border-[#181514]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                DATE
              </span>
              <p className="font-mono text-xs font-black text-[#181514]">{orderDate}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                TIME PLACED
              </span>
              <p className="font-mono text-xs font-black text-[#181514]">{orderTime}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                TYPE
              </span>
              <p className="font-mono text-xs font-black uppercase text-[#E5381B]">
                {order.orderType}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
                PAYMENT
              </span>
              <p className="font-mono text-xs font-black uppercase text-[#2D5A27]">
                {order.paymentStatus}
              </p>
            </div>
          </div>

          {/* CUSTOMER INFORMATION */}
          <div className="p-5 bg-white rounded-2xl border-2 border-[#181514] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block mb-1">
              CUSTOMER DOSSIER
            </span>
            <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
              {order.customer.name}
            </h3>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-[#181514]/80 pt-1">
              <a
                href={`tel:${order.customer.phone}`}
                className="flex items-center gap-1.5 hover:text-[#E5381B] font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5381B]" />
                <span>{order.customer.phone}</span>
              </a>
              {order.customer.email && (
                <a
                  href={`mailto:${order.customer.email}`}
                  className="flex items-center gap-1.5 hover:text-[#E5381B] font-mono"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5381B]" />
                  <span>{order.customer.email}</span>
                </a>
              )}
              {order.customer.address && (
                <div className="flex items-center gap-1.5 font-mono text-[#181514]">
                  <MapPin className="w-3.5 h-3.5 text-[#E5381B]" />
                  <span>{order.customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <div className="bg-white rounded-2xl border-2 border-[#181514] overflow-hidden">
            <div className="bg-[#181514] text-white px-4 py-2.5 flex justify-between text-[11px] font-mono font-bold uppercase tracking-wider">
              <span>ORDERED PIES & ITEMS</span>
              <span>SUBTOTAL</span>
            </div>

            <div className="p-4 divide-y divide-[#181514]/10 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#181514] text-white font-mono font-black text-xs flex items-center justify-center">
                        {item.quantity}x
                      </span>
                      <h4 className="font-display text-lg font-black uppercase text-[#181514]">
                        {item.name}
                      </h4>
                    </div>
                    {item.notes && (
                      <p className="text-xs font-bold text-[#E5381B] mt-1 pl-8">
                        ★ &quot;{item.notes}&quot;
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-[#181514]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="block text-[10px] font-mono text-[#181514]/50">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTALS LEDGER */}
            <div className="p-4 bg-[#F7F4EE] border-t-2 border-[#181514] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#181514]/70">
                <span>Items Subtotal:</span>
                <span className="font-bold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#181514]/70">
                <span>Tax (8.875%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.fees > 0 && (
                <div className="flex justify-between text-[#181514]/70">
                  <span>Delivery / Dispatch Fee:</span>
                  <span>${order.fees.toFixed(2)}</span>
                </div>
              )}
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-[#2D5A27]">
                  <span>Discount Applied:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#181514] pt-2 border-t border-[#181514]/20">
                <span className="font-display uppercase tracking-wider">TOTAL PAID</span>
                <span className="font-mono text-lg text-[#E5381B]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* CUSTOMER NOTES */}
          {order.notes && (
            <div className="p-4 rounded-2xl border-2 border-[#E5381B]/30 bg-[#FFE8D6]/40">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#E5381B] block mb-1">
                SPECIAL INSTRUCTIONS / KITCHEN NOTES
              </span>
              <p className="text-sm font-semibold text-[#181514]">{order.notes}</p>
            </div>
          )}

          {/* OPERATIONAL STATUS ACTIONS */}
          <div className="p-5 bg-white rounded-2xl border-2 border-[#181514] space-y-3">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#181514] block">
              STATUS TRANSITION ACTIONS
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {order.status === 'NEW' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('CONFIRMED')}
                  className="py-3 px-4 bg-[#181514] hover:bg-[#201C1A] text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FDB827]" />
                  <span>CONFIRM ORDER</span>
                </button>
              )}

              {(order.status === 'NEW' || order.status === 'CONFIRMED') && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('PREPARING')}
                  className="py-3 px-4 bg-[#FDB827] hover:bg-[#e0a21f] text-[#181514] font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-[#E5381B]" />
                  <span>START PREP (FORNO)</span>
                </button>
              )}

              {order.status === 'PREPARING' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('READY')}
                  className="py-3 px-4 bg-[#2D5A27] hover:bg-[#22471e] text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>MARK READY ON PASS</span>
                </button>
              )}

              {order.status === 'READY' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="py-3 px-4 bg-[#181514] hover:bg-[#2D5A27] text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETE & DISPATCH</span>
                </button>
              )}

              {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('CANCELLED')}
                  className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-mono font-bold text-xs uppercase rounded-xl transition-all border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>CANCEL ORDER</span>
                </button>
              )}
            </div>

            {/* ADD NOTE FIELD */}
            <div className="pt-3 border-t border-[#181514]/10">
              <label
                htmlFor="order-note-input"
                className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1"
              >
                APPEND INTERNAL STAFF NOTE (OPTIONAL)
              </label>
              <div className="flex gap-2">
                <input
                  id="order-note-input"
                  type="text"
                  placeholder="e.g. Spoke to customer, boxing for 6:45pm pickup"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (internalNote.trim()) {
                      onUpdateStatus(order.id, order.status, internalNote.trim());
                      setInternalNote('');
                    }
                  }}
                  className="px-4 py-2 bg-[#181514] text-white text-xs font-mono font-bold uppercase rounded-xl hover:bg-[#E5381B] cursor-pointer"
                >
                  SAVE NOTE
                </button>
              </div>
            </div>

            {/* DELETE TICKET AFTER READ */}
            <div className="pt-4 border-t-2 border-[#181514]/10 bg-red-50/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>DELETE TICKET AFTER READ</span>
                  </h4>
                  <p className="text-[11px] text-red-800/80 mt-0.5">
                    Finished reviewing this order? Remove it permanently from dispatch and active records.
                  </p>
                </div>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-red-50 text-red-700 border-2 border-red-300 font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>DELETE ORDER</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteOrder) {
                          onDeleteOrder(order.id);
                        } else {
                          ownerStore.deleteOrder(order.id);
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
