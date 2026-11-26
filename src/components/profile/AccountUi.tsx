'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Info, LucideIcon } from 'lucide-react';

export const ToastAlert: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed top-16 lg:top-24 right-4 z-[120] bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
      <Check className="w-4 h-4 stroke-[2.5px] shrink-0" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export const SimulatedBanner: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-neutral-100/90 border border-neutral-200/80 text-[11px] text-neutral-600">
    <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
    <span>{text}</span>
  </div>
);

export const EmptyStateBlock: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}> = ({ icon: Icon, title, description, actionLabel, actionHref, onAction }) => (
  <div className="bg-white rounded-xl border border-neutral-200/80 py-12 px-6 text-center flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#85142f] flex items-center justify-center mb-3">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
    <p className="text-xs text-neutral-500 max-w-sm mt-1 leading-relaxed">{description}</p>
    {actionLabel && actionHref && (
      <Link
        href={actionHref}
        className="mt-4 px-4 py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors"
      >
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && !actionHref && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 px-4 py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
