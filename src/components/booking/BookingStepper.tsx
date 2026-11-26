'use client';

import React from 'react';
import { Check, Ticket, Truck, CreditCard } from 'lucide-react';

export type BookingStep = 'tickets' | 'delivery' | 'payment';

interface BookingStepperProps {
  currentStep: BookingStep;
  onStepClick?: (step: BookingStep) => void;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps: { id: BookingStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'tickets', label: 'Select Tickets', icon: Ticket },
    { id: 'delivery', label: 'Ticket Delivery', icon: Truck },
    { id: 'payment', label: 'Review & Pay', icon: CreditCard },
  ];

  const getStepIndex = (s: BookingStep) => steps.findIndex((step) => step.id === s);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full bg-white border-b border-neutral-200/80 px-4 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div
                className={`flex items-center gap-2 sm:gap-3 ${
                  isCompleted && onStepClick ? 'cursor-pointer group' : ''
                }`}
                onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#85142f] text-white shadow-md shadow-[#85142f]/30 ring-4 ring-rose-100'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5px]" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="hidden sm:block">
                  <span
                    className={`block text-[11px] uppercase font-bold tracking-wider ${
                      isCurrent
                        ? 'text-[#85142f]'
                        : isCompleted
                        ? 'text-neutral-900'
                        : 'text-neutral-400'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                  <span
                    className={`block text-xs font-extrabold ${
                      isCurrent || isCompleted ? 'text-neutral-950' : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Connecting Bar */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 mx-2 sm:mx-4 h-0.5 rounded-full transition-colors ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
