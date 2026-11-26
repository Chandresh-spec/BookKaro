'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ReservationTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({
  initialSeconds = 600, // 10 minutes
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 120; // less than 2 minutes

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
        isUrgent
          ? 'bg-red-50 text-red-700 border border-red-300 animate-pulse'
          : 'bg-amber-50 text-amber-900 border border-amber-200'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      )}
      <span>
        Hold Time Remaining:{' '}
        <span className="font-black font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </span>
    </div>
  );
};
