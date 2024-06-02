'use client';
import React, { useState } from 'react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  return (
    <div>
      {/* Render favorite resources */}
      <p>{JSON.stringify(favorites)}</p>
    </div>
  );
}
