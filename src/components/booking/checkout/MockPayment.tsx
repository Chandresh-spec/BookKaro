'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface MockPaymentProps {
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export const MockPayment: React.FC<MockPaymentProps> = ({
  totalAmount,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment processing time
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">
            Simulated Sandbox Payment
          </span>
          <span>
            This is a frontend demonstration. No payment gateway is integrated and no real money will be deducted.
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-black text-neutral-950 mb-1">
          Select Simulated Payment Mode
        </h3>
        <p className="text-xs text-neutral-500">
          Choose a payment option to test the end-to-end booking confirmation flow.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            paymentMethod === 'upi'
              ? 'border-[#85142f] bg-rose-50/60 text-[#85142f] font-extrabold shadow-2xs'
              : 'border-neutral-200/80 bg-white text-neutral-600 font-semibold hover:border-neutral-300'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-xs">Instant UPI</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            paymentMethod === 'card'
              ? 'border-[#85142f] bg-rose-50/60 text-[#85142f] font-extrabold shadow-2xs'
              : 'border-neutral-200/80 bg-white text-neutral-600 font-semibold hover:border-neutral-300'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-xs">Credit/Debit</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('netbanking')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            paymentMethod === 'netbanking'
              ? 'border-[#85142f] bg-rose-50/60 text-[#85142f] font-extrabold shadow-2xs'
              : 'border-neutral-200/80 bg-white text-neutral-600 font-semibold hover:border-neutral-300'
          }`}
        >
          <Building className="w-5 h-5" />
          <span className="text-xs">NetBanking</span>
        </button>
      </div>

      {/* Method Detail View */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-4">
        {paymentMethod === 'upi' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-700">
              Simulated Virtual Payment Address (VPA / UPI ID)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@oksbi"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 font-medium focus:outline-none focus:border-[#85142f]"
            />
            <div className="flex gap-2">
              {['@okhdfcbank', '@okaxis', '@ybl', '@paytm'].map((suf) => (
                <button
                  key={suf}
                  type="button"
                  onClick={() => setUpiId(`chandresh${suf}`)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-600 transition-colors"
                >
                  {suf}
                </button>
              ))}
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Dummy Card Number</label>
              <input
                type="text"
                readOnly
                value="4532 •••• •••• 8912"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Valid Thru</label>
                <input
                  type="text"
                  readOnly
                  value="12 / 28"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">CVV</label>
                <input
                  type="password"
                  readOnly
                  value="•••"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="space-y-2 text-xs">
            <span className="block font-bold text-neutral-700">Select Mock Bank</span>
            <div className="grid grid-cols-2 gap-2">
              {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b, i) => (
                <div
                  key={b}
                  className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                    i === 0 ? 'border-[#85142f] bg-rose-50 text-[#85142f]' : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Mock Encryption</span>
          </span>
          <span className="font-extrabold text-neutral-900">
            Total: ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Pay CTA */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handlePay}
        className="w-full py-4 px-6 rounded-2xl bg-[#85142f] hover:bg-[#6c0f25] text-white font-extrabold text-sm shadow-lg shadow-[#85142f]/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Simulating Bank Authorization...</span>
          </>
        ) : (
          <>
            <span>Confirm & Simulate Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
          </>
        )}
      </button>
    </div>
  );
};
