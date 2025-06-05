'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from("properties")
        .select("id,title,price,city,state,images,bedrooms,bathrooms,area")
        .eq("featured", true)
        .limit(6);
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/propiedades?search=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="Alcamo" width={36} height={36} className="h-9 w-9" />
            <span className="font-bold text-xl text-brand-900 tracking-tight">Alcamo Inmuebles</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/propiedades" className="text-brand-900 hover:text-brand-700 font-medium transition">Propiedades</Link>
            <Link href="/favoritos" className="text-brand-900 hover:text-brand-700 font-medium transition">Favoritos</Link>
            <Link href="/dashboard" className="text-brand-900 hover:text-brand-700 font-medium transition">Dashboard</Link>
            <Link href="/auth/login" className="ml-4 px-4 py-2 rounded bg-brand-900 text-white font-semibold hover:bg-brand-700 transition">Iniciar sesión</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-brand-gray-900 text-white flex flex-col items-center justify-center text-center min-h-[400px] md:min-h-[500px]">
        <Image
          src="/images/hero-bg.jpg"
          alt="Ciudad de México skyline"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="relative z-10 max-w-2xl mx-auto py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Encuentra tu hogar ideal en México</h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow">Explora casas, departamentos y terrenos en venta y renta en las mejores zonas.</p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Buscar por ciudad, colonia o código postal..."
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-900 shadow"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-brand-900 hover:bg-brand-700 text-white px-6 py-3 rounded-md font-semibold transition shadow"
            >
              Buscar
            </button>
          </form>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-900/80 to-transparent" />
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-8 text-center">Propiedades Destacadas</h2>
        {loading ? (
          <div className="text-center text-brand-gray-700">Cargando propiedades...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col border border-gray-100">
                <div className="relative h-56 w-full">
                  <Image
                    src={property.images?.[0] || "/images/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-brand-900 text-white text-xs font-semibold px-3 py-1 rounded shadow">{property.status === 'for_sale' ? 'En Venta' : property.status === 'for_rent' ? 'En Renta' : property.status}</span>
                  <span className="absolute top-3 right-3 bg-white/80 text-brand-900 text-xs font-bold px-3 py-1 rounded shadow">{property.price?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-900 mb-1 truncate">{property.title}</h3>
                    <p className="text-brand-gray-700 mb-2 text-sm">{property.bedrooms} recámaras · {property.bathrooms} baños · {property.area} m²</p>
                    <p className="text-sm text-brand-gray-500 mb-2 truncate">{property.city}, {property.state}</p>
                  </div>
                  <Link href={`/propiedades/${property.id}`} className="mt-4 inline-block bg-brand-900 text-white px-4 py-2 rounded hover:bg-brand-700 transition text-center font-semibold">Ver detalles</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/propiedades" className="inline-block bg-brand-900 text-white px-8 py-3 rounded font-semibold hover:bg-brand-700 transition shadow">Ver todas las propiedades</Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-900 text-white py-16 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para encontrar tu próxima propiedad?</h2>
        <p className="mb-8 text-lg">Contáctanos y uno de nuestros agentes expertos te ayudará en cada paso del proceso.</p>
        <Link href="/contacto" className="inline-block bg-white text-brand-900 px-8 py-3 rounded font-semibold hover:bg-gray-200 transition">Contáctanos</Link>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="Alcamo" width={28} height={28} className="h-7 w-7" />
            <span className="font-semibold text-brand-900">Alcamo Inmuebles © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-brand-gray-700">
            <Link href="/aviso-privacidad" className="hover:underline">Aviso de privacidad</Link>
            <Link href="/contacto" className="hover:underline">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
