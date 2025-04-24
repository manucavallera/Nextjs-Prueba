"use client";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import {
  FaClock,
  FaSignal,
  FaUser,
  FaLink,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { addFavorite } from "@/utils/api";

interface Recurso {
  Titulo: string;
  Descripcion: string;
  Contenido: string;
  Tipo: string;
  Miniatura?: {
    data?: {
      attributes?: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  Duracion: string;
  Dificultad: string;
  Autor: string;
  URL: string;
}

// Usar el hook useParams para obtener el parámetro de la URL
export default function RecursoPage() {
  const params = useParams();
  // Asegurar que documentId sea siempre string
  const documentId = Array.isArray(params.documentId)
    ? params.documentId[0]
    : params.documentId;

  if (!documentId) {
    return redirect("/recursos");
  }
  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Función para obtener el estado de favorito desde localStorage
  const getFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(documentId);
  };

  // Función para actualizar el estado de favoritos en localStorage
  const updateFavoriteStatus = (isFavorited: boolean) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorited) {
      favorites.push(documentId);
    } else {
      const index = favorites.indexOf(documentId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  useEffect(() => {
    const fetchRecurso = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recursos-de-aprendizajes?filters[documentId][$eq]=${documentId}&populate=*`;
      const res = await fetch(apiUrl);

      if (!res.ok) {
        return redirect("/recursos");
      }

      const data = await res.json();
      const fetchedRecurso = data.data[0];

      if (!fetchedRecurso) {
        return redirect("/recursos");
      }

      setRecurso(fetchedRecurso);
      setIsFavorited(getFavoriteStatus()); // Inicializa el estado de favorito
    };

    fetchRecurso();
  }, [documentId]);

  const toggleFavorite = async () => {
    const userId = "usuario1"; // Obtén el `userId` real de tu sistema de autenticación
    try {
      // Usa la función de addFavorite si necesitas realizar alguna lógica adicional con el backend
      const response = await addFavorite(userId, documentId);
      if (response) {
        setIsFavorited(!isFavorited); // Alterna el estado de favorito
        updateFavoriteStatus(!isFavorited); // Actualiza el estado en localStorage
      }
    } catch (error) {
      console.error("Error al actualizar el estado de favorito", error);
    }
  };

  if (!recurso) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  const {
    Titulo,
    Descripcion,
    Contenido,
    Tipo,
    Miniatura,
    Duracion,
    Dificultad,
    Autor,
    URL,
  } = recurso;

  // 🎯 Links adicionales manuales con miniaturas
  const recursosAdicionales = [
    documentId === "zn5lyczltzr8ou9krq3rv3yg"
      ? {
          url: "https://developer.mozilla.org/es/docs/Web/JavaScript",
          tipo: "documentacion",
          titulo: "MDN JavaScript Docs",
          miniatura:
            "https://pluralsight2.imgix.net/paths/images/javascript-542e10ea6e.png",
        }
      : documentId === "ebxnbkei8vy0u7ahrewbuakw"
      ? {
          url: "https://www.youtube.com/watch?v=rbuYtrNUxg4",
          tipo: "video",
          titulo: "Introducción a HTML y CSS",
          miniatura: "https://img.youtube.com/vi/rbuYtrNUxg4/0.jpg", // Miniatura de YouTube
        }
      : documentId === "ujs03wh434sq7mzcmwlt8vug"
      ? {
          url: "https://www.youtube.com/watch?v=Wl8O6wW4FJU",
          tipo: "video",
          titulo: "GraphQL Curso práctico",
          miniatura: "https://img.youtube.com/vi/Wl8O6wW4FJU/0.jpg", // Miniatura de YouTube
        }
      : documentId === "r3com31voz5hoj8bjo864nbh"
      ? {
          url: "https://www.youtube.com/watch?v=6Jfk8ic3KVk&feature=youtu.be",
          tipo: "video",
          titulo: "Curso de React",
          miniatura: "https://img.youtube.com/vi/6Jfk8ic3KVk/0.jpg", // Miniatura de YouTube
        }
      : {
          url: "https://www.youtube.com/watch?v=5gLZ0Xzzmds",
          tipo: "video",
          titulo: "Curso practico NodeJS",
          miniatura: "https://img.youtube.com/vi/5gLZ0Xzzmds/0.jpg", // Miniatura de YouTube
        },
  ];

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
        {Miniatura?.data?.attributes?.url && (
          <div className='relative h-64 w-full'>
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${Miniatura.data.attributes.url}`}
              alt={Miniatura.data.attributes.alternativeText || Titulo}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
            />
          </div>
        )}
        <div className='p-6'>
          <h1 className='text-3xl font-bold mb-2 text-gray-800'>{Titulo}</h1>
          <p className='text-gray-600 mb-4'>{Descripcion}</p>
          <button
            onClick={toggleFavorite}
            className='flex items-center gap-2 mb-4'
          >
            {isFavorited ? (
              <FaHeart className='text-red-600' />
            ) : (
              <FaRegHeart className='text-gray-600' />
            )}
            {isFavorited ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
          </button>
          <div className='text-sm text-gray-500 mb-4 flex gap-6'>
            <span className='flex items-center gap-1'>
              <FaClock className='text-gray-400' /> {Duracion}
            </span>
            <span className='flex items-center gap-1'>
              <FaSignal className='text-gray-400' /> {Dificultad}
            </span>
            <span className='flex items-center gap-1'>
              <FaUser className='text-gray-400' /> {Autor}
            </span>
          </div>

          <div
            className='prose max-w-none mb-6'
            dangerouslySetInnerHTML={{ __html: Contenido }}
          />

          {/* 🔗 Recursos  */}
          <div className='border-t pt-4 mt-4'>
            <h2 className='text-2xl font-semibold mb-2 text-gray-800'>
              Recursos
            </h2>
            <ul className='space-y-4'>
              {recursosAdicionales.map((recurso, index) => (
                <li
                  key={index}
                  className='flex items-center gap-4 p-2 hover:bg-gray-100 rounded transition duration-200'
                >
                  {recurso.miniatura && (
                    <img
                      src={recurso.miniatura}
                      alt={recurso.titulo}
                      className='w-16 h-16 object-cover rounded-md shadow'
                    />
                  )}
                  <a
                    href={recurso.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`flex items-center gap-2 ${
                      recurso.tipo === "video"
                        ? "text-red-600"
                        : "text-blue-600"
                    } hover:underline`}
                  >
                    <FaLink /> {recurso.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
