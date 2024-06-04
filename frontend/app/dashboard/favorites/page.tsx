'use client';

import { getUserFavorites } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import SignInCard from '@/components/signin_card';
import Spinner from '@/components/spinner';

export default function Favorites() {
  const session = useSession();
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session.data?.user?.email)
      getUserFavorites(session.data?.user?.email)
        .then((favorites) => setFavorites(favorites))
        .catch((error: Error) => setError(error.message));
  }, [session]);

  return session.status === 'authenticated' ? (
    <div>
      <h1>Favorites</h1>
      {error && <p className='text-red-500'>{error}</p>}
      {favorites && (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite}>{favorite}</li>
          ))}
        </ul>
      )}
    </div>
  ) : session.status === 'loading' ? (
    <div className='w-full h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  ) : (
    <div className='w-full h-screen flex items-center justify-center'>
      <SignInCard message='You need to be signed in to manage favorites.' />
    </div>
  );
}
