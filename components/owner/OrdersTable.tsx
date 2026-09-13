'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  PackageCheck,
  Calendar,
  Trash2,
  X,
} from 'lucide-react';
import { OrderRecord, OrderStatus, ownerStore } from '@/lib/ownerStore';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersTableProps {
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  onAdvanceStatus: (id: string, nextStatus: OrderStatus) => void;
  onDeleteOrder?: (id: string) => void;
}

export function OrdersTable({
  orders,
  onSelectOrder,
  onAdvanceStatus,
  onDeleteOrder,
}: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Date filter
      if (dateFilter === 'today' && !o.createdAt.startsWith(todayStr)) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && o.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && o.orderType !== typeFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNumber = o.orderNumber.toLowerCase().includes(query);
        const matchCustomer = o.customer.name.toLowerCase().includes(query);
        const matchPhone = o.customer.phone.toLowerCase().includes(query);
        const matchItem = o.items.some((it) => it.name.toLowerCase().includes(query));
        if (!matchNumber && !matchCustomer && !matchPhone && !matchItem) {
          return false;
        }
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, typeFilter, dateFilter, todayStr]);

  const statusTabs: { label: string; value: string; count?: number }[] = [
    { label: 'ALL ORDERS', value: 'ALL', count: orders.length },
    {
      label: 'NEW',
      value: 'NEW',
      count: orders.filter((o) => o.status === 'NEW').length,
    },
    {
      label: 'PREPARING',
      value: 'PREPARING',
      count: orders.filter((o) => o.status === 'PREPARING').length,
    },
    {
      label: 'READY',
      value: 'READY',
      count: orders.filter((o) => o.status === 'READY').length,
    },
    {
      label: 'COMPLETED',
      value: 'COMPLETED',
      count: orders.filter((o) => o.status === 'COMPLETED').length,
    },
    {
      label: 'CANCELLED',
      value: 'CANCELLED',
      count: orders.filter((o) => o.status === 'CANCELLED').length,
    },
  ];

  return (
    <div className="space-y-5">
      {/* FILTER CONTROLS BAR */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 space-y-4">
        {/* STATUS TABS */}
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

        {/* SEARCH & SECONDARY FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* SEARCH INPUT */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#181514]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden text-xs font-medium text-[#181514]"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden text-xs font-mono font-bold uppercase bg-white cursor-pointer"
            >
              <option value="ALL">All Order Types</option>
              <option value="pickup">Pickup Only</option>
              <option value="dinein">Dine-in Only</option>
              <option value="delivery">Delivery Only</option>
            </select>
          </div>

          {/* DATE TOGGLE */}
          <div className="sm:col-span-3 flex rounded-xl border-2 border-[#181514]/20 p-1 bg-[#F7F4EE]">
            <button
              onClick={() => setDateFilter('all')}
              className={`flex-1 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'text-[#181514]/60 hover:text-[#181514]'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`flex-1 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-[#181514] text-white shadow-xs'
                  : 'text-[#181514]/60 hover:text-[#181514]'
              }`}
            >
              Today Only
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST / TABLE */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#181514]/5 border-2 border-[#181514]/10 flex items-center justify-center mx-auto text-[#181514]/40">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl uppercase font-black text-[#181514]">
              NO ORDERS RECORDED YET
            </h3>
            <p className="text-xs font-mono text-[#181514]/60 max-w-md mx-auto leading-relaxed">
              Dispatch queue is completely clear. Incoming orders from online checkout or table orders will appear here in real-time.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-[#181514]/20 mx-auto" />
            <h3 className="font-display text-xl uppercase font-black text-[#181514]">
              NO MATCHING ORDERS
            </h3>
            <p className="text-xs text-[#181514]/50 max-w-sm mx-auto">
              No orders matched your current search or status filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181514] text-white font-mono uppercase tracking-wider text-[11px] border-b-2 border-[#181514]">
                  <th className="py-3.5 px-4 font-black">ORDER #</th>
                  <th className="py-3.5 px-4 font-black">DATE & TIME</th>
                  <th className="py-3.5 px-4 font-black">CUSTOMER</th>
                  <th className="py-3.5 px-4 font-black">TYPE</th>
                  <th className="py-3.5 px-4 font-black">ITEMS</th>
                  <th className="py-3.5 px-4 font-black">TOTAL</th>
                  <th className="py-3.5 px-4 font-black">STATUS</th>
                  <th className="py-3.5 px-4 font-black text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181514]/10">
                {filteredOrders.map((order) => {
                  const time = new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const date = new Date(order.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-[#F7F4EE] transition-colors cursor-pointer group"
                    >
                      {/* ORDER NUMBER */}
                      <td className="py-4 px-4 font-mono font-black text-sm text-[#E5381B] group-hover:underline">
                        {order.orderNumber}
                      </td>

                      {/* DATE & TIME */}
                      <td className="py-4 px-4 font-mono">
                        <span className="font-bold text-[#181514] block">{time}</span>
                        <span className="text-[10px] text-[#181514]/50">{date}</span>
                      </td>

                      {/* CUSTOMER */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-sm text-[#181514] block">
                          {order.customer.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#181514]/60">
                          {order.customer.phone}
                        </span>
                      </td>

                      {/* TYPE */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-[#181514] text-white">
                          {order.orderType}
                        </span>
                      </td>

                      {/* ITEMS SUMMARY */}
                      <td className="py-4 px-4 max-w-xs truncate">
                        <span className="font-medium text-[#181514]">
                          {order.items
                            .map((it) => `${it.quantity}x ${it.name}`)
                            .join(', ')}
                        </span>
                        {order.notes && (
                          <span className="block text-[10px] font-bold text-[#E5381B] truncate">
                            &quot;{order.notes}&quot;
                          </span>
                        )}
                      </td>

                      {/* TOTAL */}
                      <td className="py-4 px-4 font-mono font-black text-sm text-[#181514]">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="py-4 px-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>

                      {/* ACTIONS */}
                      <td
                        className="py-4 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'NEW' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStatus(order.id, 'PREPARING')}
                              className="px-2.5 py-1 bg-[#FDB827] hover:bg-[#e0a21f] text-[#181514] font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Send to Forno"
                            >
                              <Flame className="w-3 h-3 text-[#E5381B]" />
                              <span>FORNO</span>
                            </button>
                          )}

                          {order.status === 'PREPARING' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStatus(order.id, 'READY')}
                              className="px-2.5 py-1 bg-[#2D5A27] hover:bg-[#22471e] text-white font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Mark Ready"
                            >
                              <PackageCheck className="w-3 h-3" />
                              <span>PASS</span>
                            </button>
                          )}

                          {order.status === 'READY' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStatus(order.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-[#181514] hover:bg-[#2D5A27] text-white font-mono font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Complete"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>DONE</span>
                            </button>
                          )}

                          {deletingId === order.id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onDeleteOrder) {
                                    onDeleteOrder(order.id);
                                  } else {
                                    ownerStore.deleteOrder(order.id);
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
                              onClick={() => setDeletingId(order.id)}
                              className="p-1.5 text-[#181514]/30 hover:text-red-600 transition-colors"
                              title="Delete Order Record"
                              aria-label="Delete Order Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectOrder(order)}
                            className="p-1.5 text-[#181514]/40 hover:text-[#181514] transition-colors"
                            aria-label="View details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
