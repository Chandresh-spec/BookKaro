'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MovieVideosView } from '@/components/movies/MovieVideosView';
import { MOVIES } from '@/data/mockData';
import { Movie, User } from '@/types';

export default function MovieTrailersPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;

  const movie: Movie = useMemo(() => {
    return (
      MOVIES.find((m) => m.id === movieId) ||
      MOVIES.find((m) => m.id === 'ramayana') ||
      MOVIES.find((m) => m.id === 'party-animals') ||
      MOVIES[0]
    );
  }, [movieId]);

  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
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

      {/* 2. VIDEOS CONTENT */}
      <main className="flex-1">
        <MovieVideosView
          movie={movie}
          onBack={() => router.push(`/movies/${movie.id}`)}
        />
      </main>

      {/* 3. MASTER FOOTER */}
      <Footer currentCity={currentCity} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
