"use client";

import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const USER_ID = "user123"; // 🔐 Temporal, luego lo cambiamos por auth real

export default function FavoritoButton({ resourceId }: { resourceId: string }) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga

  useEffect(() => {
    const checkFavorite = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MICROSERVICIO_URL}/favorites/${resourceId}`,
          {
            method: "POST", // Nest espera userId en el body
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: USER_ID }),
          }
        );
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error al comprobar si es favorito", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavorite();
  }, [resourceId]);

  const toggleFavorite = async () => {
    setIsLoading(true); // Establecemos como cargando
    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite
      ? `${process.env.NEXT_PUBLIC_MICROSERVICIO_URL}/favorites/${resourceId}`
      : `${process.env.NEXT_PUBLIC_MICROSERVICIO_URL}/favorites`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, resourceId }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite); // Cambiar estado favorito
      }
    } catch (error) {
      console.error("Error al agregar o quitar favorito", error);
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  };

  if (isFavorite === null || isLoading) {
    return (
      <button disabled className='text-gray-400'>
        Cargando...
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className='text-red-500 hover:text-red-700 text-xl'
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
