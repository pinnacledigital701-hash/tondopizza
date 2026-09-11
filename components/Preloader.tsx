'use client';

import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  minDurationMs?: number;
}

export function Preloader({ minDurationMs = 2800 }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const unmountTimer = setTimeout(() => setShouldRender(false), 700);
      return () => clearTimeout(unmountTimer);
    }, minDurationMs);
    return () => clearTimeout(timer);
  }, [minDurationMs]);

  if (!shouldRender) return null;

  return (
    <div
      id="portal-scan-preloader"
      role="status"
      aria-label="Launching the Tondo Pizza premium design pipeline..."
      /* 
        CRITICAL LAYER REPAIR:
        Changed class from `z-50` to an absolute high precedence `z-[100]` and added `fixed` 
        with full inset constraints to forcefully block fixed header components from layering over it.
      */
      className={`fixed inset-0 z-[100] bg-[#120F0E] flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100 pointer-events-auto scale-100'
      }`}
    >
      <style>{`
        @keyframes laserSweepVertical {
          0% { top: -10%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes elasticLogoFloat {
          0%, 100% {
            transform: translateY(0px) scale(0.98) rotate(0deg);
            filter: drop-shadow(0 10px 20px rgba(229, 56, 27, 0.2));
          }
          50% {
            transform: translateY(-14px) scale(1.04) rotate(2deg);
            filter: drop-shadow(0 30px 50px rgba(229, 56, 27, 0.45));
          }
        }
        @keyframes backgroundFurnacePulse {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        @keyframes trackingTextExpand {
          0% { letter-spacing: 0.15em; opacity: 0; }
          40% { letter-spacing: 0.3em; opacity: 1; }
          100% { letter-spacing: 0.35em; opacity: 1; }
        }
      `}</style>

      {/* Volcanic ambient background furnace pulse glow */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[#E5381B]/15 blur-[130px] pointer-events-none -z-10" 
        style={{ animation: 'backgroundFurnacePulse 4s ease-in-out infinite' }}
      />

      {/* Laser-Line Scan Sweep Overlay */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5381B] to-transparent shadow-[0_0_15px_#E5381B] pointer-events-none z-20"
        style={{ animation: 'laserSweepVertical 2.4s cubic-bezier(0.25, 1, 0.5, 1) infinite' }}
      />

      {/* Main Branding Stack Display Column */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-md px-6">
        
        {/* Your Custom Tondo Logo with Elastic Floating Keyframe Multipliers */}
        <div 
          className="relative flex items-center justify-center w-36 h-36"
          style={{ animation: 'elasticLogoFloat 3s ease-in-out infinite' }}
        >
          <img 
            src="/tondologo.png" 
            alt="Tondo Pizza Premium Branding Signature" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Sophisticated Text Tracking Nodes */}
        <div className="space-y-2 flex flex-col items-center">
          <p 
            className="text-xs uppercase text-[#F7F4EE] font-bold font-sans"
            style={{ animation: 'trackingTextExpand 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            FIRING THE PIZZA FORNO
          </p>
          <span className="text-[10px] text-[#FDB827] font-semibold uppercase tracking-[0.25em] opacity-60 font-sans block max-w-xs leading-normal">
            900°F Volcanic Stone Oven
          </span>
        </div>

      </div>
    </div>
  );
}
