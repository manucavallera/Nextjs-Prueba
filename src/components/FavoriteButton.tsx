"use client";

import { useState } from "react";

const FavoriteButton = ({ recursoId }: { recursoId: number }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    const userId = "testUser123"; // Simulamos un userId
    const res = await fetch(`/api/favorites`, {
      method: isFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recursoId }),
    });

    if (res.ok) {
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 rounded ${
        isFavorite ? "bg-red-500" : "bg-gray-300"
      }`}
    >
      {isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
    </button>
  );
};

export default FavoriteButton;
