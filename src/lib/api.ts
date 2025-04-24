import axios from "axios";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

interface RecursoAttributes {
  Titulo: string;
  Descripcion: string;
  Tipo: string;
  Url: string;
  Contenido: string;
  Slug: string;
  Autor: string;
  Duracion: string;
  Dificultad: string;
  Lenguaje: string;
  Tags: string[];
  thumbnail?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Recurso {
  id: number;
  attributes: RecursoAttributes;
}

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

export async function getRecursos(): Promise<Recurso[]> {
  try {
    const { data } = await axios.get<StrapiResponse<Recurso[]>>(
      `${STRAPI_URL}/api/recursos-de-aprendizajes`,
      {
        params: {
          populate: {
            thumbnail: {
              fields: ["url", "alternativeText"],
            },
          },
          sort: "createdAt:desc",
        },
        timeout: 5000,
      }
    );

    if (!data?.data) {
      throw new Error("La estructura de datos de Strapi es incorrecta");
    }

    return data.data;
  } catch (error) {
    console.error("Error al obtener recursos:", {
      message: axios.isAxiosError(error) ? error.message : "Error desconocido",
      url: axios.isAxiosError(error) ? error.config?.url : "",
      status: axios.isAxiosError(error) ? error.response?.status : "",
      response: axios.isAxiosError(error) ? error.response?.data : "",
    });
    throw new Error(
      "No se pudieron cargar los recursos. Inténtalo de nuevo más tarde."
    );
  }
}

export async function getRecursoById(id: string): Promise<Recurso> {
  try {
    // Verificación adicional del ID
    if (!id || isNaN(Number(id))) {
      throw new Error("ID de recurso inválido");
    }

    const { data } = await axios.get<StrapiResponse<Recurso>>(
      `${STRAPI_URL}/api/recursos-de-aprendizajes/${id}`,
      {
        params: {
          populate: {
            thumbnail: {
              populate: "*",
            },
          },
        },
        timeout: 5000,
      }
    );

    if (!data?.data) {
      throw new Error("Recurso no encontrado");
    }

    return data.data;
  } catch (error) {
    console.error(`Error detallado al obtener recurso ${id}:`, {
      message: axios.isAxiosError(error) ? error.message : "Error desconocido",
      url: axios.isAxiosError(error) ? error.config?.url : "",
      status: axios.isAxiosError(error) ? error.response?.status : "",
      response: axios.isAxiosError(error) ? error.response?.data : "",
    });

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("El recurso solicitado no fue encontrado");
    }

    throw new Error("No se pudo cargar el recurso solicitado");
  }
}

export function formatRecurso(recursos: Recurso[]) {
  return recursos.map((recurso) => {
    // Manejo seguro de la URL (elimina comillas si existen)
    const url = recurso.attributes.Url?.replace(/^"+|"+$/g, "") || "#";

    return {
      id: recurso.id,
      titulo: recurso.attributes.Titulo || "Sin título",
      descripcion: recurso.attributes.Descripcion || "Sin descripción",
      tipo: recurso.attributes.Tipo || "Desconocido",
      url: url,
      contenido: recurso.attributes.Contenido || "",
      slug: recurso.attributes.Slug || "",
      autor: recurso.attributes.Autor || "Autor desconocido",
      duracion: recurso.attributes.Duracion || "",
      dificultad: recurso.attributes.Dificultad?.trim() || "Desconocida",
      lenguaje: recurso.attributes.Lenguaje || "",
      tags: recurso.attributes.Tags || [],
      thumbnail: recurso.attributes.thumbnail?.data?.attributes?.url
        ? {
            url: `${STRAPI_URL}${recurso.attributes.thumbnail.data.attributes.url}`,
            alt:
              recurso.attributes.thumbnail.data.attributes.alternativeText ||
              recurso.attributes.Titulo,
          }
        : null,
      fechaCreacion: recurso.attributes.createdAt,
    };
  });
}
