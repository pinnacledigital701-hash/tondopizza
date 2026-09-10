'use client';

import React, { useState } from 'react';
import { CheckCircle2, Calendar, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface VisitAndReserveSectionProps {
  initialOpen?: boolean;
}

export function VisitAndReserveSection({ initialOpen }: VisitAndReserveSectionProps) {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2');
  const [dateTime, setDateTime] = useState('');
  const [email, setEmail] = useState('');
  const [isReserved, setIsReserved] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomCode = 'TND-' + Math.floor(1000 + Math.random() * 9000);
    setBookingCode(randomCode);
    setIsReserved(true);
  };

  const handleReset = () => {
    setIsReserved(false);
    setName('');
    setEmail('');
    setDateTime('');
  };

  return (
    <section id="visit" className="bg-[#E5381B] text-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background subtle radial warm wash */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN: CONTACT & LOCATION */}
        <div className="lg:col-span-6 space-y-10">
          <h2 className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-white uppercase leading-[0.88]">
            COME GET<br />A SLICE
          </h2>

          <div className="space-y-8 max-w-md">
            {/* FIND US */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#FFE8D6] block mb-1">
                FIND US
              </span>
              <p className="font-bold text-lg sm:text-xl text-white">
                112 Forno Street, Eastside Market District
              </p>
            </div>

            {/* HOURS */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#FFE8D6] block mb-1">
                HOURS
              </span>
              <p className="font-semibold text-base sm:text-lg text-white/95 leading-relaxed">
                Tue–Thu 5–10pm · Fri–Sat 12–11pm · Sun 12–9pm · Mon closed
              </p>
            </div>

            {/* SAY HI */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#FFE8D6] block mb-1">
                SAY HI
              </span>
              <p className="font-semibold text-base sm:text-lg text-white/95">
                (555) 014-2231 · ciao@tondopizza.co
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOK A TABLE FORM CARD */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white text-[#181514] rounded-[32px] p-8 sm:p-10 border-2 border-[#181514] shadow-[8px_8px_0px_0px_rgba(24,21,20,1)]">
            {!isReserved ? (
              <form onSubmit={handleSubmit} className="space-y-5" id="reservation-form">
                <div>
                  <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight uppercase text-[#181514]">
                    BOOK A TABLE
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#181514]/60 mt-1">
                    Walk-ins welcome — but Friday gets wild.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Name field */}
                  <div>
                    <label className="sr-only" htmlFor="res-name">
                      Your name
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden font-medium text-sm text-[#181514] placeholder-[#181514]/40 transition-colors"
                    />
                  </div>

                  {/* Optional Email */}
                  <div>
                    <label className="sr-only" htmlFor="res-email">
                      Email address
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      placeholder="Email (for confirmation)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden font-medium text-sm text-[#181514] placeholder-[#181514]/40 transition-colors"
                    />
                  </div>

                  {/* Guests & Date/Time split */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="sr-only" htmlFor="res-guests">
                        Guests
                      </label>
                      <select
                        id="res-guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden font-medium text-sm text-[#181514] bg-white transition-colors cursor-pointer"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="7">7+ Guests (Party)</option>
                      </select>
                    </div>

                    <div>
                      <label className="sr-only" htmlFor="res-datetime">
                        Date & time
                      </label>
                      <input
                        id="res-datetime"
                        type="text"
                        placeholder="Tonight, 7:30 PM"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#181514]/20 focus:border-[#E5381B] focus:outline-hidden font-medium text-sm text-[#181514] placeholder-[#181514]/40 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#E5381B] text-white font-display text-lg font-black tracking-wider uppercase rounded-2xl hover:bg-[#c92f15] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  id="reserve-submit-btn"
                >
                  RESERVE →
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-[#157C41]/10 text-[#157C41] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E5381B] block mb-1">
                    CONFIRMED PASS
                  </span>
                  <h3 className="font-display text-3xl font-black uppercase text-[#181514]">
                    TABLE RESERVED!
                  </h3>
                  <p className="text-xs font-semibold text-[#181514]/60 mt-1">
                    We’ve held a spot near the wood oven for you.
                  </p>
                </div>

                <div className="bg-[#F7F4EE] rounded-2xl p-5 text-left border border-[#181514]/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#181514]/60 font-semibold">NAME:</span>
                    <span className="font-bold text-[#181514]">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#181514]/60 font-semibold">PARTY:</span>
                    <span className="font-bold text-[#181514]">{guests} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#181514]/60 font-semibold">TIME:</span>
                    <span className="font-bold text-[#181514]">
                      {dateTime || 'Tonight at 7:30 PM'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#181514]/10">
                    <span className="text-[#181514]/60 font-semibold">CODE:</span>
                    <span className="font-mono font-black text-[#E5381B]">{bookingCode}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-[#181514]/60 hover:text-[#181514] uppercase tracking-wider underline pt-2"
                >
                  Make another booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
