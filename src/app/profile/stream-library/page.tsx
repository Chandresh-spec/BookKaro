'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Tv,
  Play,
  Clock,
  Star,
  X,
  Subtitles,
  Volume2,
  Pause,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, EmptyStateBlock, SimulatedBanner } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { STREAM_STORE_CATALOG } from '@/data/mockAccountData';
import { StreamTitle } from '@/types/account';

type StreamTab = 'all' | 'rented' | 'purchased';

export default function StreamLibraryPage() {
  const { streamLibrary, rentOrBuyStream, updateStreamProgress } = useAccount();

  const [activeTab, setActiveTab] = useState<StreamTab>('all');
  const [activePlayerTitle, setActivePlayerTitle] = useState<StreamTitle | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState('English (Original)');
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [busyCatalogId, setBusyCatalogId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!activePlayerTitle || !isPlaying) return;
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activePlayerTitle, isPlaying]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredLibrary = useMemo(() => {
    if (activeTab === 'all') return streamLibrary;
    return streamLibrary.filter((t) => t.accessType === activeTab);
  }, [streamLibrary, activeTab]);

  const ownedMovieIds = useMemo(
    () => new Set(streamLibrary.map((t) => t.movieId)),
    [streamLibrary]
  );

  const handleAcquire = async (
    item: (typeof STREAM_STORE_CATALOG)[number],
    mode: 'rented' | 'purchased'
  ) => {
    setBusyCatalogId(item.id);
    await rentOrBuyStream(item, mode);
    setBusyCatalogId(null);
    showToast(
      `${item.title} ${mode === 'purchased' ? 'purchased' : 'rented'}! Added to Stream Library.`
    );
  };

  const handleOpenPlayer = (title: StreamTitle) => {
    setActivePlayerTitle(title);
    setIsPlaying(true);
    setElapsedSeconds(Math.round((title.watchedPercent / 100) * 180));
    setSelectedAudio(title.languages[0] || 'English');
  };

  return (
    <AccountShell activeSection="stream-library" pageTitle="Stream Library">
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Header & Sub-tabs */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#85142f] text-white flex items-center justify-center shrink-0">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Stream Library</h2>
                <p className="text-[11px] text-neutral-500">
                  Watch your rented &amp; purchased movies in up to 4K UHD
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
              {streamLibrary.length} Title{streamLibrary.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="px-5 flex items-center gap-5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'all', label: 'All Titles' },
                { id: 'rented', label: 'Rented' },
                { id: 'purchased', label: 'Purchased' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#85142f] text-[#85142f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Owned / Rented Grid */}
        {filteredLibrary.length === 0 ? (
          <EmptyStateBlock
            icon={Tv}
            title="No movies in this Stream view"
            description="Rent or buy premiere titles below to build your personal BookKaro Stream collection."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLibrary.map((title) => (
              <div
                key={title.id}
                className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-36 h-44 sm:h-auto shrink-0 bg-neutral-900">
                  <img
                    src={title.posterImage}
                    alt={title.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      title.accessType === 'purchased'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-neutral-950'
                    }`}
                  >
                    {title.accessType === 'purchased' ? 'Purchased' : 'Rented'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                        {title.title}
                      </h3>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold shrink-0">
                        {title.quality}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {title.genre} • {title.duration} • {title.certificate}
                    </p>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {title.synopsis}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Watch Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                        <span>{title.watchedPercent}% watched</span>
                        {title.expiresInDays ? (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires in {title.expiresInDays}d
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Lifetime Access</span>
                        )}
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#85142f] rounded-full transition-all"
                          style={{ width: `${title.watchedPercent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenPlayer(title)}
                      className="w-full py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{title.watchedPercent > 0 ? 'Resume Watching' : 'Watch Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rent / Buy Premiere Catalog */}
        <section className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#85142f]" />
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Rent or Buy on BookKaro Stream
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Simulated digital rentals &amp; purchases add instantly to your library
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STREAM_STORE_CATALOG.map((item) => {
              const inLibrary = ownedMovieIds.has(item.id);
              const isBusy = busyCatalogId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-200/80 overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 bg-neutral-900">
                    <img
                      src={item.posterImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.genre} • {item.duration}
                      </p>
                    </div>

                    {inLibrary ? (
                      <div className="py-1.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Your Library</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleAcquire(item, 'rented')}
                          className="py-1.5 px-2 rounded-lg border border-[#85142f] text-[#85142f] hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                        >
                          {isBusy ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            `Rent ₹${item.rentPrice}`
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleAcquire(item, 'purchased')}
                          className="py-1.5 px-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-[11px] font-bold cursor-pointer"
                        >
                          {isBusy ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            `Buy ₹${item.buyPrice}`
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <SimulatedBanner text="Simulated Stream Store & video player. Purchases use mock QuickPay and do not charge any card." />
        </section>
      </div>

      {/* Simulated Video Player Modal */}
      {activePlayerTitle && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  BookKaro Stream Player (Simulated)
                </p>
                <h3 className="text-sm font-bold">{activePlayerTitle.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePlayerTitle(null)}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePlayerTitle.bannerImage}
                alt={activePlayerTitle.title}
                className={`w-full h-full object-cover transition-opacity ${
                  isPlaying ? 'opacity-65' : 'opacity-40'
                }`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="w-14 h-14 rounded-full bg-[#85142f] hover:bg-[#9c1d3a] text-white flex items-center justify-center shadow-lg cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
                <p className="text-xs text-neutral-200 bg-black/60 px-3 py-1 rounded-full">
                  {isPlaying ? 'Playing Preview' : 'Paused'} ({formatTimer(elapsedSeconds)}) •{' '}
                  {activePlayerTitle.quality} • Audio: {selectedAudio}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3 bg-neutral-900">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Progress: {activePlayerTitle.watchedPercent}%</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(100, activePlayerTitle.watchedPercent + 25);
                    updateStreamProgress(activePlayerTitle.id, next);
                    setActivePlayerTitle({ ...activePlayerTitle, watchedPercent: next });
                    showToast(`Playback progress saved (${next}%)`);
                  }}
                  className="text-rose-400 hover:underline font-semibold cursor-pointer"
                >
                  + Simulate Watching 25%
                </button>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#85142f]"
                  style={{ width: `${activePlayerTitle.watchedPercent}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-neutral-400" />
                  <select
                    value={selectedAudio}
                    onChange={(e) => setSelectedAudio(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {activePlayerTitle.languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setSubtitlesOn((s) => !s)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer ${
                    subtitlesOn
                      ? 'border-rose-500 text-rose-300 bg-rose-950/40'
                      : 'border-neutral-700 text-neutral-400'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>Subtitles: {subtitlesOn ? 'EN' : 'Off'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
