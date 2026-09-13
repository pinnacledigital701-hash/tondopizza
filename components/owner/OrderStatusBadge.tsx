'use client';

import React from 'react';
import { OrderStatus } from '@/lib/ownerStore';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'NEW':
        return 'bg-[#E5381B] text-white border-[#E5381B] animate-pulse';
      case 'CONFIRMED':
        return 'bg-[#181514] text-white border-[#181514]';
      case 'PREPARING':
        return 'bg-[#FDB827] text-[#181514] border-[#181514]';
      case 'READY':
        return 'bg-[#2D5A27] text-white border-[#2D5A27]';
      case 'COMPLETED':
        return 'bg-[#181514]/10 text-[#181514]/70 border-[#181514]/20';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-300 line-through';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'NEW':
        return 'NEW ORDER';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'PREPARING':
        return 'IN FORNO (PREP)';
      case 'READY':
        return 'READY ON PASS';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCELLED':
        return 'CANCELLED';
    }
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
    lg: 'text-xs px-3.5 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-full border ${sizeClasses} ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {getLabel()}
    </span>
  );
}
