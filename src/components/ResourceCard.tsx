"use client";

import { useRouter } from "next/navigation";
import {
  FaPlay,
  FaBook,
  FaHeadphones,
  FaCode,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignal,
} from "react-icons/fa";

const iconMap = {
  Video: FaPlay,
  Artículo: FaBook,
  Podcast: FaHeadphones,
  Tutorial: FaCode,
  Documento: FaFileAlt,
};

export default function ResourceCard({ recurso }: { recurso: any }) {
  const router = useRouter();

  const {
    Titulo,
    Descripcion,
    Tipo,
    documentId,
    Duracion,
    Dificultad,
    Autor,
    Miniatura,
    URL,
  } = recurso;

  const tipoNormalizado = Tipo?.trim() || "Documento";
  const Icon = iconMap[tipoNormalizado as keyof typeof iconMap] || FaFileAlt;

  const handleClick = () => {
    router.push(`/recursos/${documentId}`);
  };

  const miniaturaUrl =
    Miniatura?.data?.attributes?.url &&
    `${process.env.NEXT_PUBLIC_STRAPI_URL}${Miniatura.data.attributes.url}`;

  return (
    <div
      onClick={handleClick}
      className='bg-white rounded-lg shadow-2xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden transform hover:shadow-lg'
    >
      {miniaturaUrl && (
        <div className='relative w-full h-48 overflow-hidden rounded-t-lg'>
          <img
            src={miniaturaUrl}
            alt={Miniatura?.data?.attributes?.alternativeText || Titulo}
            className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 rounded-t-lg'
          />
        </div>
      )}

      <div className='p-6 space-y-4'>
        <div className='flex items-center space-x-3'>
          <Icon className='text-blue-500 text-2xl' />
          <span className='font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200'>
            {Titulo}
          </span>
        </div>

        <p className='text-gray-700 text-base line-clamp-3'>{Descripcion}</p>

        <div className='flex flex-wrap text-sm text-gray-600 gap-4'>
          {Duracion && (
            <div className='flex items-center gap-1'>
              <FaClock className='text-gray-500' />
              <span>{Duracion}</span>
            </div>
          )}
          {Dificultad && (
            <div className='flex items-center gap-1'>
              <FaSignal className='text-gray-500' />
              <span>{Dificultad}</span>
            </div>
          )}
          {Autor && (
            <div className='flex items-center gap-1'>
              <FaUser className='text-gray-500' />
              <span>{Autor}</span>
            </div>
          )}
        </div>

        {URL && (
          <a
            href={URL}
            onClick={(e) => e.stopPropagation()}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline text-sm block mt-2'
          >
            Ver recurso externo
          </a>
        )}
      </div>
    </div>
  );
}
