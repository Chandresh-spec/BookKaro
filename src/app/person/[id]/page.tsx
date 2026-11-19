'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Share2,
  Star,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { getPersonDetail } from '@/data/mockPersons';
import { User } from '@/types';

export default function PersonProfilePage() {
  const params = useParams();
  const router = useRouter();
  const personId = (params?.id as string) || 'ranbir-kapoor';

  const person = useMemo(() => {
    return getPersonDetail(personId);
  }, [personId]);

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);

  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${person.name} — BookKaro`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-[#ec5e7b] selection:text-white flex flex-col font-sans">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={(c) => setCurrentCity(c)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </button>
          <h1 className="text-sm font-bold text-neutral-900 truncate max-w-[220px]">
            {person.name}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 3. HERO BANNER - Exact BookMyShow style (Dark background with circular photo & metadata table) */}
      <section className="w-full bg-[#18181b] text-white py-10 sm:py-14 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 lg:gap-14">
            
            {/* Person Circular Portrait (Large round photo matching screenshot 2) */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 bg-neutral-800 ring-4 ring-white/5">
              <Image
                src={person.image}
                alt={person.name}
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover object-top"
              />
            </div>

            {/* Profile Info & Metadata */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {person.name}
                </h1>

                {/* Share Button (Desktop) */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer border border-white/10 self-start"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Metadata Details Grid matching BookMyShow */}
              <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-neutral-300 max-w-3xl">
                {person.alsoKnownAs && (
                  <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                    <span className="text-neutral-400 font-medium">Also known as:</span>
                    <span className="text-neutral-100 font-semibold">{person.alsoKnownAs}</span>
                  </div>
                )}

                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                  <span className="text-neutral-400 font-medium">Occupation:</span>
                  <span className="text-neutral-100 font-medium">{person.occupation}</span>
                </div>

                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                  <span className="text-neutral-400 font-medium">Born:</span>
                  <span className="text-neutral-100 font-medium">{person.born}</span>
                </div>

                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                  <span className="text-neutral-400 font-medium">Birthplace:</span>
                  <span className="text-neutral-100 font-medium">{person.birthplace}</span>
                </div>

                {person.spouse && (
                  <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                    <span className="text-neutral-400 font-medium">Spouse:</span>
                    <span className="text-neutral-100 font-medium">{person.spouse}</span>
                  </div>
                )}

                {person.children && (
                  <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-baseline">
                    <span className="text-neutral-400 font-medium">Children:</span>
                    <span className="text-neutral-100 font-medium">{person.children}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MAIN BODY CONTENT */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
          
          {/* ABOUT SECTION (Matching Screenshot 2) */}
          <section className="border-b border-neutral-100 pb-10">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-4 tracking-tight">
              About
            </h2>
            <div className="relative">
              <p
                className={`text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-4xl transition-all ${
                  isAboutExpanded ? '' : 'line-clamp-3'
                }`}
              >
                {person.about}
              </p>
              <button
                type="button"
                onClick={() => setIsAboutExpanded((prev) => !prev)}
                className="mt-2 text-xs sm:text-sm font-bold text-[#ec5e7b] hover:text-[#d44865] cursor-pointer inline-flex items-center gap-1"
              >
                <span>{isAboutExpanded ? 'Read Less' : 'Read More'}</span>
              </button>
            </div>
          </section>

          {/* PEERS & MORE SECTION (Matching Screenshot 3) */}
          {person.peers && person.peers.length > 0 && (
            <section className="border-b border-neutral-100 pb-10">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-6 tracking-tight">
                Peers & More
              </h2>
              <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar">
                {person.peers.map((peer) => (
                  <Link
                    key={peer.id}
                    href={`/person/${peer.id}`}
                    className="flex flex-col items-center shrink-0 w-24 sm:w-28 text-center group cursor-pointer"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 shadow-sm group-hover:scale-105 transition-transform bg-neutral-100 border border-neutral-200">
                      <Image
                        src={peer.image}
                        alt={peer.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#ec5e7b] transition-colors leading-tight line-clamp-1">
                      {peer.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium mt-0.5">
                      {peer.role}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAMILY SECTION (Matching Screenshot 3) */}
          {person.family && person.family.length > 0 && (
            <section className="border-b border-neutral-100 pb-10">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-6 tracking-tight">
                Family
              </h2>
              <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar">
                {person.family.map((fam, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center shrink-0 w-24 sm:w-28 text-center group"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 shadow-sm group-hover:scale-105 transition-transform bg-neutral-100 border border-neutral-200">
                      <Image
                        src={fam.image}
                        alt={fam.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight line-clamp-1">
                      {fam.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1">
                      {fam.relation}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* POPULAR MOVIES SECTION (Matching Screenshot 4) */}
          {person.movies && person.movies.length > 0 && (
            <section className="border-b border-neutral-100 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Popular Movies
                </h2>
                <Link
                  href="/movies"
                  className="text-xs sm:text-sm font-bold text-[#ec5e7b] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {person.movies.map((m) => (
                  <Link
                    key={m.id}
                    href={`/movies/${m.id}`}
                    className="flex flex-col group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 mb-2.5 shadow-xs border border-neutral-100">
                      <Image
                        src={m.posterImage}
                        alt={m.title}
                        fill
                        sizes="(max-width: 640px) 160px, 240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {m.rating && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{m.rating.toFixed(1)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-[#ec5e7b] transition-colors truncate">
                      {m.title}
                    </h3>
                    {m.role && (
                      <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                        {m.role}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ACCORDION FAQ / TRIVIA SECTION (Matching Screenshot 4) */}
          <section className="space-y-4">
            {/* Did You Know Accordion */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setIsTriviaOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-white hover:bg-neutral-50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-neutral-900">
                  Did You Know? ({person.trivia.length})
                </span>
                {isTriviaOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                )}
              </button>

              {isTriviaOpen && (
                <div className="px-5 pb-5 pt-1 bg-white border-t border-neutral-100 text-xs sm:text-sm text-neutral-600 space-y-2.5 animate-in fade-in-50">
                  {person.trivia.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ec5e7b] shrink-0 mt-2" />
                      <p className="leading-relaxed">{t}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Personal Quotes Accordion */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setIsQuotesOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-white hover:bg-neutral-50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-neutral-900">
                  Personal Quotes ({person.quotes.length})
                </span>
                {isQuotesOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                )}
              </button>

              {isQuotesOpen && (
                <div className="px-5 pb-5 pt-1 bg-white border-t border-neutral-100 text-xs sm:text-sm text-neutral-600 space-y-3 animate-in fade-in-50">
                  {person.quotes.map((q, idx) => (
                    <blockquote
                      key={idx}
                      className="italic pl-3 border-l-2 border-[#ec5e7b] text-neutral-700 leading-relaxed"
                    >
                      “{q}”
                    </blockquote>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* BREADCRUMBS */}
          <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-400 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-neutral-700">Home</Link>
            <span>→</span>
            <span className="hover:text-neutral-700">Person</span>
            <span>→</span>
            <span className="text-neutral-700 font-bold">{person.name}</span>
          </div>

        </div>
      </main>

      {/* 5. MASTER BOOKKARO FOOTER */}
      <Footer currentCity={currentCity} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />
    </div>
  );
}
