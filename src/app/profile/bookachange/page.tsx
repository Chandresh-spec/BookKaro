'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  HeartHandshake,
  Receipt,
  CheckCircle2,
  X,
  Loader2,
  Users,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { BOOKACHANGE_CAMPAIGNS } from '@/data/mockAccountData';
import { BookAChangeCampaign } from '@/types/account';

export default function BookAChangePage() {
  const {
    bacContributions,
    preferences,
    updatePreferences,
    donateBookAChange,
  } = useAccount();

  const [selectedCampaign, setSelectedCampaign] = useState<BookAChangeCampaign | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [isDonating, setIsDonating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const totalContributed = bacContributions.reduce((acc, c) => acc + c.amount, 0);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || amount <= 0) return;
    setIsDonating(true);
    const entry = await donateBookAChange(selectedCampaign.title, amount);
    setIsDonating(false);
    setSelectedCampaign(null);
    showToast(`Thank you! Simulated ₹${amount} receipt ${entry.receiptId} generated.`);
  };

  return (
    <AccountShell activeSection="bookachange" pageTitle="BookAChange">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Hero Social Impact Banner */}
        <div className="bg-gradient-to-r from-[#2e0b16] via-[#6d1028] to-[#85142f] text-white rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-400 p-0.5 shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#85142f]" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold">BookAChange</h2>
                <p className="text-xs sm:text-sm text-rose-100 mt-0.5">
                  Powering Dreams, Amplifying Change — supporting music, cinema &amp; performing arts for underserved communities.
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold block">
                Your Cumulative Impact
              </span>
              <span className="text-xl font-black">₹{totalContributed.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-rose-100 block">
                across {bacContributions.length} contributions
              </span>
            </div>
          </div>
        </div>

        {/* Auto Roundup Checkout Preference */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#85142f] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                ₹1 Ticket Roundup at Checkout
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Automatically include an optional ₹1/ticket micro-contribution when booking tickets
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.autoRoundupCharity}
            onChange={(e) => {
              updatePreferences({ autoRoundupCharity: e.target.checked });
              showToast(
                e.target.checked
                  ? 'BookAChange checkout roundup enabled'
                  : 'BookAChange checkout roundup disabled'
              );
            }}
            className="w-4 h-4 accent-[#85142f] shrink-0 cursor-pointer"
          />
        </section>

        {/* Featured Initiatives */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-neutral-900">Featured Initiatives</h3>
            <span className="text-[11px] text-neutral-500">BookKaro Foundation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOOKACHANGE_CAMPAIGNS.map((camp) => {
              const progress = Math.min(
                100,
                Math.round((camp.raisedAmount / camp.goalAmount) * 100)
              );
              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs flex flex-col"
                >
                  <div className="relative h-36 bg-neutral-900">
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                        {camp.title}
                      </h4>
                      <p className="text-[11px] text-[#85142f] font-semibold mt-0.5">
                        {camp.location}
                      </p>
                      <p className="text-xs text-neutral-600 mt-2 leading-relaxed line-clamp-3">
                        {camp.summary}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-neutral-700 mb-1">
                          <span>₹{(camp.raisedAmount / 100000).toFixed(1)}L raised</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#85142f] rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {camp.supportersCount.toLocaleString('en-IN')} supporters
                          </span>
                          <span className="font-semibold text-emerald-700">{camp.impactMetric}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCampaign(camp);
                          setAmount(50);
                        }}
                        className="w-full py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Contribute Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contribution History */}
        <section className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#85142f]" />
            <h3 className="text-sm font-bold text-neutral-900">Your Contributions</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {bacContributions.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-bold text-neutral-900">{item.campaignTitle}</p>
                  <p className="text-[11px] text-neutral-500">
                    {item.date} • {item.source} • Receipt{' '}
                    <span className="font-mono">{item.receiptId}</span>
                  </p>
                </div>
                <span className="font-extrabold text-emerald-700">₹{item.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <SimulatedBanner text="Simulated BookAChange impact tracker and micro-donations. No real funds are charged." />
      </div>

      {/* Simulated Contribution Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#85142f]">
                  BookAChange Contribution (Simulated)
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedCampaign.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-2">
                  Select Contribution Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {[10, 50, 100, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-lg border text-xs font-bold cursor-pointer ${
                        amount === val
                          ? 'bg-[#85142f] text-white border-[#85142f]'
                          : 'bg-white text-neutral-700 border-neutral-300'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  max={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-[#85142f]"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Instant simulated 80G tax-exemption receipt generated on completion.</span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDonating || amount <= 0}
                  className="px-5 py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isDonating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Contribute ₹{amount}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
