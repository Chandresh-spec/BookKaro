'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Play, X, Share2, Star } from 'lucide-react';
import { Movie } from '@/types';

interface VideoItem {
  id: string;
  title: string;
  category: string; // 'Trailer' | 'Teaser' | 'Song' | 'Glimpse'
  duration: string;
  thumbnail: string;
  youtubeId: string;
}

interface MovieVideosViewProps {
  movie: Movie;
  onBack: () => void;
}

export const MovieVideosView: React.FC<MovieVideosViewProps> = ({ movie, onBack }) => {
  // Available language tabs matching user's screenshot
  const languagesList = [
    { key: 'hindi', label: 'हिन्दी', englishName: 'Hindi' },
    { key: 'kannada', label: 'ಕನ್ನಡ', englishName: 'Kannada' },
    { key: 'telugu', label: 'తెలుగు', englishName: 'Telugu' },
    { key: 'tamil', label: 'தமிழ்', englishName: 'Tamil' },
    { key: 'malayalam', label: 'മലയാളം', englishName: 'Malayalam' },
    { key: 'english', label: 'English', englishName: 'English' },
  ];

  const [activeLangKey, setActiveLangKey] = useState('hindi');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Video catalog mapped by language
  const videosByLanguage: Record<string, VideoItem[]> = {
    hindi: [
      {
        id: 'ramayana-hindi-trailer-1',
        title: `${movie.title} — Official Trailer (Hindi)`,
        category: 'Official Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
      {
        id: 'ramayana-hindi-glimpse-2',
        title: `${movie.title} — First Look & Teaser Glimpse`,
        category: 'Teaser Glimpse',
        duration: '2m 10s',
        thumbnail:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
      {
        id: 'ramayana-hindi-theme-3',
        title: `${movie.title} — Official Theme by Hans Zimmer & A.R. Rahman`,
        category: 'Theme Song',
        duration: '3m 15s',
        thumbnail:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
    kannada: [
      {
        id: 'ramayana-kannada-trailer-1',
        title: `${movie.title} — Official Trailer (Kannada)`,
        category: 'Official Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
      {
        id: 'ramayana-kannada-glimpse-2',
        title: `${movie.title} — Lankesh Ravana Character Glimpse`,
        category: 'Character Glimpse',
        duration: '1m 58s',
        thumbnail:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
    telugu: [
      {
        id: 'ramayana-telugu-trailer-1',
        title: `${movie.title} — Official Trailer (Telugu)`,
        category: 'Official Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
      {
        id: 'ramayana-telugu-glimpse-2',
        title: `${movie.title} — Telugu Title Announcement`,
        category: 'Teaser',
        duration: '2m 05s',
        thumbnail:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
    tamil: [
      {
        id: 'ramayana-tamil-trailer-1',
        title: `${movie.title} — Official Trailer (Tamil)`,
        category: 'Official Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
    malayalam: [
      {
        id: 'ramayana-malayalam-trailer-1',
        title: `${movie.title} — Official Trailer (Malayalam)`,
        category: 'Official Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
    english: [
      {
        id: 'ramayana-english-trailer-1',
        title: `${movie.title} — International Teaser Trailer (English Subtitles)`,
        category: 'International Trailer',
        duration: '3m 45s',
        thumbnail:
          movie.bannerImage ||
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
        youtubeId: 'dQw4w9WgXcQ',
      },
    ],
  };

  const currentVideos = videosByLanguage[activeLangKey] || videosByLanguage['hindi'];
  const currentLangObj = languagesList.find((l) => l.key === activeLangKey) || languagesList[0];

  return (
    <div className="w-full bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#ec5e7b] transition-colors mb-4 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to {movie.title}</span>
        </button>

        {/* Heading: "Videos for {movie.title}" matching user screenshot */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight mb-5">
          Videos for <span className="text-[#ec5e7b]">{movie.title}</span>
        </h1>

        {/* Language Filter Pills Strip (हिन्दी, ಕನ್ನಡ, తెలుగు, தமிழ், മലയാളം, English) */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {languagesList.map((lang) => {
            const isActive = activeLangKey === lang.key;
            return (
              <button
                key={lang.key}
                type="button"
                onClick={() => {
                  setActiveLangKey(lang.key);
                  setPlayingVideoId(null);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
                  isActive
                    ? 'bg-[#ec5e7b] text-white shadow-md shadow-[#ec5e7b]/30'
                    : 'border border-neutral-300 text-neutral-700 hover:border-neutral-400 bg-white hover:bg-neutral-50'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>

        {/* Active Language Label */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-neutral-800">
            {currentLangObj.label}
          </h2>
        </div>

        {/* Vertical Stack of Video Cards (Matching Screenshot) */}
        <div className="space-y-6 sm:space-y-8">
          {currentVideos.map((video) => {
            const isPlaying = playingVideoId === video.id;

            return (
              <div
                key={video.id}
                className="bg-neutral-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 group transition-all"
              >
                {/* 16:9 Video Player / Thumbnail Container */}
                <div className="relative aspect-video w-full bg-black">
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingVideoId(video.id)}
                      className="relative w-full h-full cursor-pointer group/video overflow-hidden"
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-cover object-center group-hover/video:scale-105 transition-transform duration-500 opacity-90"
                      />

                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                      {/* Title & Category Watermark on Thumbnail */}
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                          {video.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-end justify-between">
                        <div>
                          <h3 className="text-white text-sm sm:text-lg font-extrabold drop-shadow-md leading-snug">
                            {video.title}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-black/70 text-neutral-300 text-[11px] font-mono shrink-0">
                          {video.duration}
                        </span>
                      </div>

                      {/* Big Centered Play Button Matching Screenshot */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-black/75 hover:bg-black/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs group-hover/video:scale-115 active:scale-95 transition-all duration-300 border-2 border-white/60">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white ml-1 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Breadcrumbs */}
        <div className="mt-12 pt-6 border-t border-neutral-100 text-xs text-neutral-400 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-neutral-700">Home</Link>
          <span>→</span>
          <Link href="/movies" className="hover:text-neutral-700">Movies</Link>
          <span>→</span>
          <button onClick={onBack} className="hover:text-neutral-700 cursor-pointer">
            {movie.title}
          </button>
          <span>→</span>
          <span className="text-neutral-700 font-bold">Videos & Trailers</span>
        </div>
      </div>
    </div>
  );
};
