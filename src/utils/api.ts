// utils/api.ts

const API_URL = "http://localhost:3001/favorites";

export const addFavorite = async (userId: string, resourceId: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, resourceId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error al añadir el favorito");
  }
};

export const removeFavorite = async (userId: string, resourceId: string) => {
  const response = await fetch(`${API_URL}/${resourceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error al eliminar el favorito");
  }
};

export const listFavorites = async (userId: string) => {
  const response = await fetch(`${API_URL}?userId=${userId}`);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error al listar los favoritos");
  }
};

export const checkFavorite = async (userId: string, resourceId: string) => {
  const response = await fetch(`${API_URL}/${resourceId}?userId=${userId}`);

  if (response.ok) {
    const data = await response.json();
    return data.isFavorite;
  } else {
    throw new Error("Error al comprobar el favorito");
  }
};
