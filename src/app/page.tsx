'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MagnifyingGlassIcon, HomeIcon, BuildingOfficeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'

interface Property {
  id: number
  title: string
  type: string
  status: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  city: string
  state: string
}

const features = [
  {
    title: 'Propiedades Premium',
    description: 'Selección cuidadosa de las mejores propiedades en Aguascalientes',
    icon: HomeIcon,
  },
  {
    title: 'Asesoría Personalizada',
    description: 'Agentes expertos que te guiarán en todo el proceso',
    icon: HomeIcon,
  },
  {
    title: 'Ubicaciones Estratégicas',
    description: 'Propiedades en las mejores zonas de la ciudad',
    icon: HomeIcon,
  },
  {
    title: 'Inversión Segura',
    description: 'Garantizamos la seguridad y legalidad de cada transacción',
    icon: HomeIcon,
  },
]

export default function HomePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('featured', true)
          .limit(6)

        if (error) throw error
        setFeaturedProperties(data || [])
      } catch (err) {
        console.error('Error fetching featured properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    
    if (searchQuery.location) queryParams.set('location', searchQuery.location)
    if (searchQuery.type) queryParams.set('type', searchQuery.type)
    if (searchQuery.status) queryParams.set('status', searchQuery.status)
    if (searchQuery.minPrice) queryParams.set('minPrice', searchQuery.minPrice)
    if (searchQuery.maxPrice) queryParams.set('maxPrice', searchQuery.maxPrice)

    router.push(`/propiedades?${queryParams.toString()}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchQuery(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-brand-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Alcamo Real Estate"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-white sm:text-5xl md:text-6xl">
              Encuentra tu hogar ideal
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-gray-300">
              Descubre propiedades exclusivas en las mejores ubicaciones de México
            </p>
          </div>

          {/* Search Form */}
          <div className="mx-auto mt-12 max-w-3xl">
            <form onSubmit={handleSearch} className="bg-brand-white rounded-lg shadow-xl p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-brand-gray-700">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={searchQuery.location}
                    onChange={handleInputChange}
                    placeholder="Ciudad, colonia o código postal"
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-brand-gray-700">
                    Tipo
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={searchQuery.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="local">Local Comercial</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700">
                    Operación
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={searchQuery.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="venta">Venta</option>
                    <option value="renta">Renta</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-brand-gray-700">
                    Precio Mínimo
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    id="minPrice"
                    value={searchQuery.minPrice}
                    onChange={handleInputChange}
                    placeholder="Mínimo"
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-brand-gray-700">
                    Precio Máximo
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    id="maxPrice"
                    value={searchQuery.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Máximo"
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 inline-block mr-2" />
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-gray-900">
            Propiedades Destacadas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-gray-500">
            Descubre nuestras propiedades más exclusivas
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-brand-gray-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-brand-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-brand-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className="group relative overflow-hidden rounded-lg bg-brand-white shadow transition hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.images[0] || '/images/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-medium text-brand-white">
                      {property.city}, {property.state}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-brand-white">
                      {property.title}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-brand-gray-900">
                      ${property.price.toLocaleString()}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-brand-green-50 px-2.5 py-0.5 text-xs font-medium text-brand-green-700">
                      {property.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-brand-gray-500">
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 text-brand-gray-400" />
                      <span className="ml-1">{property.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>{property.bedrooms} rec</span>
                      <span>{property.bathrooms} baños</span>
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/propiedades?status=venta"
            className="group relative overflow-hidden rounded-lg bg-brand-white p-6 shadow transition hover:shadow-lg"
          >
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/10">
                <HomeIcon className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-brand-gray-900">
                  Comprar
                </h3>
                <p className="mt-1 text-sm text-brand-gray-500">
                  Encuentra tu hogar ideal
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/propiedades?status=renta"
            className="group relative overflow-hidden rounded-lg bg-brand-white p-6 shadow transition hover:shadow-lg"
          >
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/10">
                <BuildingOfficeIcon className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-brand-gray-900">
                  Rentar
                </h3>
                <p className="mt-1 text-sm text-brand-gray-500">
                  Propiedades en renta
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/propiedades?type=local"
            className="group relative overflow-hidden rounded-lg bg-brand-white p-6 shadow transition hover:shadow-lg"
          >
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/10">
                <BuildingStorefrontIcon className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-brand-gray-900">
                  Comercial
                </h3>
                <p className="mt-1 text-sm text-brand-gray-500">
                  Locales y oficinas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 