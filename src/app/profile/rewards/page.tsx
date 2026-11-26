'use client';

import React, { useState, useMemo } from 'react';
import {
  Gift,
  Sparkles,
  Copy,
  Check,
  Coins,
  History,
  Tag,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { RewardOffer } from '@/types/account';

type RewardsTab = 'all' | 'scratch' | 'vouchers' | 'history';

export default function RewardsPage() {
  const {
    karoCoins,
    scratchCards,
    rewardOffers,
    rewardHistory,
    scratchCard,
    claimReward,
  } = useAccount();

  const [activeTab, setActiveTab] = useState<RewardsTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | RewardOffer['category']>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Copied code ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaim = (offer: RewardOffer) => {
    const res = claimReward(offer.id);
    if (res.success && typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(offer.code);
    }
    showToast(res.message);
  };

  const filteredOffers = useMemo(() => {
    if (categoryFilter === 'All') return rewardOffers;
    return rewardOffers.filter((r) => r.category === categoryFilter);
  }, [rewardOffers, categoryFilter]);

  return (
    <AccountShell activeSection="rewards" pageTitle="Rewards">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Loyalty Hero Banner */}
        <div className="bg-gradient-to-r from-[#2c0913] via-[#6e1026] to-[#85142f] text-white rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>BookKaro Superstar</span>
            </div>
            <h2 className="text-xl font-extrabold">Your Rewards &amp; KaroCoins</h2>
            <p className="text-xs text-rose-100/90 max-w-md">
              Earn KaroCoins on every movie, concert, and sports booking. Scratch cards &amp; unlock partner vouchers below.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-rose-200 block font-bold">
                Available Balance
              </span>
              <span className="text-xl font-black">{karoCoins} KaroCoins</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200/80 px-5 flex items-center gap-5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Rewards' },
              { id: 'scratch', label: 'Scratch Cards' },
              { id: 'vouchers', label: 'Redeem Vouchers' },
              { id: 'history', label: 'Coins History' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-[#85142f] text-[#85142f]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scratch Cards Section */}
        {(activeTab === 'all' || activeTab === 'scratch') && (
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Your Scratch Cards</h3>
              <span className="text-[11px] text-neutral-500">Tap an unopened card to reveal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {scratchCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    if (!card.isScratched) {
                      scratchCard(card.id);
                      showToast(`Revealed ${card.code} + 50 Bonus KaroCoins!`);
                    }
                  }}
                  className={`rounded-xl border p-4 min-h-[146px] flex flex-col justify-between transition-all ${
                    card.isScratched
                      ? 'bg-neutral-50 border-neutral-200'
                      : 'bg-gradient-to-br from-[#85142f] to-[#4b0819] text-white border-[#85142f] cursor-pointer hover:scale-[1.01] shadow-sm'
                  }`}
                >
                  {card.isScratched ? (
                    <>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#85142f] block">
                          Unlocked Reward
                        </span>
                        <p className="text-xs font-bold text-neutral-900 mt-1">
                          {card.rewardText}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between gap-2">
                        <span className="px-2 py-1 rounded bg-white border border-dashed border-neutral-300 font-mono text-[11px] font-bold text-neutral-800">
                          {card.code}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(card.code);
                          }}
                          className="text-xs font-bold text-[#85142f] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === card.code ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedCode === card.code ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Gift className="w-6 h-6 text-amber-300" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15">
                          +50 Coins
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold">{card.title}</p>
                        <p className="text-[11px] text-rose-100 mt-0.5">{card.subtitle}</p>
                        <span className="inline-block mt-2 text-[11px] font-bold underline text-amber-200">
                          Tap to Scratch &amp; Reveal →
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Redeemable Vouchers */}
        {(activeTab === 'all' || activeTab === 'vouchers') && (
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-neutral-900">Available Rewards &amp; Vouchers</h3>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Movies', 'F&B', 'Events', 'Partner'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#85142f] text-white border-[#85142f]'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative rounded-xl border border-neutral-200/90 bg-white flex flex-col justify-between overflow-hidden shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#85142f] bg-rose-50 px-2 py-0.5 rounded">
                        {offer.brand}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-700 inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#85142f]" />
                        {offer.coinsCost} Coins
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-2">{offer.title}</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {offer.description}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      Expires {offer.expiry} • {offer.terms}
                    </p>
                  </div>

                  {/* Coupon Perforated Tear Line */}
                  <div className="relative flex items-center px-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#f2f3f5] border border-neutral-200 -ml-5 shrink-0" />
                    <div className="flex-1 border-t border-dashed border-neutral-200" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#f2f3f5] border border-neutral-200 -mr-5 shrink-0" />
                  </div>

                  <div className="px-4 py-3 bg-neutral-50/60 flex items-center justify-between gap-2">
                    {offer.claimed ? (
                      <>
                        <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 font-mono text-xs font-bold text-emerald-800">
                          {offer.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(offer.code)}
                          className="text-xs font-bold text-[#85142f] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-neutral-500">
                          {karoCoins >= offer.coinsCost
                            ? 'Ready to unlock'
                            : `Need ${offer.coinsCost - karoCoins} more coins`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleClaim(offer)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            karoCoins >= offer.coinsCost
                              ? 'bg-[#85142f] hover:bg-[#6e1026] text-white'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          Unlock Voucher
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coins History */}
        {(activeTab === 'all' || activeTab === 'history') && (
          <section className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
              <History className="w-4 h-4 text-[#85142f]" />
              <h3 className="text-sm font-bold text-neutral-900">KaroCoins History</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {rewardHistory.map((item) => (
                <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-[11px] text-neutral-500">{item.date}</p>
                  </div>
                  <span
                    className={`text-xs font-extrabold ${
                      item.type === 'earned' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {item.coins > 0 ? `+${item.coins}` : item.coins} Coins
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <SimulatedBanner text="Rewards, scratch cards, and KaroCoins balances are simulated in local browser state." />
      </div>
    </AccountShell>
  );
}
