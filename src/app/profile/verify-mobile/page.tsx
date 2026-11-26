'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { api } from '@/services/api';

export default function VerifyMobilePage() {
  const { profile, isHydrated, verifyMobile, updateProfile } = useAccount();

  const initialDigits = (profile?.mobile || '').replace(/\D/g, '').slice(-10);
  const [phoneDigits, setPhoneDigits] = useState(initialDigits);
  const [step, setStep] = useState<'input' | 'otp' | 'verified'>(
    profile?.isMobileVerified ? 'verified' : 'input'
  );
  const [otp, setOtp] = useState(['', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated || !profile) return;
    const digits = (profile.mobile || '').replace(/\D/g, '').slice(-10);
    if (digits) setPhoneDigits(digits);
    setStep((curr) => (curr === 'otp' ? curr : profile.isMobileVerified ? 'verified' : 'input'));
  }, [isHydrated, profile]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const formattedMobile = `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`.trim();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneDigits.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await api.sendOtp(formattedMobile);
      setStep('otp');
      setCooldown(30);
      setOtp(['', '', '', '']);
      showToast(`Simulated OTP sent to ${formattedMobile}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = cleaned;
    setOtp(next);
    if (cleaned && idx < 3) {
      document.getElementById(`verify-otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      setError('Enter the 4-digit verification code (e.g. 1234).');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const ok = await verifyMobile(formattedMobile, code);
      if (ok) {
        setStep('verified');
        showToast('Mobile number verified for WhatsApp & SMS tickets!');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccountShell activeSection="verify-mobile" pageTitle="Mobile Verification">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Hero Banner Card matching BookMyShow's amber "Get tickets on Whatsapp/SMS!" prompt */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="bg-[#fff8e6] border-b border-amber-200/80 p-5 sm:p-6 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-400/25 text-amber-900 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Get tickets on Whatsapp/SMS!
                </h2>
                {profile?.isMobileVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-950 text-[10px] font-bold">
                    Verification Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Receive instant M-Ticket QR passes, entry gate numbers, and real-time show updates directly on WhatsApp and SMS.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            {step === 'input' && (
              <form onSubmit={handleSendOtp} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:border-[#85142f] bg-white">
                    <div className="px-3 py-2.5 bg-neutral-50 border-r border-neutral-200 text-xs font-bold text-neutral-700 flex items-center gap-1.5 shrink-0">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneDigits}
                      onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3 py-2.5 text-sm text-neutral-900 focus:outline-none"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1.5">
                    We will send a 4-digit OTP to confirm this mobile number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneDigits.length < 10}
                  className="px-5 py-2.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] disabled:bg-neutral-300 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Smartphone className="w-3.5 h-3.5" />
                  )}
                  <span>Send Verification OTP</span>
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md">
                <div>
                  <p className="text-xs text-neutral-600">
                    Enter the 4-digit OTP sent to{' '}
                    <strong className="text-neutral-900">{formattedMobile}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="text-[#85142f] font-semibold hover:underline ml-1 cursor-pointer"
                    >
                      Change
                    </button>
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    Simulated Demo: Enter any 4 digits (e.g. <span className="font-mono font-bold">1234</span>)
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {otp.map((d, idx) => (
                    <input
                      key={idx}
                      id={`verify-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      autoFocus={idx === 0}
                      className="w-11 h-12 text-center text-lg font-bold border border-neutral-300 rounded-lg focus:outline-none focus:border-[#85142f]"
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Verify &amp; Link Number</span>
                  </button>

                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={() => {
                      setCooldown(30);
                      showToast('Simulated OTP resent!');
                    }}
                    className="text-xs font-semibold text-neutral-600 hover:text-[#85142f] disabled:text-neutral-400 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'verified' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {profile?.mobile || formattedMobile}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium">
                        Linked for WhatsApp &amp; SMS ticket confirmations
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-xs font-bold text-[#85142f] hover:underline self-start sm:self-center cursor-pointer"
                  >
                    Update Number
                  </button>
                </div>

                {/* Delivery Channel Preferences */}
                <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                  <label className="flex items-center justify-between p-3.5 cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">WhatsApp Ticket Delivery</p>
                      <p className="text-[11px] text-neutral-500">
                        Instant QR M-Tickets, seat details &amp; gate alerts on WhatsApp
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile?.whatsappOptIn ?? true}
                      onChange={(e) => {
                        void updateProfile({ whatsappOptIn: e.target.checked });
                        showToast(
                          e.target.checked
                            ? 'WhatsApp ticket alerts enabled'
                            : 'WhatsApp ticket alerts paused'
                        );
                      }}
                      className="w-4 h-4 accent-[#85142f] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">SMS Booking Confirmations</p>
                      <p className="text-[11px] text-neutral-500">
                        Backup SMS booking ID and show reminders
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile?.smsOptIn ?? true}
                      onChange={(e) => {
                        void updateProfile({ smsOptIn: e.target.checked });
                        showToast(
                          e.target.checked ? 'SMS alerts enabled' : 'SMS alerts paused'
                        );
                      }}
                      className="w-4 h-4 accent-[#85142f] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/profile/orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View My Tickets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <SimulatedBanner text="OTP verification is simulated locally for demonstration (POST /api/v1/auth/otp/send & /verify ready for FastAPI)." />
      </div>
    </AccountShell>
  );
}
