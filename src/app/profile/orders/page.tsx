'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  MapPin,
  Calendar,
  QrCode,
  Download,
  Send,
  X,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Tv,
  ShieldCheck,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, EmptyStateBlock, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { OrderRecord } from '@/types/account';

type OrderTab = 'all' | 'upcoming' | 'past' | 'stream' | 'cancelled';

function DeterministicQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    const grid: boolean[] = [];
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        const inTopLeft = r < 4 && c < 4;
        const inTopRight = r < 4 && c > 6;
        const inBottomLeft = r > 6 && c < 4;
        if (inTopLeft || inTopRight || inBottomLeft) {
          grid.push(false);
        } else {
          hash = (hash * 1664525 + 1013904223) >>> 0;
          grid.push((hash & 1) === 1);
        }
      }
    }
    return grid;
  }, [seed]);

  return (
    <svg viewBox="0 0 110 110" className="w-24 h-24 text-neutral-900">
      {/* Finder squares */}
      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
      <rect x="5" y="5" width="20" height="20" fill="#fff" />
      <rect x="10" y="10" width="10" height="10" fill="currentColor" />

      <rect x="80" y="0" width="30" height="30" fill="currentColor" />
      <rect x="85" y="5" width="20" height="20" fill="#fff" />
      <rect x="90" y="10" width="10" height="10" fill="currentColor" />

      <rect x="0" y="80" width="30" height="30" fill="currentColor" />
      <rect x="5" y="85" width="20" height="20" fill="#fff" />
      <rect x="10" y="90" width="10" height="10" fill="currentColor" />

      {cells.map((filled, idx) => {
        if (!filled) return null;
        const r = Math.floor(idx / 11);
        const c = idx % 11;
        return (
          <rect
            key={idx}
            x={c * 10}
            y={r * 10}
            width="8"
            height="8"
            rx="1"
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

export default function OrdersPage() {
  const { orders, cancelOrder, profile } = useAccount();

  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const [query, setQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [cancelConfirmOrder, setCancelConfirmOrder] = useState<OrderRecord | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const tabCounts = useMemo(
    () => ({
      all: orders.length,
      upcoming: orders.filter((o) => o.isUpcoming && o.status === 'CONFIRMED').length,
      past: orders.filter((o) => !o.isUpcoming && o.status !== 'CANCELLED').length,
      stream: orders.filter((o) => o.type === 'stream').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === 'upcoming' && (!o.isUpcoming || o.status === 'CANCELLED')) return false;
      if (activeTab === 'past' && (o.isUpcoming || o.status === 'CANCELLED')) return false;
      if (activeTab === 'stream' && o.type !== 'stream') return false;
      if (activeTab === 'cancelled' && o.status !== 'CANCELLED') return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.bookingId.toLowerCase().includes(q) ||
          o.venue.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, activeTab, query]);

  const handleConfirmCancel = async () => {
    if (!cancelConfirmOrder) return;
    setIsCancelling(true);
    await cancelOrder(cancelConfirmOrder.id);
    setIsCancelling(false);
    setCancelConfirmOrder(null);
    if (selectedOrder?.id === cancelConfirmOrder.id) {
      setSelectedOrder(null);
    }
    showToast('Booking cancelled (simulated). Refund initiated!');
  };

  const tabs: { id: OrderTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Bookings', count: tabCounts.all },
    { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
    { id: 'past', label: 'Past', count: tabCounts.past },
    { id: 'stream', label: 'Stream', count: tabCounts.stream },
    { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
  ];

  const getStatusBadge = (status: OrderRecord['status']) => {
    if (status === 'CONFIRMED') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'CANCELLED') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-neutral-100 text-neutral-700 border-neutral-200';
  };

  return (
    <AccountShell activeSection="orders" pageTitle="Your Orders">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Header + Tabs + Search */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Your Orders</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                View your M-Tickets, booking breakdowns, and past transactions
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, venue, or ID..."
                className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="px-5 flex items-center gap-5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'border-[#85142f] text-[#85142f]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] leading-none ${
                      active
                        ? 'bg-rose-50 text-[#85142f]'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyStateBlock
            icon={Ticket}
            title="No bookings found"
            description={
              query.trim()
                ? `No orders matched "${query.trim()}". Try clearing your search or switching tabs.`
                : 'You don’t have any bookings matching this tab yet. Explore movies, concerts, and live sports in your city.'
            }
            actionLabel={query.trim() || activeTab !== 'all' ? 'Show All Orders' : 'Browse Movies & Events'}
            actionHref={query.trim() || activeTab !== 'all' ? undefined : '/movies'}
            onAction={
              query.trim() || activeTab !== 'all'
                ? () => {
                    setQuery('');
                    setActiveTab('all');
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  {/* Top Strip: Booked At + Booking ID + Status */}
                  <div className="px-4 sm:px-5 py-2.5 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span className="uppercase font-bold text-[#85142f] tracking-wide">
                        {order.type}
                      </span>
                      <span>•</span>
                      <span>Booked on {order.bookedAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-neutral-700">
                        {order.bookingId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Summary Row */}
                  <div className="p-4 sm:px-5 sm:py-4 flex gap-3.5 sm:gap-4">
                    <Link href={order.itemHref} className="shrink-0">
                      <img
                        src={order.posterImage}
                        alt={order.title}
                        className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg object-cover border border-neutral-200"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={order.itemHref}
                          className="text-sm sm:text-[15px] font-bold text-neutral-900 hover:text-[#85142f] transition-colors line-clamp-1"
                        >
                          {order.title}
                        </Link>
                        <span className="text-sm font-extrabold text-neutral-900 shrink-0">
                          ₹{order.totalPaid.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                        {order.subtitle}
                      </p>

                      <div className="mt-2.5 space-y-1 text-xs text-neutral-600">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>
                            {order.date} | {order.time}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">
                            {order.venue}
                            {order.city && order.city !== 'Online' ? `, ${order.city}` : ''}
                          </span>
                        </p>
                      </div>

                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100/80 text-[11px] font-semibold text-neutral-800">
                        <span>
                          {order.quantity} Ticket{order.quantity > 1 ? 's' : ''}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="truncate max-w-[220px] sm:max-w-xs">
                          {order.seatsOrTier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full-width Bottom Actions Strip */}
                  <div className="px-4 sm:px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2.5">
                    {order.status === 'CANCELLED' ? (
                      <span className="text-xs font-semibold text-rose-700 inline-flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Refund Initiated (₹{order.ticketPrice.toLocaleString('en-IN')} to BookKaro Cash / Original Source)
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-neutral-500 inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{order.deliveryType}</span>
                      </span>
                    )}

                    <div className="flex flex-wrap items-center gap-2 ml-auto">
                      {order.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {order.type === 'stream' ? (
                            <Tv className="w-3.5 h-3.5" />
                          ) : (
                            <QrCode className="w-3.5 h-3.5" />
                          )}
                          <span>{order.type === 'stream' ? 'View Receipt' : 'View M-Ticket'}</span>
                        </button>
                      )}

                      {order.canCancel && order.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => setCancelConfirmOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId((curr) => (curr === order.id ? null : order.id))
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:text-[#85142f] hover:border-neutral-300 transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Inline Booking & Payment Breakdown */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 py-4 bg-white border-t border-neutral-200/80 space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                            Booking Info
                          </p>
                          <div className="flex justify-between text-neutral-600">
                            <span>Payment Mode</span>
                            <span className="font-semibold text-neutral-900">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <div className="flex justify-between text-neutral-600">
                            <span>Delivery Type</span>
                            <span className="font-semibold text-neutral-900">
                              {order.deliveryType}
                            </span>
                          </div>
                          <div className="flex justify-between text-neutral-600">
                            <span>Cancellation</span>
                            <span className="font-semibold text-neutral-900">
                              {order.canCancel && order.status === 'CONFIRMED'
                                ? 'Available up to 2 hrs prior'
                                : order.status === 'CANCELLED'
                                ? 'Cancelled'
                                : 'Non-cancellable'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                            Payment Breakdown
                          </p>
                          <div className="flex justify-between text-neutral-600">
                            <span>Ticket Subtotal</span>
                            <span>₹{order.ticketPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-neutral-600">
                            <span>Convenience Fee (incl. GST)</span>
                            <span>₹{order.convenienceFee.toLocaleString('en-IN')}</span>
                          </div>
                          {order.donationAmount > 0 && (
                            <div className="flex justify-between text-neutral-600">
                              <span>BookAChange Contribution</span>
                              <span>₹{order.donationAmount}</span>
                            </div>
                          )}
                          {order.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-700 font-semibold">
                              <span>Offer Applied</span>
                              <span>-₹{order.discountAmount}</span>
                            </div>
                          )}
                          <div className="pt-1 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                            <span>Total Paid</span>
                            <span>₹{order.totalPaid.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href="/profile/help"
                          className="text-xs font-semibold text-neutral-600 hover:text-[#85142f]"
                        >
                          Need help with this booking?
                        </Link>
                        <Link
                          href={order.itemHref}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#85142f] hover:underline"
                        >
                          <span>
                            {order.type === 'stream' ? 'Open Stream Library' : 'View Event / Movie Page'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-neutral-500 px-1">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Booking history retains recent transactions up to 6 months. Simulated bookings &amp; cancellations update local demo state.
          </span>
        </div>
      </div>

      {/* Digital M-Ticket / Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 max-h-[92vh] flex flex-col">
            {/* Ticket Top Header */}
            <div className="bg-[#85142f] text-white p-4 sm:p-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={selectedOrder.posterImage}
                  alt={selectedOrder.title}
                  className="w-12 h-16 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                    {selectedOrder.deliveryType}
                  </span>
                  <h3 className="text-base font-extrabold leading-snug truncate">
                    {selectedOrder.title}
                  </h3>
                  <p className="text-[11px] text-rose-100 mt-0.5">{selectedOrder.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Close M-Ticket"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Perforated Divider */}
            <div className="relative flex items-center bg-neutral-50 px-4 py-2 border-y border-dashed border-neutral-300">
              <div className="w-4 h-4 rounded-full bg-black/65 -ml-6" />
              <div className="flex-1 text-center text-[10px] font-mono font-bold tracking-widest text-neutral-500">
                {selectedOrder.type === 'stream'
                  ? `BOOKKARO STREAM RECEIPT • ${selectedOrder.bookingId}`
                  : `SCAN AT VENUE ENTRY • ${selectedOrder.bookingId}`}
              </div>
              <div className="w-4 h-4 rounded-full bg-black/65 -mr-6" />
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs min-w-0">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                      Venue
                    </span>
                    <span className="font-bold text-neutral-900">{selectedOrder.venue}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                      Showtime
                    </span>
                    <span className="font-bold text-neutral-900">
                      {selectedOrder.date} • {selectedOrder.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                      Seats / Pass
                    </span>
                    <span className="font-extrabold text-[#85142f]">
                      {selectedOrder.seatsOrTier} ({selectedOrder.quantity}x)
                    </span>
                  </div>
                </div>

                {/* Deterministic SVG QR Pass */}
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 shrink-0 flex flex-col items-center">
                  <DeterministicQr seed={selectedOrder.bookingId} />
                  <span className="text-[9px] font-mono text-neutral-500 mt-1">
                    {selectedOrder.bookingId}
                  </span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/70 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Ticket Subtotal</span>
                  <span>₹{selectedOrder.ticketPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Convenience Fee (incl. GST)</span>
                  <span>₹{selectedOrder.convenienceFee.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.donationAmount > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>BookAChange Contribution</span>
                    <span>₹{selectedOrder.donationAmount}</span>
                  </div>
                )}
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Offer / Voucher Applied</span>
                    <span>-₹{selectedOrder.discountAmount}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                  <span>Amount Paid ({selectedOrder.paymentMethod})</span>
                  <span>₹{selectedOrder.totalPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedOrder.type === 'stream' ? (
                  <Link
                    href="/profile/stream-library"
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2 px-3 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-800 hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5 text-[#85142f]" />
                    <span>Open Stream Library</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        `M-Ticket resent to ${profile?.mobile || profile?.email || 'your contact'}!`
                      )
                    }
                    className="flex-1 py-2 px-3 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-800 hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#85142f]" />
                    <span>Resend Pass</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save / Print</span>
                </button>
              </div>

              {selectedOrder.canCancel && selectedOrder.status === 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={() => setCancelConfirmOrder(selectedOrder)}
                  className="w-full py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel This Booking
                </button>
              )}

              <SimulatedBanner text="Simulated M-Ticket & QR pass for preview. No live theatre barcode validation is performed." />
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelConfirmOrder && (
        <div className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Cancel Booking?</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Cancel <strong>{cancelConfirmOrder.title}</strong> ({cancelConfirmOrder.bookingId})?
                  Estimated refund: <strong>₹{cancelConfirmOrder.ticketPrice}</strong> to BookKaro Cash / original source.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCancelConfirmOrder(null)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-700 cursor-pointer"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg bg-[#85142f] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
