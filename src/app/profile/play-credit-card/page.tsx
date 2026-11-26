'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Gift,
  Ticket,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  Sparkles,
  Loader2,
  Wifi,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';

export default function PlayCreditCardPage() {
  const { profile, playCardApplication, submitPlayCardApplication, resetPlayCardApplication } =
    useAccount();

  const [monthlySpend, setMonthlySpend] = useState(12000);
  const [fullName, setFullName] = useState(profile?.name || 'Chandresh Moger');
  const [pan, setPan] = useState('');
  const [employmentType, setEmploymentType] = useState('Salaried');
  const [incomeRange, setIncomeRange] = useState('₹6L – ₹12L / year');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const qualifiesMonthlyBenefit = monthlySpend >= 5000;
  const estimatedAnnualSavings =
    (qualifiesMonthlyBenefit ? 500 * 12 : 0) + 500 + (qualifiesMonthlyBenefit ? 100 * 12 : 600);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setIsSubmitting(true);
    await submitPlayCardApplication({
      fullName: fullName.trim(),
      pan: pan.trim().toUpperCase() || 'ABCDE1234F',
      incomeRange,
      employmentType,
    });
    setIsSubmitting(false);
    showToast('Illustrative Play Credit Card application submitted!');
  };

  const benefits = [
    {
      icon: Gift,
      title: '₹500 Welcome Voucher',
      desc: 'Unlock a ₹500 instant BookKaro voucher after your first transaction within 30 days of card issuance.',
    },
    {
      icon: Ticket,
      title: '2 Free Tickets Every Month',
      desc: 'Spend ₹5,000+ in a billing cycle to get up to ₹500 off (₹250 × 2) on movies, concerts, sports, or Stream.',
    },
    {
      icon: Utensils,
      title: 'Up to ₹100 Off on F&B',
      desc: 'Save on popcorn, beverages, and cinema combos when you book 2+ movie tickets using your Play Card.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Annual Fee Waiver',
      desc: '₹500 annual fee waived when you spend ₹1.5 Lakhs in an anniversary year or hold Superstar status.',
    },
  ];

  return (
    <AccountShell activeSection="play-credit-card" pageTitle="Play Credit Card">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Hero Card Showcase (BookMyShow Play Credit Card pattern in BookKaro burgundy) */}
        <div className="bg-gradient-to-br from-[#1f0710] via-[#5d0e22] to-[#85142f] text-white rounded-xl p-5 sm:p-7 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_280px] gap-6 items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>BookKaro × Partner Bank</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                The Play Credit Card — built for cinema &amp; live event lovers
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                Turn everyday spends into free movie nights, concert perks, and instant F&amp;B savings across BookKaro.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                  ₹500 Welcome Gift
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                  ₹6,000+ Annual Movie Value
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                  100% Digital KYC
                </span>
              </div>
            </div>

            {/* Metallic Card Mockup */}
            <div className="mx-auto w-full max-w-[280px] aspect-[1.58/1] rounded-xl bg-gradient-to-tr from-[#0d0d12] via-[#2b0d17] to-[#9b1b3a] border border-white/20 p-4 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold tracking-tight">bookKaro</span>
                  <span className="block text-[9px] uppercase tracking-widest text-rose-200">
                    PLAY CREDIT
                  </span>
                </div>
                <Wifi className="w-4 h-4 rotate-90 text-white/75" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 to-amber-500 opacity-90" />
                <span className="text-[11px] font-mono tracking-widest text-white/80">
                  4532 •••• •••• 9014
                </span>
              </div>

              <div className="flex items-end justify-between text-[10px]">
                <div>
                  <span className="text-white/60 block text-[8px] uppercase">Cardholder</span>
                  <span className="font-bold tracking-wider uppercase">
                    {profile?.name || 'CHANDRESH MOGER'}
                  </span>
                </div>
                <span className="font-black italic text-sm text-white/90">VISA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Card Benefits */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">Card Benefits &amp; Offers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="p-3.5 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#85142f] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{b.title}</h4>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Savings Estimator */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#85142f]" />
              <h3 className="text-sm font-bold text-neutral-900">
                Monthly Spend &amp; Savings Calculator
              </h3>
            </div>
            <span className="text-xs font-extrabold text-[#85142f]">
              Est. ₹{estimatedAnnualSavings.toLocaleString('en-IN')}/yr value
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Estimated Monthly Card Spend</span>
              <strong className="text-neutral-900">
                ₹{monthlySpend.toLocaleString('en-IN')}
              </strong>
            </div>
            <input
              type="range"
              min={2000}
              max={30000}
              step={1000}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="w-full accent-[#85142f] cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              {qualifiesMonthlyBenefit
                ? 'Qualifies for ₹500/month free movie or event tickets (2 × ₹250) + F&B discounts!'
                : 'Spend ₹5,000+ monthly to unlock the 2 free monthly tickets milestone.'}
            </p>
          </div>
        </section>

        {/* Illustrative Application Flow / Status */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#85142f]" />
              <h3 className="text-sm font-bold text-neutral-900">
                {playCardApplication.status === 'submitted'
                  ? 'Application Status'
                  : 'Apply for Play Credit Card (Illustrative)'}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[10px] font-bold">
              Demo Flow
            </span>
          </div>

          {playCardApplication.status === 'submitted' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Illustrative Application Received
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Reference ID:{' '}
                    <span className="font-mono font-bold text-neutral-900">
                      {playCardApplication.applicationId}
                    </span>{' '}
                    • Applicant: {playCardApplication.fullName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <span className="font-bold text-emerald-700 block">1. Details Submitted</span>
                  <span className="text-[11px] text-neutral-500">Completed {playCardApplication.submittedAt}</span>
                </div>
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                  <span className="font-bold text-amber-800 block">2. Video KYC (Pending)</span>
                  <span className="text-[11px] text-neutral-500">Simulated verification step</span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                  <span className="font-bold text-neutral-600 block">3. Virtual Card Ready</span>
                  <span className="text-[11px] text-neutral-500">Unlocks ₹500 welcome offer</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetPlayCardApplication();
                  showToast('Demo application cleared');
                }}
                className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
              >
                Reset Illustrative Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">
                    Full Name (as per PAN)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-[#85142f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">
                    PAN Number (Demo Placeholder)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm uppercase font-mono focus:outline-none focus:border-[#85142f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#85142f]"
                  >
                    <option>Salaried</option>
                    <option>Self-Employed / Freelancer</option>
                    <option>Business Owner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">
                    Annual Income Range
                  </label>
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#85142f]"
                  >
                    <option>₹3L – ₹6L / year</option>
                    <option>₹6L – ₹12L / year</option>
                    <option>₹12L+ / year</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#85142f]"
                  required
                />
                <span>
                  I understand this is a simulated UI demonstration and no real bank inquiry or credit check is performed.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !consent}
                className="px-5 py-2.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] disabled:bg-neutral-300 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Check Eligibility &amp; Apply</span>
              </button>
            </form>
          )}

          <SimulatedBanner text="Illustrative Play Credit Card hub. Card numbers, offers, and application steps are simulated." />
        </section>

        {/* How It Works & Fees Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">How to Get Your Play Card</h3>
            <ol className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#85142f] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-neutral-900">Submit Digital Details</p>
                  <p className="text-[11px] text-neutral-500">
                    Share basic PAN &amp; employment details in under 2 minutes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#85142f] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-neutral-900">Instant Video KYC</p>
                  <p className="text-[11px] text-neutral-500">
                    Paperless verification with instant virtual card activation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#85142f] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-bold text-neutral-900">Unlock ₹500 Welcome Benefit</p>
                  <p className="text-[11px] text-neutral-500">
                    Redeem on movies, live concerts, sports, or BookKaro Stream.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Fees &amp; Eligibility (Illustrative)</h3>
            <div className="divide-y divide-neutral-100 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Annual Fee</span>
                <span className="font-bold text-neutral-900">₹500 + GST (Waived on ₹1.5L/yr)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Superstar Members</span>
                <span className="font-bold text-emerald-700">Zero Joining Fee</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Eligibility Age</span>
                <span className="font-bold text-neutral-900">21 – 60 Years (Resident Indian)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Monthly Ticket Milestone</span>
                <span className="font-bold text-neutral-900">₹5,000 Retail Spend / cycle</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AccountShell>
  );
}
