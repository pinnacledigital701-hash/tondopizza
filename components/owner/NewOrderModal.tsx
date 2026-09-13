'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { OrderRecord, ManagedMenuItem, ownerStore } from '@/lib/ownerStore';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: OrderRecord) => void;
  menuItems: ManagedMenuItem[];
}

export function NewOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  menuItems,
}: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'pickup' | 'dinein' | 'delivery'>('pickup');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState<{ item: ManagedMenuItem; qty: number }[]>([]);

  if (!isOpen) return null;

  const handleAddItem = (item: ManagedMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((p) => p.item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const tax = Number((subtotal * 0.08875).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || cart.length === 0) return;

    const orderNumber = '#TND-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customer: {
        name: customerName.trim(),
        phone: phone.trim() || '555-0199',
      },
      orderType,
      items: cart.map((c) => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.qty,
      })),
      subtotal,
      tax,
      fees: 0,
      total,
      paymentStatus: 'PAID',
      status: 'NEW',
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ownerStore.addOrder(newOrder);
    onOrderCreated(newOrder);
    onClose();
    setCustomerName('');
    setPhone('');
    setNotes('');
    setCart([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#F7F4EE] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] p-6 sm:p-8 z-10 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E5381B]" />
            <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
              NEW MANUAL ORDER (PHONE / WALK-IN)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#181514]/60 hover:text-[#181514]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                GUEST NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marco Rossi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PHONE NUMBER
              </label>
              <input
                type="text"
                placeholder="e.g. (212) 555-0182"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                SERVICE TYPE
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-[#181514]/20 bg-white focus:border-[#E5381B] focus:outline-hidden cursor-pointer"
              >
                <option value="pickup">Pickup</option>
                <option value="dinein">Dine-in</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>

          {/* MENU SELECTION */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1.5">
              QUICK SELECT PIZZAS & SIDES
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-2xl border border-[#181514]/20">
              {menuItems
                .filter((it) => !it.isSoldOut)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddItem(item)}
                    className="p-2 text-left rounded-xl border border-[#181514]/10 hover:border-[#E5381B] hover:bg-[#FFE8D6]/40 transition-colors flex items-center justify-between text-xs cursor-pointer"
                  >
                    <span className="font-bold text-[#181514] truncate">
                      {item.name}
                    </span>
                    <span className="font-mono text-[#E5381B] ml-1 shrink-0">
                      ${item.price}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* CURRENT BASKET */}
          <div className="p-4 bg-white rounded-2xl border border-[#181514]/20 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block">
              ORDER ITEMS BASKET
            </span>
            {cart.length === 0 ? (
              <p className="text-xs text-[#181514]/40 italic">No items selected yet.</p>
            ) : (
              <div className="space-y-1.5 divide-y divide-[#181514]/5 text-xs">
                {cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="pt-1.5 first:pt-0 flex items-center justify-between"
                  >
                    <span className="font-bold text-[#181514]">
                      {c.qty}x {c.item.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">
                        ${(c.item.price * c.qty).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(c.item.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex justify-between font-mono font-bold text-sm text-[#181514]">
                  <span>Total (inc. tax):</span>
                  <span className="text-[#E5381B]">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
              KITCHEN INSTRUCTIONS
            </label>
            <input
              type="text"
              placeholder="e.g. Well done crust, light basil"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={cart.length === 0}
              className="flex-1 py-3 bg-[#E5381B] disabled:opacity-50 text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#c92f15] transition-colors cursor-pointer"
            >
              CREATE & SEND TO FORNO
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-white text-[#181514] border border-[#181514]/20 font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#181514]/5 cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
