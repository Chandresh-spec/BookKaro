'use client';

import React, { useState } from 'react';
import { X, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { User } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

type AuthView = 'methods' | 'email' | 'otp';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [view, setView] = useState<AuthView>('methods');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setView('methods');
    setMobile('');
    setEmail('');
    setOtp(['', '', '', '']);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  // Google Sign In
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.loginWithOAuth('google');
      if (res.success && res.user) {
        onSuccess(res.user);
        handleReset();
      }
    } catch {
      setError('Google Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Sign In
  const handleAppleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.loginWithOAuth('apple');
      if (res.success && res.user) {
        onSuccess(res.user);
        handleReset();
      }
    } catch {
      setError('Apple Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile number submit -> trigger OTP
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.sendOtp(`${countryCode} ${cleanMobile}`);
      if (res.success) {
        setView('otp');
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch {
      setError('Unable to send verification code. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.verifyOtp(`${countryCode} ${mobile}`, fullOtp);
      if (res.success && res.user) {
        onSuccess(res.user);
        handleReset();
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.loginWithEmail(email);
      if (res.success && res.user) {
        onSuccess(res.user);
        handleReset();
      }
    } catch {
      setError('Email authentication failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="relative flex items-center justify-center mb-6">
          {view !== 'methods' && (
            <button
              type="button"
              onClick={() => {
                setView('methods');
                setError(null);
              }}
              className="absolute left-0 p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <h3 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight text-center">
            {view === 'methods' && 'Get Started'}
            {view === 'email' && 'Continue with Email'}
            {view === 'otp' && 'Verify Mobile Number'}
          </h3>

          <button
            type="button"
            onClick={handleReset}
            className="absolute right-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* View 1: Main Methods (Exact match to uploaded image) */}
        {view === 'methods' && (
          <div className="space-y-3.5">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50/80 text-sm font-semibold text-neutral-800 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Sign In Button */}
            <button
              type="button"
              onClick={() => {
                setView('email');
                setError(null);
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50/80 text-sm font-semibold text-neutral-800 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>Continue with Email</span>
            </button>

            {/* Apple Sign In Button */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50/80 text-sm font-semibold text-neutral-800 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-neutral-950" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.88-11.88-14.42-6.55-10.14-11.66-21.43-15.34-33.87-3.68-12.44-5.52-24.13-5.52-35.08 0-14.15 3.49-25.76 10.47-34.82 6.98-9.06 15.75-13.68 26.31-13.87 4.9 0 10.37 1.3 16.4 3.9 6.03 2.61 10.02 3.96 11.98 4.07 1.52-.11 5.76-1.52 12.72-4.24 6.96-2.72 12.61-3.9 16.95-3.55 12.42.66 22.25 5.43 29.49 14.32-10.89 6.64-16.22 15.89-16 27.75.22 9.57 3.91 17.5 11.07 23.8 7.16 6.3 15.7 9.87 25.62 10.7-2.17 6.74-4.89 13.7-8.16 20.88zM119.22 31.84c0-7.29 2.58-14.07 7.74-20.34 5.16-6.27 11.64-10.38 19.44-12.33.22 1.3.33 2.39.33 3.26 0 7.29-2.67 14.24-8.01 20.85-5.34 6.61-11.83 10.45-19.5 11.52v-2.96z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Divider */}
            <div className="py-2 flex items-center justify-center">
              <span className="text-xs font-semibold text-neutral-400 tracking-wider">
                OR
              </span>
            </div>

            {/* Mobile Number Input Form */}
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-300 focus-within:border-neutral-900 transition-colors">
                {/* Country Flag & Code */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800 shrink-0">
                  <span className="text-base">🇮🇳</span>
                  <span>{countryCode}</span>
                  <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {/* Input field */}
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Continue with mobile number"
                  className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none py-1"
                />

                {mobile.length === 10 && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="p-1.5 bg-[#85142f] text-white rounded-lg hover:bg-[#701027] transition-colors shrink-0 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* View 2: Email Authentication */}
        {view === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#85142f] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#85142f] hover:bg-[#701027] disabled:bg-neutral-400 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>
        )}

        {/* View 3: Mobile OTP Verification */}
        {view === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-5 text-center">
            <p className="text-xs text-neutral-500 font-normal">
              Enter the 4-digit code sent to <strong className="text-neutral-900">{countryCode} {mobile}</strong>
            </p>

            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 text-xl font-bold text-center rounded-xl border border-neutral-300 focus:border-[#85142f] focus:outline-none transition-colors"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#85142f] hover:bg-[#701027] disabled:bg-neutral-400 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtp(['', '', '', '']);
                api.sendOtp(`${countryCode} ${mobile}`);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Footer Terms & Conditions (Exact match to uploaded image) */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-[11px] text-neutral-400 leading-relaxed font-normal">
            By continuing, you agree to our <br />
            <a href="#terms" className="underline hover:text-neutral-700 transition-colors">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#privacy" className="underline hover:text-neutral-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};
