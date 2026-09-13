'use client';

import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Store,
  Clock,
  Flame,
  Phone,
  Mail,
  MapPin,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { RestaurantSettingsData, ownerStore } from '@/lib/ownerStore';

interface SettingsPanelProps {
  settings: RestaurantSettingsData;
  onRefresh: () => void;
}

export function SettingsPanel({ settings, onRefresh }: SettingsPanelProps) {
  const [formData, setFormData] = useState<RestaurantSettingsData>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    ownerStore.saveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all orders, reservations, and customer rosters back to the initial demo state?'
      )
    ) {
      ownerStore.resetToDemo();
      onRefresh();
      alert('Tondo Pizza data has been reset to initial demo state.');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181514]/60 block">
            RESTAURANT & DISPATCH CONTROLS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#181514]">
            OPERATIONAL SETTINGS
          </h2>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-[#2D5A27] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>CHANGES SAVED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* DISPATCH & KITCHEN READINESS */}
        <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#181514]/10">
            <Flame className="w-5 h-5 text-[#E5381B]" />
            <h3 className="font-display text-xl font-black uppercase text-[#181514]">
              KITCHEN & ONLINE ORDERING SWITCHES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ONLINE ORDERING TOGGLE */}
            <div className="p-4 rounded-2xl border-2 border-[#181514] bg-[#F7F4EE] flex items-center justify-between">
              <div>
                <strong className="font-display text-base uppercase text-[#181514] block">
                  ACCEPT ONLINE ORDERS
                </strong>
                <p className="text-xs text-[#181514]/70 mt-0.5">
                  Allows customers to place orders on the website.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.orderAcceptingEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, orderAcceptingEnabled: e.target.checked })
                }
                className="w-6 h-6 accent-[#E5381B] rounded-sm cursor-pointer"
              />
            </div>

            {/* TABLE RESERVATIONS TOGGLE */}
            <div className="p-4 rounded-2xl border-2 border-[#181514] bg-[#F7F4EE] flex items-center justify-between">
              <div>
                <strong className="font-display text-base uppercase text-[#181514] block">
                  ACCEPT TABLE RESERVATIONS
                </strong>
                <p className="text-xs text-[#181514]/70 mt-0.5">
                  Accept incoming dining room party requests.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.reservationAcceptingEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, reservationAcceptingEnabled: e.target.checked })
                }
                className="w-6 h-6 accent-[#2D5A27] rounded-sm cursor-pointer"
              />
            </div>
          </div>

          {/* ESTIMATED PREP TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PICKUP PREP ESTIMATE (MINUTES)
              </label>
              <input
                type="number"
                value={formData.pickupEstimatedMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, pickupEstimatedMinutes: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-xs font-bold text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                DELIVERY ESTIMATE (MINUTES)
              </label>
              <input
                type="number"
                value={formData.deliveryEstimatedMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryEstimatedMinutes: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-xs font-bold text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                WOOD OVEN TEMPERATURE
              </label>
              <input
                type="text"
                value={formData.ovenTemp}
                onChange={(e) =>
                  setFormData({ ...formData, ovenTemp: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono text-xs font-bold text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>
          </div>
        </div>

        {/* RESTAURANT IDENTITY & CONTACT */}
        <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#181514]/10">
            <Store className="w-5 h-5 text-[#E5381B]" />
            <h3 className="font-display text-xl font-black uppercase text-[#181514]">
              STORE IDENTITY & LOCATION
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                RESTAURANT NAME
              </label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                TAGLINE
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PHONE NUMBER
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PUBLIC EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PHYSICAL ADDRESS
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#181514]/20 font-mono focus:outline-hidden focus:border-[#E5381B]"
              />
            </div>
          </div>
        </div>

        {/* OPERATING HOURS */}
        <div className="bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#181514]/10">
            <Clock className="w-5 h-5 text-[#E5381B]" />
            <h3 className="font-display text-xl font-black uppercase text-[#181514]">
              WEEKLY OPERATING HOURS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {Object.entries(formData.openingHours).map(([day, val]) => (
              <div
                key={day}
                className="p-3 bg-[#F7F4EE] rounded-xl border border-[#181514]/20 flex items-center justify-between"
              >
                <span className="font-bold uppercase text-[#181514] w-28">{day}:</span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      openingHours: { ...formData.openingHours, [day]: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1 rounded-lg border border-[#181514]/20 bg-white font-mono text-xs text-[#181514] focus:outline-hidden focus:border-[#E5381B]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ACTION SUBMIT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border-2 border-[#181514] shadow-[6px_6px_0px_0px_#181514]">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#E5381B] hover:bg-[#c92f15] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_0px_#181514] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="w-full sm:w-auto px-4 py-3 bg-white text-red-700 hover:bg-red-50 border-2 border-red-200 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET TO DEMO STORE DATA</span>
          </button>
        </div>
      </form>
    </div>
  );
}
