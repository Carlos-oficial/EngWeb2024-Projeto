'use client';
import { listResourcesByUser, getUser, getUserFavorites } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const session = useSession();
  const [favorites, setFavorites] = useState<String[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session.data?.user?.id)
      getUserFavorites(session.data?.user?.id)
        .then((favorites) => setFavorites(favorites))
        .catch((error: Error) => setError(error.message));
  }, [session]);

  return (
    <div>
      {/* Render favorite resources */}
      <p>{JSON.stringify(favorites)}</p>
    </div>
  );
}
