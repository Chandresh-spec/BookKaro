'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Trash2, ArrowRight, Film, Ticket, Trophy } from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, EmptyStateBlock } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';

type WishlistFilter = 'all' | 'movie' | 'event' | 'sport';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useAccount();
  const [filter, setFilter] = useState<WishlistFilter>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return wishlist;
    return wishlist.filter((w) => w.itemType === filter);
  }, [wishlist, filter]);

  const tabs: { id: WishlistFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Saved', count: wishlist.length },
    { id: 'movie', label: 'Movies', count: wishlist.filter((w) => w.itemType === 'movie').length },
    { id: 'event', label: 'Events', count: wishlist.filter((w) => w.itemType === 'event').length },
    { id: 'sport', label: 'Sports', count: wishlist.filter((w) => w.itemType === 'sport').length },
  ];

  return (
    <AccountShell activeSection="wishlist" pageTitle="Your Wishlist">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Header + Category Filter Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Your Wishlist</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Movies, concerts &amp; sports events you’ve saved or marked interested
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold">
              {wishlist.length} Saved
            </span>
          </div>

          <div className="px-5 flex items-center gap-5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'border-[#85142f] text-[#85142f]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wishlist Cards Grid */}
        {filtered.length === 0 ? (
          <EmptyStateBlock
            icon={Heart}
            title="Your Wishlist is empty"
            description="Tap the Heart or 'I’m Interested' button on any movie, concert, or sports event page to save it here."
            actionLabel="Discover Movies & Events"
            actionHref="/movies"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs flex flex-col group hover:border-neutral-300 transition-colors"
              >
                <div className="relative h-44 bg-neutral-100 overflow-hidden">
                  <Link href={item.href}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.itemType}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromWishlist(item.id);
                      showToast(`Removed "${item.title}" from Wishlist`);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-[#85142f] hover:bg-rose-50 shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={`Remove ${item.title} from wishlist`}
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {item.rating && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{item.rating}/10</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <Link
                      href={item.href}
                      className="text-sm font-bold text-neutral-900 hover:text-[#85142f] transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{item.subtitle}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="truncate">{item.meta}</span>
                      {item.city && (
                        <span className="inline-flex items-center gap-0.5 shrink-0 ml-2">
                          <MapPin className="w-3 h-3" />
                          {item.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-800">
                      {item.priceLabel || 'Available'}
                    </span>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connected Browsing Shortcuts */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold text-neutral-700">
            Explore more titles to add to your Wishlist
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/movies"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-[#85142f] hover:text-[#85142f]"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-[#85142f] hover:text-[#85142f]"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Live Events</span>
            </Link>
            <Link
              href="/sports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-[#85142f] hover:text-[#85142f]"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports</span>
            </Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
