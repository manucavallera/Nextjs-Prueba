import ResourceCard from "@/components/ResourceCard";

export default async function RecursosPage() {
  // Obtener los recursos de Strapi
  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recursos-de-aprendizajes?populate=*`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  const recursos = data.data;

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {recursos.map((recurso: any) => (
          // Accediendo correctamente a recurso.id y recurso.attributes
          <ResourceCard key={recurso.id} recurso={recurso} />
        ))}
      </div>
    </div>
  );
}
