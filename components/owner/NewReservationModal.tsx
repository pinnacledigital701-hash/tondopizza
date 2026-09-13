'use client';

import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { ReservationRecord, ownerStore } from '@/lib/ownerStore';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationCreated: (res: ReservationRecord) => void;
}

export function NewReservationModal({
  isOpen,
  onClose,
  onReservationCreated,
}: NewReservationModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const code = 'RES-' + Math.floor(100 + Math.random() * 900);
    const newRes: ReservationRecord = {
      id: 'res-' + Date.now(),
      bookingCode: code,
      customer: {
        name: guestName.trim(),
        phone: phone.trim() || '555-0100',
        email: email.trim() || undefined,
      },
      guests,
      date,
      time,
      status: 'CONFIRMED',
      specialRequests: specialRequests.trim() || undefined,
      tableNumber: tableNumber.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ownerStore.addReservation(newRes);
    onReservationCreated(newRes);
    onClose();
    setGuestName('');
    setPhone('');
    setEmail('');
    setSpecialRequests('');
    setTableNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#F7F4EE] rounded-3xl border-2 border-[#181514] shadow-[10px_10px_0px_0px_#181514] p-6 sm:p-8 z-10 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#181514]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E5381B]" />
            <h3 className="font-display text-2xl font-black uppercase text-[#181514]">
              MANUAL TABLE BOOKING
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#181514]/60 hover:text-[#181514]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
              GUEST NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Francesca Bianchi"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                PHONE NUMBER
              </label>
              <input
                type="text"
                placeholder="(555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                EMAIL (OPTIONAL)
              </label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                DATE
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 font-mono focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                TIME
              </label>
              <input
                type="text"
                required
                placeholder="19:00"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 font-mono focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
                GUESTS
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 font-mono focus:border-[#E5381B] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
              ASSIGN TABLE (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. Table 6 (Window)"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-[#181514]/60 block mb-1">
              SPECIAL REQUESTS / NOTES
            </label>
            <input
              type="text"
              placeholder="e.g. Anniversary, quiet corner"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#181514] text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#E5381B] transition-colors cursor-pointer"
            >
              CONFIRM RESERVATION
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
