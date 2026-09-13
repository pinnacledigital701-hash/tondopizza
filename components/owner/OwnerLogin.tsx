'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { ownerStore } from '@/lib/ownerStore';
import { signInWithGoogle } from '@/lib/firebase';

interface OwnerLoginProps {
  onSuccess?: () => void;
  onAuthenticated?: () => void;
}

export function OwnerLogin({ onSuccess, onAuthenticated }: OwnerLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerStore.authenticate(pin)) {
      setError(false);
      onSuccess?.();
      onAuthenticated?.();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError(false);
      const user = await signInWithGoogle();
      if (user) {
        ownerStore.setFirebaseAuthenticated(user.email);
        onSuccess?.();
        onAuthenticated?.();
      }
    } catch (err) {
      console.error('Google login failed:', err);
      setError(true);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 10) {
      setPin((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-[#181514] text-[#F7F4EE] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Volcanic warm oven underglow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#E5381B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#FDB827]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Customer Website</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#FDB827] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
          <span>Internal Terminal</span>
        </div>
      </div>

      {/* MAIN LOGIN CARD */}
      <div className="max-w-md w-full mx-auto my-auto py-8 z-10">
        <div
          className={`bg-[#201C1A] border-2 border-[#181514] rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_0px_#E5381B] transition-transform ${
            shake ? 'animate-bounce' : ''
          }`}
        >
          {/* BRAND LOGO */}
          <div className="text-center space-y-3 pb-6 border-b border-white/10">
            <div className="flex justify-center">
              <img
                src="/tondologo.png"
                alt="Tondo Pizza Logo"
                className="h-20 w-auto object-contain drop-shadow-[0_4px_16px_rgba(229,56,27,0.3)]"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[#E5381B] block">
                OPERATIONS CONSOLE
              </span>
              <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white mt-0.5">
                TONDO PIZZA CO.
              </h1>
              <p className="text-xs text-white/50 font-medium mt-1">
                Enter manager passcode or 4-digit oven terminal PIN.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="pt-6 space-y-5">
            <div>
              <label
                htmlFor="owner-pin"
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70 mb-2"
              >
                PASSCODE OR PIN
              </label>
              <div className="relative">
                <input
                  id="owner-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="••••"
                  autoFocus
                  className="w-full px-5 py-4 bg-[#181514] border-2 border-white/15 focus:border-[#E5381B] rounded-2xl text-center font-mono text-2xl tracking-[0.3em] text-[#F7F4EE] placeholder-white/20 focus:outline-hidden transition-all shadow-inner"
                />
                <KeyRound className="w-5 h-5 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {error && (
                <p className="text-xs font-semibold text-[#E5381B] mt-2 text-center animate-pulse">
                  Invalid passcode. Please check your credentials.
                </p>
              )}
            </div>

            {/* NUMERIC KEYPAD FOR TOUCH / TABLET TERMINALS */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 bg-[#181514]/60 hover:bg-[#181514] text-white font-mono font-bold text-lg rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-3 bg-[#181514]/40 hover:bg-[#181514] text-white/50 hover:text-white font-mono text-xs uppercase font-bold rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 bg-[#181514]/60 hover:bg-[#181514] text-white font-mono font-bold text-lg rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 bg-[#181514]/40 hover:bg-[#181514] text-white/60 hover:text-white font-mono text-xs uppercase font-bold rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#E5381B] hover:bg-[#c92f15] text-white font-display text-base font-black uppercase tracking-wider rounded-2xl active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>ACCESS CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-white/40">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#181514] font-display text-sm font-bold uppercase tracking-wider rounded-2xl active:scale-98 transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}</span>
            </button>
          </form>

          {/* DEMO ACCESS HINT (CLEAN AND DISCREET) */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              DEMO TERMINAL ACCESS
            </span>
            <p className="text-xs font-mono text-[#FDB827] mt-1 bg-white/5 py-1.5 px-3 rounded-lg inline-block border border-white/10">
              Manager PIN: <strong className="text-white">9004</strong> or Passcode: <strong className="text-white">tondo2026</strong>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-md mx-auto text-center text-[11px] text-white/30 font-medium z-10">
        Tondo Pizza Co. Operations System • Eastside Woodfire Kitchen
      </div>
    </div>
  );
}
