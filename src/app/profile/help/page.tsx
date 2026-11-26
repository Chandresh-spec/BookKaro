'use client';

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquare,
  Send,
  Ticket,
  CheckCircle2,
  X,
  PhoneCall,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner, EmptyStateBlock } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { HELP_CATEGORIES } from '@/data/mockAccountData';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

export default function HelpSupportPage() {
  const { orders, supportTickets, createSupportTicket } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [openFaqKey, setOpenFaqKey] = useState<string | null>('cancellation-0');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.bookingId || '');

  // Support chat & ticket modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hi! I’m BookKaro Care (Simulated Assistant). Select a topic or type your question about bookings, refunds, or Stream.',
    },
  ]);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Cancellation & Refund');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCategories = useMemo(() => {
    return HELP_CATEGORIES.filter((cat) => {
      if (selectedCategoryId !== 'all' && cat.id !== selectedCategoryId) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.faqs.some(
          (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedCategoryId, searchQuery]);

  const handleSendChat = (textToSend?: string) => {
    const content = (textToSend ?? chatInput).trim();
    if (!content) return;

    const lower = content.toLowerCase();
    let reply =
      'Thanks for reaching out! You can raise a tracked support ticket below or check Your Orders for instant M-Ticket actions.';
    if (lower.includes('refund') || lower.includes('cancel')) {
      reply =
        'For eligible bookings, open Profile → Your Orders and tap Cancel. Bank/UPI refunds take 5–7 business days; BookKaro Cash is instant.';
    } else if (lower.includes('ticket') || lower.includes('whatsapp') || lower.includes('sms')) {
      reply =
        'Make sure your mobile number is verified in Profile → Mobile Verification to receive QR M-Tickets on WhatsApp & SMS.';
    } else if (lower.includes('stream')) {
      reply =
        'Stream rentals remain active for 30 days (48 hours once playback begins). Purchased titles never expire.';
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: content },
      { sender: 'bot', text: reply },
    ]);
    if (!textToSend) setChatInput('');
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    const created = createSupportTicket({
      subject: ticketSubject.trim(),
      category: ticketCategory,
      bookingId: selectedOrderId || undefined,
    });
    setTicketSubject('');
    showToast(`Support ticket ${created.id} created (simulated)`);
  };

  return (
    <AccountShell activeSection="help" pageTitle="Help & Support">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Search Banner */}
        <div className="bg-gradient-to-r from-[#2c0913] via-[#6b1027] to-[#85142f] text-white rounded-xl p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold">How can we help you today?</h2>
              <p className="text-xs text-rose-100/90 mt-0.5">
                Search FAQs, get help with a booking, or chat with BookKaro Care
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-4 py-2 rounded-lg bg-white text-[#85142f] text-xs font-bold shadow-xs hover:bg-rose-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with Us</span>
            </button>
          </div>

          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search refunds, M-Tickets, Stream playback, Play Card..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Booking-Specific Quick Assistance */}
        {orders.length > 0 && (
          <section className="bg-white rounded-xl border border-neutral-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#85142f] flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                  Need help with a recent booking?
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Select a booking ID to attach it directly to your support query
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="px-3 py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-800 bg-white max-w-[230px]"
              >
                {orders.slice(0, 5).map((o) => (
                  <option key={o.id} value={o.bookingId}>
                    {o.bookingId} — {o.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setIsChatOpen(true);
                  handleSendChat(`Help with booking ${selectedOrderId}`);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] shrink-0 cursor-pointer"
              >
                Get Help
              </button>
            </div>
          </section>
        )}

        {/* Help Categories Grid */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Browse Help Topics</h3>
            {selectedCategoryId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategoryId('all')}
                className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
              >
                Show All Topics
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HELP_CATEGORIES.map((cat) => {
              const active = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId((prev) => (prev === cat.id ? 'all' : cat.id))
                  }
                  className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-[#85142f] bg-rose-50/70'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <p className="text-xs font-bold text-neutral-900">{cat.title}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions Accordions */}
        <section className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#85142f]" />
            <h3 className="text-sm font-bold text-neutral-900">Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredCategories.length === 0 ? (
              <div className="p-6">
                <EmptyStateBlock
                  icon={Search}
                  title="No matching help articles"
                  description={`We couldn't find FAQs matching "${searchQuery}". Try clearing your search or chat with BookKaro Care.`}
                  actionLabel="Clear Search"
                  onAction={() => {
                    setSearchQuery('');
                    setSelectedCategoryId('all');
                  }}
                />
              </div>
            ) : (
              filteredCategories.map((cat) =>
                cat.faqs
                  .filter(
                    (f) =>
                      !searchQuery.trim() ||
                      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.a.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((faq, idx) => {
                    const key = `${cat.id}-${idx}`;
                    const isOpen = openFaqKey === key;
                    return (
                      <div key={key}>
                        <button
                          type="button"
                          onClick={() => setOpenFaqKey(isOpen ? null : key)}
                          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-neutral-50/70 transition-colors cursor-pointer"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#85142f] block">
                              {cat.title}
                            </span>
                            <span className="text-xs sm:text-[13px] font-semibold text-neutral-900">
                              {faq.q}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180 text-[#85142f]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed bg-neutral-50/50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })
              )
            )}
          </div>
        </section>

        {/* Raise a Ticket & Ticket History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-neutral-900">Raise a Support Request</h3>
            <form onSubmit={handleRaiseTicket} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1">
                  Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs bg-white"
                >
                  <option>Cancellation &amp; Refund</option>
                  <option>Payment Issue</option>
                  <option>Booking Modification</option>
                  <option>Stream Playback</option>
                  <option>Other Query</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1">
                  Describe your issue
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Tell us what happened..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-[#85142f]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold cursor-pointer"
              >
                Submit Support Ticket
              </button>
            </form>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Your Support Tickets</h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                <PhoneCall className="w-3 h-3 text-[#85142f]" />
                24×7 Care: support@bookkaro.com
              </span>
            </div>

            <div className="space-y-2.5">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-neutral-700">
                      {t.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-900">{t.subject}</p>
                  <p className="text-[11px] text-neutral-500">
                    {t.category} {t.bookingId ? `• ${t.bookingId}` : ''} • {t.lastUpdate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <SimulatedBanner text="Customer support chat and ticket submission run in simulated demo mode." />
      </div>

      {/* Simulated Live Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-end sm:items-center justify-end sm:p-5">
          <div className="w-full sm:w-96 h-[75vh] sm:h-[520px] bg-white sm:rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
            <div className="bg-[#85142f] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <div>
                  <h4 className="text-xs font-bold">BookKaro Care Assistant</h4>
                  <p className="text-[10px] text-rose-100">Simulated 24×7 Support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded hover:bg-white/15 cursor-pointer"
                aria-label="Close support chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'ml-auto bg-[#85142f] text-white'
                      : 'bg-white border border-neutral-200 text-neutral-800'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="px-3 py-2 bg-white border-t border-neutral-100 flex flex-wrap gap-1.5">
              {['Refund status', 'WhatsApp tickets', 'Stream validity'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChat(chip)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-rose-50 text-[11px] font-semibold text-neutral-700 hover:text-[#85142f] cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="p-3 border-t border-neutral-200 bg-white flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-[#85142f]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-[#85142f] text-white cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
