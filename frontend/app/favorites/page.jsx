"use client";
import React, { useEffect, useState } from 'react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/resource/favorites')
     .then(response => response.json())
     .then(data => setFavorites(data))
     .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {/* Render favorite resources */}
      {JSON.stringify(favorites)}
    </div>
  );
}