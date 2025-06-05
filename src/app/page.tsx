'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../lib/supabase/config'
import type { Database } from '../lib/types/supabase'

type Property = Database['public']['Tables']['properties']['Row'] & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
}

export default function HomePage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .in('status', ['FOR_SALE', 'FOR_RENT'])
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setFeaturedProperties(data || [])
    } catch (error) {
      console.error('Error fetching featured properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/hero-image.jpg"
            alt="Casa de lujo en Aguascalientes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Encuentra tu casa so&ntilde;ada en Aguascalientes
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Descubre la propiedad perfecta con Alcamo Real Estate. Ofrecemos una amplia selecci&oacute;n de casas,
            apartamentos y propiedades comerciales en toda Aguascalientes.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 sm:flex gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 w-full">
              <select
                value={searchParams.type}
                onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Tipo de propiedad</option>
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Apartamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="OFFICE">Oficina</option>
              </select>

              <select
                value={searchParams.status}
                onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Estado</option>
                <option value="FOR_SALE">En venta</option>
                <option value="FOR_RENT">En renta</option>
              </select>

              <input
                type="number"
                placeholder="Precio mínimo"
                value={searchParams.minPrice}
                onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Precio máximo"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Ubicación"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="mt-4 sm:mt-0 w-full sm:w-auto flex-shrink-0 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Propiedades Destacadas</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Descubre nuestra selección elegida de propiedades premium en Aguascalientes
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                {property.property_media?.[0] && (
                  <Image
                    src={property.property_media[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                  {property.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{property.address}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: property.currency,
                      maximumFractionDigits: 0,
                    }).format(property.price)}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {property.status === 'FOR_SALE' ? 'En venta' : 'En renta'}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                  {property.bedrooms && (
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}</span>
                  )}
                  {property.bathrooms && (
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'Baño' : 'Baños'}</span>
                  )}
                  <span>{property.area_size} {property.area_unit}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Por Qué Elegirnos
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Tu socio de confianza en el mercado inmobiliario de Aguascalientes
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Experiencia Local</h3>
              <p className="mt-2 text-base text-gray-500">
                Profundo conocimiento de las tendencias y oportunidades del mercado inmobiliario de Aguascalientes
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Agentes Profesionales</h3>
              <p className="mt-2 text-base text-gray-500">
                Equipo dedicado a encontrar la propiedad perfecta para ti
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Experiencia Suave</h3>
              <p className="mt-2 text-base text-gray-500">
                Plataforma moderna que hace que la búsqueda y transacciones sean fáciles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 