'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Check,
  AlertCircle,
  Shirt,
  Calendar,
  Heart,
  ChevronRight,
  User,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { ParticipationCategory, ParticipantInfo } from '@/types/sports';

interface ParticipationRegistrationProps {
  categories: ParticipationCategory[];
  currency?: string;
  onSelectionChange: (
    category: ParticipationCategory,
    quantity: number,
    participants: ParticipantInfo[]
  ) => void;
  selectedCategory?: ParticipationCategory | null;
  selectedQuantity?: number;
  initialParticipants?: ParticipantInfo[];
}

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const ParticipationRegistration: React.FC<ParticipationRegistrationProps> = ({
  categories,
  currency = '₹',
  onSelectionChange,
  selectedCategory: initialCategory,
  selectedQuantity: initialQuantity = 1,
  initialParticipants = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ParticipationCategory | null>(
    initialCategory || (categories.length > 0 ? categories[0] : null)
  );
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const createDefaultParticipant = (index: number): ParticipantInfo => ({
    id: `participant-${Date.now()}-${index}`,
    fullName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    tshirtSize: 'M',
    bloodGroup: 'O+',
    medicalDeclarationAccepted: false,
  });

  const [participants, setParticipants] = useState<ParticipantInfo[]>(() => {
    if (initialParticipants.length > 0) return initialParticipants;
    return [createDefaultParticipant(0)];
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCategorySelect = (cat: ParticipationCategory) => {
    setSelectedCategory(cat);
    onSelectionChange(cat, quantity, participants);
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > 6) return;
    setQuantity(newQty);

    let updatedParticipants = [...participants];
    if (newQty > participants.length) {
      for (let i = participants.length; i < newQty; i++) {
        updatedParticipants.push(createDefaultParticipant(i));
      }
    } else {
      updatedParticipants = updatedParticipants.slice(0, newQty);
    }
    setParticipants(updatedParticipants);
    if (selectedCategory) {
      onSelectionChange(selectedCategory, newQty, updatedParticipants);
    }
  };

  const updateParticipant = (
    index: number,
    field: keyof ParticipantInfo,
    value: any
  ) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
    if (selectedCategory) {
      onSelectionChange(selectedCategory, quantity, updated);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center text-neutral-500">
        <Trophy className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
        <p className="font-bold text-sm">No participation categories available for this event.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. SELECT PARTICIPATION CATEGORY */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#85142f]" />
              <span>Step 1: Choose Race Category</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select your preferred race distance or tournament division
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory?.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#85142f] bg-rose-50/20 shadow-xs'
                    : 'border-neutral-200/80 hover:border-neutral-300 bg-white'
                }`}
              >
                {/* Distance Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#85142f]/10 text-[#85142f]">
                    {cat.distance || 'Race Category'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-[#85142f] bg-[#85142f] text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-neutral-900 text-sm mb-1 leading-snug">
                    {cat.name}
                  </h4>
                  {cat.description && (
                    <p className="text-[11px] text-neutral-500 line-clamp-2 mb-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Badges: T-shirt & Age Limit */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100 text-[10px] text-neutral-600 font-semibold mb-3">
                  {cat.includesTShirt && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      <Shirt className="w-3 h-3" />
                      <span>T-Shirt Included</span>
                    </span>
                  )}
                  {cat.minAge && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      <Users className="w-3 h-3" />
                      <span>{cat.minAge}+ Years</span>
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Entry Fee</span>
                  <span className="text-base font-black text-neutral-950">
                    {currency} {cat.fee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity Selector */}
        {selectedCategory && (
          <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-bold text-neutral-800">
                Number of Participants / Runners
              </span>
              <span className="text-[11px] text-neutral-400">
                You can register up to 6 participants in a single order
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg border border-neutral-300 font-bold text-neutral-700 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                -
              </button>
              <span className="font-black text-base w-6 text-center text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 6}
                className="w-9 h-9 rounded-lg border border-neutral-300 font-bold text-neutral-700 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                +
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. PARTICIPANT DETAILS FORMS */}
      {selectedCategory && (
        <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#85142f]" />
              <span>Step 2: Participant Information</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Required by race organizers for BIB allocation, RFID chip timing, and emergency safety
            </p>
          </div>

          <div className="space-y-6">
            {participants.map((participant, index) => (
              <div
                key={participant.id || index}
                className="p-4 sm:p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#85142f] text-white text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-extrabold text-sm text-neutral-900">
                      Participant {index + 1} Details
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-neutral-500">
                    Category: {selectedCategory.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Full Name (As on Govt ID) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={participant.fullName}
                        onChange={(e) => updateParticipant(index, 'fullName', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      min={selectedCategory.minAge || 5}
                      max={99}
                      value={participant.age}
                      onChange={(e) => updateParticipant(index, 'age', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={participant.gender}
                      onChange={(e) => updateParticipant(index, 'gender', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={participant.email}
                        onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={participant.phone}
                        onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Emergency Contact Number *
                    </label>
                    <div className="relative">
                      <ShieldAlert className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 9123456789"
                        value={participant.emergencyContactPhone}
                        onChange={(e) => updateParticipant(index, 'emergencyContactPhone', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* T-Shirt Size */}
                  {selectedCategory.includesTShirt && (
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex items-center gap-1">
                        <Shirt className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Event Jersey Size *</span>
                      </label>
                      <select
                        value={participant.tshirtSize || 'M'}
                        onChange={(e) => updateParticipant(index, 'tshirtSize', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium cursor-pointer"
                      >
                        {TSHIRT_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size} (Unisex)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Blood Group */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Blood Group</span>
                    </label>
                    <select
                      value={participant.bloodGroup || 'O+'}
                      onChange={(e) => updateParticipant(index, 'bloodGroup', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden bg-white text-neutral-900 font-medium cursor-pointer"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Medical Declaration Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={participant.medicalDeclarationAccepted || false}
                      onChange={(e) =>
                        updateParticipant(index, 'medicalDeclarationAccepted', e.target.checked)
                      }
                      className="mt-0.5 rounded border-neutral-300 text-[#85142f] focus:ring-[#85142f]"
                    />
                    <span className="text-[11px] text-neutral-600 leading-relaxed">
                      I confirm that Participant {index + 1} is medically fit to run in this event and agrees to abide by the official race rules, course marshals, and waiver of liability.
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
