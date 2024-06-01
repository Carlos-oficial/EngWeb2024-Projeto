'use client';
import React, { useEffect, useState } from 'react';
import backendConn from '../../lib/backendConn';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    backendConn.get('/resource/favorites')
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      {/* Render favorite resources */}
      <p>
        {JSON.stringify(favorites)}
        </p>
    </div>
  );
}
