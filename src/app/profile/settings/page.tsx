'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Plus,
  Trash2,
  Check,
  Smartphone,
  LogOut,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { CITIES } from '@/data/mockData';

type SettingsTab = 'location' | 'payments' | 'permissions' | 'account';

export default function AccountsSettingsPage() {
  const {
    profile,
    paymentMethods,
    preferences,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePreferences,
    signOut,
    resetDemoState,
  } = useAccount();

  const [activeTab, setActiveTab] = useState<SettingsTab>('location');
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [methodType, setMethodType] = useState<'upi' | 'card'>('upi');
  const [methodLabel, setMethodLabel] = useState('');
  const [methodDetail, setMethodDetail] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodDetail.trim()) return;
    addPaymentMethod({
      type: methodType,
      label:
        methodLabel.trim() ||
        (methodType === 'upi' ? 'Saved UPI ID' : 'Saved Credit / Debit Card'),
      detail:
        methodType === 'card'
          ? `•••• •••• •••• ${methodDetail.replace(/\D/g, '').slice(-4) || '1234'}`
          : methodDetail.trim(),
      subDetail:
        methodType === 'upi'
          ? 'Simulated UPI QuickPay'
          : 'Simulated tokenized card',
      isDefault: false,
    });
    setMethodLabel('');
    setMethodDetail('');
    setIsAddMethodOpen(false);
    showToast('Payment method added (simulated)');
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'payments', label: 'Saved Payments', icon: CreditCard },
    { id: 'permissions', label: 'Permissions', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <AccountShell activeSection="settings" pageTitle="Accounts & Settings">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Header + Sub-tabs */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900">Accounts &amp; Settings</h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Manage your preferred city, QuickPay payment methods, alerts, and privacy controls
            </p>
          </div>

          <div className="px-5 flex items-center gap-5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
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
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. LOCATION PREFERENCES */}
        {activeTab === 'location' && (
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Preferred City</h3>
                <p className="text-[11px] text-neutral-500">
                  Shows theatres, concerts, and sports near you
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold">
                {profile?.city || 'Bengaluru'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CITIES.map((city) => {
                const selected =
                  (profile?.city || 'Bengaluru').toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      void updateProfile({ city: city.name });
                      showToast(`Default city updated to ${city.name}`);
                    }}
                    className={`px-3.5 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#85142f] bg-rose-50/70 text-[#85142f]'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{city.name}</span>
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center justify-between pt-3 border-t border-neutral-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-neutral-900">Auto-detect city on launch</p>
                <p className="text-[11px] text-neutral-500">
                  Allow BookKaro to use approximate location when browsing
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.locationAutoDetect}
                onChange={(e) => {
                  updatePreferences({ locationAutoDetect: e.target.checked });
                  showToast('Location detection preference saved');
                }}
                className="w-4 h-4 accent-[#85142f]"
              />
            </label>
          </section>
        )}

        {/* 2. SAVED PAYMENT METHODS */}
        {activeTab === 'payments' && (
          <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Saved Payment Modes (QuickPay)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Simulated saved UPI IDs, cards, and BookKaro Cash wallet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMethodOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>

            {isAddMethodOpen && (
              <form
                onSubmit={handleAddPayment}
                className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-3"
              >
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMethodType('upi')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold border cursor-pointer ${
                      methodType === 'upi'
                        ? 'bg-[#85142f] text-white border-[#85142f]'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    UPI ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethodType('card')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold border cursor-pointer ${
                      methodType === 'card'
                        ? 'bg-[#85142f] text-white border-[#85142f]'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={methodLabel}
                    onChange={(e) => setMethodLabel(e.target.value)}
                    placeholder={
                      methodType === 'upi' ? 'Label (e.g. PhonePe UPI)' : 'Card Nickname (e.g. ICICI Coral)'
                    }
                    className="px-3 py-2 rounded-lg border border-neutral-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={methodDetail}
                    onChange={(e) => setMethodDetail(e.target.value)}
                    placeholder={
                      methodType === 'upi' ? 'name@okhdfcbank' : 'Last 4 digits (e.g. 5678)'
                    }
                    className="px-3 py-2 rounded-lg border border-neutral-300 bg-white text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddMethodOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#85142f] text-white text-xs font-bold cursor-pointer"
                  >
                    Save Method
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-lg">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">{pm.label}</span>
                      {pm.isDefault && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-700 font-mono mt-0.5">{pm.detail}</p>
                    <p className="text-[11px] text-neutral-500">{pm.subDetail}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {!pm.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultPaymentMethod(pm.id);
                          showToast(`${pm.label} set as default`);
                        }}
                        className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        removePaymentMethod(pm.id);
                        showToast(`${pm.label} removed`);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                      aria-label="Remove payment method"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className="flex items-center justify-between pt-2 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-neutral-900">1-Tap QuickPay Checkout</p>
                <p className="text-[11px] text-neutral-500">
                  Pre-select your default payment method during ticket checkout
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.saveQuickPay}
                onChange={(e) => {
                  updatePreferences({ saveQuickPay: e.target.checked });
                  showToast('QuickPay preference updated');
                }}
                className="w-4 h-4 accent-[#85142f]"
              />
            </label>
          </section>
        )}

        {/* 3. COMMUNICATION & PERMISSIONS */}
        {activeTab === 'permissions' && (
          <section className="bg-white rounded-xl border border-neutral-200/80 divide-y divide-neutral-100">
            <div className="p-5">
              <h3 className="text-sm font-bold text-neutral-900">
                Communication &amp; Notification Permissions
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Choose how BookKaro contacts you with tickets, reminders, and offers
              </p>
            </div>

            {(
              [
                {
                  key: 'whatsappTickets',
                  title: 'WhatsApp M-Ticket Delivery',
                  desc: 'Receive QR passes, seat numbers, and entry gate updates on WhatsApp',
                },
                {
                  key: 'smsAlerts',
                  title: 'SMS Confirmations & Alerts',
                  desc: 'Backup SMS booking confirmations and showtime reminders',
                },
                {
                  key: 'emailOffers',
                  title: 'Email Premieres & Offers',
                  desc: 'Weekly curated movie drops, early-bird concert access, and partner deals',
                },
                {
                  key: 'pushReminders',
                  title: 'Showtime Push Reminders',
                  desc: 'Get reminded 2 hours before your movie or live event starts',
                },
                {
                  key: 'personalizedPicks',
                  title: 'Personalized Recommendations',
                  desc: 'Tailor home feed suggestions based on your booking history and wishlist',
                },
              ] as const
            ).map((item) => (
              <label
                key={item.key}
                className="p-4 sm:px-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/70"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900">{item.title}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={(e) => {
                    updatePreferences({ [item.key]: e.target.checked });
                    showToast(`${item.title} ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                  className="w-4 h-4 accent-[#85142f] shrink-0 cursor-pointer"
                />
              </label>
            ))}
          </section>
        )}

        {/* 4. ACCOUNT MANAGEMENT & DEVICES */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-bold text-neutral-900">Logged-in Devices</h3>
                <span className="text-[11px] text-emerald-700 font-bold">2 Active Sessions</span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#85142f]" />
                    <div>
                      <p className="font-bold text-neutral-900">Web Browser — Windows (Current)</p>
                      <p className="text-[11px] text-neutral-500">Bengaluru • Active now</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    This Device
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="font-bold text-neutral-900">BookKaro Mobile Web</p>
                      <p className="text-[11px] text-neutral-500">Bengaluru • Last seen 2 days ago</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Session logged out (simulated)')}
                    className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Account Actions</h3>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/profile/edit"
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                >
                  Edit Personal Info
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoState();
                    showToast('Demo account data reset to defaults');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    showToast('Signed out of BookKaro');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#85142f] text-xs font-bold text-[#85142f] hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        )}

        <SimulatedBanner text="Settings, saved payment modes, and permissions are simulated and persisted in localStorage." />
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Delete Account (Simulated)?</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  This will sign you out and reset your local demo profile state. No real server data exists.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoState();
                  signOut();
                  setIsDeleteConfirmOpen(false);
                  showToast('Account cleared (simulated)');
                }}
                className="px-4 py-2 rounded-lg bg-[#85142f] text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
