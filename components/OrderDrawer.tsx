'use client';

import React, { useState, useSyncExternalStore, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, User, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { MenuItem, ALL_MENU_ITEMS } from '@/lib/data';
import { ownerStore, OrderRecord } from '@/lib/ownerStore';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddToCart?: (item: MenuItem) => void;
  onBrowseMenu?: () => void;
}

function generateNewOrderDetails(): { id: string; orderNumber: string } {
  const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
  return {
    id: `ord-${Date.now()}`,
    orderNumber: `#TND-${randomSuffix}`,
  };
}

export function OrderDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  onBrowseMenu,
}: OrderDrawerProps) {
  const [orderType, setOrderType] = useState<'pickup' | 'dinein'>('pickup');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderNum, setOrderNum] = useState('');

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const ordersOpen = useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getSettings().orderAcceptingEnabled,
    () => true
  );

  const subtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const tax = subtotal * 0.08875; // standard ~8.8%
  const total = subtotal + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const details = generateNewOrderDetails();
    setOrderNum(details.orderNumber);

    // Save to ownerStore
    const newRecord: OrderRecord = {
      id: details.id,
      orderNumber: details.orderNumber,
      customer: {
        name: guestName.trim() || 'Online Guest',
        phone: guestPhone.trim() || '(555) 019-9021',
      },
      orderType,
      items: cartItems.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        notes: ci.notes,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      fees: 0,
      total: Number(total.toFixed(2)),
      paymentStatus: 'PAID',
      status: 'NEW',
      notes: specialInstructions.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ownerStore.addOrder(newRecord);
    setIsOrdered(true);
  };

  const handleReset = () => {
    setIsOrdered(false);
    setGuestName('');
    setGuestPhone('');
    setSpecialInstructions('');
    onClearCart();
    onClose();
  };

  const handleExploreMenu = () => {
    if (onBrowseMenu) {
      onBrowseMenu();
    } else {
      onClose();
      const el = document.getElementById('signature') || document.getElementById('menu');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const popularQuickAdds = ALL_MENU_ITEMS.filter((item) =>
    ['margherita', 'diavola', 'verde'].includes(item.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Your Order Bag">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer Container: Full width on mobile, sleek slide-over on tablet/desktop */}
      <div className="fixed inset-y-0 right-0 flex w-full sm:max-w-md md:max-w-lg z-10 pointer-events-none">
        <div className="pointer-events-auto w-full h-full max-h-[100dvh] bg-[#F7F4EE] text-[#181514] shadow-2xl flex flex-col justify-between border-l border-[#181514]/15 animate-in slide-in-from-right duration-300 ease-out">
          {/* TOP DRAWER HEADER */}
          <div className="p-4 sm:p-5 border-b border-[#181514]/10 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E5381B]/10 flex items-center justify-center text-[#E5381B]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight uppercase text-[#181514] leading-none">
                  YOUR ORDER BAG
                </h2>
                <span className="text-[10px] font-mono font-bold text-[#181514]/50 uppercase mt-0.5 block">
                  {cartItems.length === 0
                    ? '0 items selected'
                    : `${cartItems.reduce((acc, i) => acc + i.quantity, 0)} ${
                        cartItems.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'item' : 'items'
                      } ready for oven`}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#181514]/5 hover:bg-[#181514]/10 active:scale-90 transition-all text-[#181514] cursor-pointer"
              aria-label="Close order bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DRAWER BODY */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6">
            {!isOrdered ? (
              <>
                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 p-1.5 bg-[#181514]/5 rounded-2xl text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-[#181514] text-white shadow-xs'
                        : 'text-[#181514]/70 hover:text-[#181514]'
                    }`}
                  >
                    Takeaway Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('dinein')}
                    className={`py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                      orderType === 'dinein'
                        ? 'bg-[#181514] text-white shadow-xs'
                        : 'text-[#181514]/70 hover:text-[#181514]'
                    }`}
                  >
                    Dine-in Order
                  </button>
                </div>

                {/* Items List */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-white border-2 border-[#181514]/10 shadow-sm flex items-center justify-center mx-auto text-[#181514]/40">
                      <ShoppingBag className="w-10 h-10 text-[#E5381B]" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display text-2xl sm:text-3xl uppercase font-black text-[#181514]">
                        YOUR BAG IS EMPTY
                      </p>
                      <p className="text-xs font-medium text-[#181514]/65 max-w-xs mx-auto leading-relaxed">
                        Explore our 48-hour fermented woodfired pizzas, dips, and sides to start your order.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExploreMenu}
                      className="w-full py-3.5 px-6 bg-[#E5381B] text-white font-display text-sm font-black uppercase tracking-wider rounded-2xl hover:bg-[#c92f15] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>BROWSE OUR PIZZAS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* QUICK ADD RECOMMENDATIONS */}
                    {popularQuickAdds.length > 0 && onAddToCart && (
                      <div className="pt-4 border-t border-[#181514]/10 text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/50 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#E5381B]" />
                            POPULAR QUICK ADDS
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {popularQuickAdds.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-3 rounded-2xl border border-[#181514]/10 flex items-center justify-between gap-3 shadow-xs hover:border-[#181514]/30 transition-all"
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className="font-display text-base font-black uppercase text-[#181514] truncate">
                                  {item.name}
                                </h4>
                                <span className="font-mono font-bold text-xs text-[#E5381B]">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => onAddToCart(item)}
                                className="px-3 py-1.5 bg-[#181514] hover:bg-[#E5381B] text-white font-mono font-bold text-[11px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>ADD</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-[#181514]/10 shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-base sm:text-lg font-black uppercase text-[#181514] truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#181514]/60 truncate">
                            {item.description}
                          </p>
                          <span className="font-bold text-sm text-[#E5381B] block mt-1">
                            ${(item.price * quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-[#F7F4EE] px-2 py-1 rounded-xl border border-[#181514]/10">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:text-[#E5381B] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-xs w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:text-[#E5381B] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-[#181514]/40 hover:text-[#E5381B] transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Guest Contact Details */}
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label
                            htmlFor="drawer-guest-name"
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block mb-1"
                          >
                            Your Name *
                          </label>
                          <input
                            id="drawer-guest-name"
                            type="text"
                            placeholder="e.g. Marco Rossi"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#181514]/20 text-xs font-medium focus:outline-hidden focus:border-[#E5381B]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="drawer-guest-phone"
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block mb-1"
                          >
                            Phone (For SMS)
                          </label>
                          <input
                            id="drawer-guest-phone"
                            type="tel"
                            placeholder="(555) 000-0000"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#181514]/20 text-xs font-medium focus:outline-hidden focus:border-[#E5381B]"
                          />
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label
                          htmlFor="order-instructions"
                          className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block mb-1"
                        >
                          Order Notes / Dietary Instructions
                        </label>
                        <textarea
                          id="order-instructions"
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="e.g. Chili honey on the side, well-done crust blister..."
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#181514]/20 text-xs font-medium focus:outline-hidden focus:border-[#E5381B] transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* SUCCESS ORDER RECEIPT */
              <div className="py-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-[#157C41]/10 text-[#157C41] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E5381B] block mb-1">
                    ORDER DISPATCHED
                  </span>
                  <h3 className="font-display text-3xl font-black uppercase text-[#181514]">
                    WE’RE FIRING YOUR PIES!
                  </h3>
                  <p className="text-xs font-semibold text-[#181514]/60 mt-1">
                    Estimated ready in 15–20 minutes.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 text-left border border-[#181514]/15 space-y-3 text-xs shadow-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-[#181514]/60">ORDER NO:</span>
                    <span className="font-bold text-[#E5381B]">{orderNum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#181514]/60">TYPE:</span>
                    <span className="font-bold capitalize">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#181514]/60">ITEMS:</span>
                    <span className="font-bold">
                      {cartItems.reduce((acc, ci) => acc + ci.quantity, 0)} items
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#181514]/10 text-sm font-bold">
                    <span>TOTAL PAID:</span>
                    <span className="text-[#181514]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3.5 bg-[#181514] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#E5381B] transition-colors cursor-pointer"
                >
                  Start New Order
                </button>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER / TOTAL & CHECKOUT - Always stays pinned safely inside viewport */}
          {!isOrdered && cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-[#181514]/10 space-y-3.5 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="space-y-1.5 text-xs font-medium text-[#181514]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-[#181514]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#181514] pt-2 border-t border-[#181514]/10">
                  <span className="font-display uppercase text-lg">Total</span>
                  <span className="font-mono text-xl text-[#E5381B]">${total.toFixed(2)}</span>
                </div>
              </div>

              {ordersOpen ? (
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#E5381B] text-white font-display text-base font-black uppercase tracking-wider rounded-full hover:bg-[#c92f15] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  id="drawer-checkout-btn"
                >
                  PLACE ORDER (${total.toFixed(2)})
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1">
                  <span className="font-mono text-xs font-bold text-red-700 uppercase flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    KITCHEN PAUSED
                  </span>
                  <p className="text-[11px] text-[#181514]/70">
                    Online ordering is paused during peak service. Call us directly!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
