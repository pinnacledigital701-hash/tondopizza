'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Utensils,
  Flame,
  Search,
} from 'lucide-react';
import { ManagedMenuItem, ownerStore } from '@/lib/ownerStore';

interface MenuManagerProps {
  menuItems: ManagedMenuItem[];
  onRefresh: () => void;
}

export function MenuManager({ menuItems, onRefresh }: MenuManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<ManagedMenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Item Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('18');
  const [newCategory, setNewCategory] = useState('rosse');
  const [newTagline, setNewTagline] = useState('');
  const [newBadge, setNewBadge] = useState('');

  const categories = [
    { label: 'ALL ITEMS', value: 'ALL' },
    { label: 'PIZZE ROSSE', value: 'rosse' },
    { label: 'PIZZE BIANCHE', value: 'bianche' },
    { label: 'SIDES', value: 'sides' },
    { label: 'DOLCI & DRINKS', value: 'dolci' },
    { label: 'SPECIAL BURGERS', value: 'burgers' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleSoldOut = (id: string) => {
    ownerStore.toggleItemSoldOut(id);
    onRefresh();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to remove this item from the active menu?')) {
      ownerStore.deleteMenuItem(id);
      onRefresh();
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    ownerStore.saveMenuItem(editingItem);
    setEditingItem(null);
    onRefresh();
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const priceNum = parseFloat(newPrice) || 16;
    const newItem: ManagedMenuItem = {
      id: 'item-' + Date.now(),
      name: newName.trim().toUpperCase(),
      description: newDesc.trim(),
      price: priceNum,
      category: newCategory as any,
      tagline: newTagline.trim() || undefined,
      badge: newBadge.trim() || undefined,
      badgeType: 'red',
      isAvailable: true,
      isSoldOut: false,
    };

    ownerStore.saveMenuItem(newItem);
    setIsAddingNew(false);
    setNewName('');
    setNewDesc('');
    setNewPrice('18');
    setNewTagline('');
    setNewBadge('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS & ADD BUTTON */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block">
              LIVE MENU & 86 LIST
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#181514]">
              KITCHEN MENU ROSTER
            </h2>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 bg-[#E5381B] hover:bg-[#c92f15] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_0px_#181514] flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW MENU ITEM</span>
          </button>
        </div>

        {/* CATEGORY TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-1.5 flex-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#181514] text-white shadow-xs'
                    : 'bg-[#F7F4EE] text-[#181514]/70 hover:bg-[#181514]/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#181514]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isSoldOut = !!item.isSoldOut;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border-2 border-[#181514] transition-all flex flex-col justify-between shadow-[4px_4px_0px_0px_#181514] ${
                isSoldOut ? 'bg-gray-100 opacity-75' : 'bg-white hover:bg-[#FDFBF7]'
              }`}
            >
              <div>
                {/* TOP ROW: CATEGORY & 86 BADGE */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 bg-[#181514]/5 px-2 py-0.5 rounded-sm">
                    {item.category}
                  </span>

                  {isSoldOut ? (
                    <span className="bg-[#E5381B] text-white font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded-sm animate-pulse">
                      86&apos;D / SOLD OUT
                    </span>
                  ) : (
                    <span className="bg-[#2D5A27] text-white font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded-sm">
                      AVAILABLE
                    </span>
                  )}
                </div>

                {/* NAME & PRICE */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-display text-xl font-black uppercase text-[#181514] leading-tight ${
                      isSoldOut ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {item.name}
                  </h3>
                  <span className="font-mono text-lg font-black text-[#E5381B] shrink-0">
                    ${item.price}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-[#181514]/70 mt-2 font-medium line-clamp-2">
                  {item.description}
                </p>

                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.ingredients.slice(0, 3).map((ing, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono bg-[#181514]/5 text-[#181514]/80 px-1.5 py-0.5 rounded-xs"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 pt-3 border-t border-[#181514]/10 flex items-center justify-between">
                {/* 86 / SOLD OUT TOGGLE */}
                <button
                  type="button"
                  onClick={() => handleToggleSoldOut(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSoldOut
                      ? 'bg-[#2D5A27] text-white hover:bg-[#20441c]'
                      : 'bg-[#181514] text-white hover:bg-[#E5381B]'
                  }`}
                >
                  {isSoldOut ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>RESTOCK (UN-86)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-[#FDB827]" />
                      <span>86 ITEM</span>
                    </>
                  )}
                </button>

                {/* EDIT & DELETE */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 text-[#181514]/60 hover:text-[#181514] rounded-lg hover:bg-[#181514]/5 cursor-pointer transition-colors"
                    title="Edit item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setEditingItem(null)}
          />

          <div className="relative w-full max-w-lg bg-[#F7F4EE] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] p-6 sm:p-8 z-10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
              <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
                EDIT MENU ITEM
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-[#181514]/60 hover:text-[#181514]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  ITEM NAME
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-display text-base font-black text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                    PRICE ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-sm font-bold text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-xs font-bold uppercase bg-white focus:outline-hidden focus:border-[#E5381B]"
                  >
                    <option value="rosse">Pizze Rosse</option>
                    <option value="bianche">Pizze Bianche</option>
                    <option value="sides">Sides</option>
                    <option value="dolci">Dolci & Drinks</option>
                    <option value="burgers">Special Burgers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#181514]/20 text-xs text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#181514] text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#E5381B] transition-colors cursor-pointer"
                >
                  SAVE CHANGES
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-3 bg-white text-[#181514] border border-[#181514]/20 font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#181514]/5 cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW ITEM MODAL */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsAddingNew(false)}
          />

          <div className="relative w-full max-w-lg bg-[#F7F4EE] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] p-6 sm:p-8 z-10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
              <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
                ADD NEW MENU ITEM
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1.5 text-[#181514]/60 hover:text-[#181514]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  ITEM NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CALABRESE CRUNCH"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-display text-base font-black text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                    PRICE ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-sm font-bold text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-xs font-bold uppercase bg-white focus:outline-hidden focus:border-[#E5381B]"
                  >
                    <option value="rosse">Pizze Rosse</option>
                    <option value="bianche">Pizze Bianche</option>
                    <option value="sides">Sides</option>
                    <option value="dolci">Dolci & Drinks</option>
                    <option value="burgers">Special Burgers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                  DESCRIPTION & INGREDIENTS
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="List the key artisanal toppings, cheese, and dough pairings..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#181514]/20 text-xs text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E5381B] text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#c92f15] transition-colors cursor-pointer"
                >
                  ADD TO MENU
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-3 bg-white text-[#181514] border border-[#181514]/20 font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#181514]/5 cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
