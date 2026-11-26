'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Loader2,
  MapPin,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { CITIES } from '@/data/mockData';

export default function EditProfilePage() {
  const { profile, updateProfile } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [mobile, setMobile] = useState(profile?.mobile || '');
  const [birthday, setBirthday] = useState(profile?.birthday || '');
  const [gender, setGender] = useState<'Man' | 'Woman' | 'Other' | 'Prefer not to say'>(
    profile?.gender || 'Man'
  );
  const [married, setMarried] = useState<'Yes' | 'No' | 'Prefer not to say'>(
    profile?.married || 'No'
  );
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [addressLine1, setAddressLine1] = useState(profile?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(profile?.addressLine2 || '');
  const [landmark, setLandmark] = useState(profile?.landmark || '');
  const [city, setCity] = useState(profile?.city || 'Bengaluru');
  const [stateName, setStateName] = useState(profile?.state || 'Karnataka');
  const [avatar, setAvatar] = useState<string | undefined>(profile?.avatar);

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName || '');
    setLastName(profile.lastName || '');
    setEmail(profile.email || '');
    setMobile(profile.mobile || '');
    setBirthday(profile.birthday || '');
    setGender(profile.gender || 'Man');
    setMarried(profile.married || 'No');
    setPincode(profile.pincode || '');
    setAddressLine1(profile.addressLine1 || '');
    setAddressLine2(profile.addressLine2 || '');
    setLandmark(profile.landmark || '');
    setCity(profile.city || 'Bengaluru');
    setStateName(profile.state || 'Karnataka');
    setAvatar(profile.avatar);
  }, [profile]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Photo selected — click Save Changes to apply');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim() || 'Guest User',
      email: email.trim(),
      mobile: mobile.trim(),
      birthday,
      gender,
      married,
      pincode: pincode.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      landmark: landmark.trim(),
      city,
      state: stateName.trim(),
      avatar,
    });
    setIsSaving(false);
    setEditingEmail(false);
    setEditingMobile(false);
    showToast('Profile details saved successfully!');
  };

  return (
    <AccountShell activeSection="edit" pageTitle="Edit Profile">
      <ToastAlert message={toast} />

      <form onSubmit={handleSave} className="space-y-4">
        {/* Top Banner Header (BookMyShow-style gradient banner with clean overlapping avatar) */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="h-20 sm:h-24 bg-gradient-to-r from-[#2c0913] via-[#6b1027] to-[#85142f] px-5 sm:px-6 flex items-center justify-between">
            <div className="pl-24 sm:pl-28">
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                Hi, {firstName || 'Guest'}
              </h2>
              <p className="text-[11px] text-rose-100/90 font-medium">
                Manage your BookKaro profile &amp; delivery details
              </p>
            </div>
          </div>

          <div className="px-5 sm:px-6 pb-4 pt-3 flex flex-wrap items-center justify-between gap-3 bg-white relative">
            {/* Overlapping Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative -mt-12 sm:-mt-14 shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white p-1 shadow-md border border-neutral-200">
                  <div className="w-full h-full rounded-full bg-[#85142f] text-white flex items-center justify-center overflow-hidden text-2xl font-black">
                    {avatar ? (
                      <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover" />
                    ) : firstName ? (
                      firstName.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon className="w-8 h-8" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-[#85142f] shadow-sm flex items-center justify-center cursor-pointer"
                  aria-label="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/70">
                  <CheckCircle2 className="w-3 h-3" />
                  Email {profile?.isEmailVerified ? 'Verified' : 'Added'}
                </span>
                {profile?.isMobileVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/70">
                    <ShieldCheck className="w-3 h-3" />
                    Mobile Verified
                  </span>
                ) : (
                  <Link
                    href="/profile/verify-mobile"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Verify Mobile Number
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {avatar && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(undefined);
                    showToast('Photo removed — click Save Changes to apply');
                  }}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
              >
                {avatar ? 'Change Photo' : '+ Add Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">Account Details</h3>
            <span className="text-[11px] text-neutral-400 font-medium">Used for tickets &amp; alerts</span>
          </div>

          <div className="space-y-4">
            {/* Email Address */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div className="flex-1 min-w-0">
                <label className="text-xs font-semibold text-neutral-500 block mb-1">
                  Email Address
                </label>
                {editingEmail ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full max-w-sm px-3 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-neutral-900">
                      {email || 'Not added'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEditingEmail((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#85142f] hover:underline self-start sm:self-center cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>{editingEmail ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <label className="text-xs font-semibold text-neutral-500 block mb-1">
                  Mobile Number
                </label>
                {editingMobile ? (
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full max-w-sm px-3 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-neutral-900">
                      {mobile || 'Add your mobile number'}
                    </span>
                    {profile?.isMobileVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <Link
                        href="/profile/verify-mobile"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold hover:bg-amber-100"
                      >
                        Verify via OTP →
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setEditingMobile((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#85142f] hover:underline cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>{editingMobile ? 'Done' : 'Edit'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Details Card */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Birthday <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Identity <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Woman', 'Man', 'Other'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      gender === opt
                        ? 'bg-[#85142f] text-white border-[#85142f]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Married? <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <div className="flex gap-2">
                {(['Yes', 'No'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMarried(opt)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      married === opt
                        ? 'bg-[#85142f] text-white border-[#85142f]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Address Card (Optional — used for physical wristbands & ticket home delivery) */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#85142f]" />
              <h3 className="text-sm font-bold text-neutral-900">
                Address <span className="text-neutral-400 font-normal text-xs">(Optional)</span>
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400">For home ticket &amp; wristband delivery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Area Pincode
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 560001"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Town / City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 bg-white focus:outline-none focus:border-[#85142f]"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Address Line 1
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Flat no., House no., Building"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Address Line 2
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Area, Colony, Street"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Landmark / State
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Near metro or landmark"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-[#85142f]"
              />
            </div>
          </div>
        </section>

        <SimulatedBanner text="Profile changes are stored locally in your browser (ready to sync via PATCH /api/v1/account/profile when FastAPI is connected)." />

        {/* Sticky/Inline Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-[#85142f] hover:bg-[#6e1026] disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </AccountShell>
  );
}
