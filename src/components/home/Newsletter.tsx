'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage('Please enter a valid email address.');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await api.subscribeNewsletter(email);
      if (response.success) {
        setIsSuccess(true);
        setStatusMessage(response.message);
        setEmail('');
      } else {
        setIsSuccess(false);
        setStatusMessage('Subscription failed. Please try again.');
      }
    } catch {
      setIsSuccess(false);
      setStatusMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 border-t border-neutral-100 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">
              Be first in line.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal max-w-md leading-relaxed">
              Fresh drops, big announcements and the best plans in your city. Straight to your inbox.
            </p>
          </div>

          {/* Right Input Form */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors shadow-xs"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Status Feedback */}
            {statusMessage && (
              <div
                className={`mt-2 flex items-center gap-1.5 text-xs ${
                  isSuccess ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{statusMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-neutral-400 mt-3 font-normal">
              By subscribing, you agree to our{' '}
              <a href="#privacy" className="underline hover:text-neutral-600 transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
