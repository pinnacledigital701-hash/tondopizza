'use client';

import React from 'react';
import { ReservationStatus } from '@/lib/ownerStore';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md';
}

export function ReservationStatusBadge({ status, size = 'md' }: ReservationStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'NEW':
        return 'bg-[#E5381B] text-white border-[#E5381B] animate-pulse';
      case 'CONFIRMED':
        return 'bg-[#2D5A27] text-white border-[#2D5A27]';
      case 'SEATED':
        return 'bg-[#FDB827] text-[#181514] border-[#181514]';
      case 'COMPLETED':
        return 'bg-[#181514]/10 text-[#181514]/70 border-[#181514]/20';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200 line-through';
      case 'NO SHOW':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'NEW':
        return 'NEW REQUEST';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'SEATED':
        return 'SEATED';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'NO SHOW':
        return 'NO SHOW';
    }
  };

  const sizeClasses = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-full border ${sizeClasses} ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {getLabel()}
    </span>
  );
}
