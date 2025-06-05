import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showContact, setShowContact] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("properties")
        .select("id,title,price,city,state,images,bedrooms,bathrooms,area")
        .eq("featured", true)
        .limit(3);
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/propiedades?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-brand-gray-900 text-white py-20 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Encuentra tu hogar ideal</h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">Explora casas, departamentos y terrenos en venta y renta en tu ciudad. La mejor selección de propiedades, agentes expertos y asesoría personalizada.</p>
        <form className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por ciudad, colonia o código postal..."
            className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-brand-900 hover:bg-brand-gray-900 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Buscar
          </button>
        </form>
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Link href="/dashboard" className="bg-white text-brand-900 px-4 py-2 rounded font-semibold hover:bg-gray-200 transition">Dashboard</Link>
          <Link href="/favoritos" className="bg-white text-brand-900 px-4 py-2 rounded font-semibold hover:bg-gray-200 transition">Favoritos</Link>
          <button onClick={() => setShowContact(true)} className="bg-brand-900 border border-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-brand-900 transition">Contáctanos</button>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-brand-gray-900 mb-8 text-center">Propiedades Destacadas</h2>
        {loading ? (
          <div className="text-center text-brand-gray-700">Cargando propiedades...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                <div className="relative h-56 w-full">
                  <Image
                    src={property.images?.[0] || "/images/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-gray-900 mb-1">{property.title}</h3>
                    <p className="text-brand-gray-700 mb-2">{property.bedrooms} recámaras · {property.bathrooms} baños · {property.area} m²</p>
                    <p className="text-brand-900 font-bold text-xl mb-2">${property.price?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</p>
                    <p className="text-sm text-brand-gray-500">{property.city}, {property.state}</p>
                  </div>
                  <Link href={`/propiedades/${property.id}`} className="mt-4 inline-block bg-brand-900 text-white px-4 py-2 rounded hover:bg-brand-gray-900 transition text-center">Ver detalles</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/propiedades" className="inline-block bg-brand-900 text-white px-8 py-3 rounded font-semibold hover:bg-brand-gray-900 transition">Ver todas las propiedades</Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-900 text-white py-16 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para encontrar tu próxima propiedad?</h2>
        <p className="mb-8 text-lg">Contáctanos y uno de nuestros agentes expertos te ayudará en cada paso del proceso.</p>
        <button onClick={() => setShowContact(true)} className="inline-block bg-white text-brand-900 px-8 py-3 rounded font-semibold hover:bg-gray-200 transition">Contáctanos</button>
      </section>

      {/* Contact Form Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button onClick={() => setShowContact(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            {/* You can import and use your ContactForm component here if available */}
            <h3 className="text-xl font-bold mb-4 text-brand-gray-900">Solicita información</h3>
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Nombre" className="border rounded px-3 py-2" />
              <input type="email" placeholder="Correo electrónico" className="border rounded px-3 py-2" />
              <input type="tel" placeholder="Teléfono" className="border rounded px-3 py-2" />
              <textarea placeholder="Mensaje" className="border rounded px-3 py-2" rows={3}></textarea>
              <button type="submit" className="bg-brand-900 text-white px-4 py-2 rounded font-semibold hover:bg-brand-gray-900 transition">Enviar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
