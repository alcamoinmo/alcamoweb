'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase/config'
import type { Database } from '../../lib/types/supabase'

type Property = Database['public']['Tables']['properties']['Row'] & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
}

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [searchParams])

  const fetchProperties = async () => {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)

      // Apply filters based on search params
      const type = searchParams.get('type')
      const status = searchParams.get('status')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const location = searchParams.get('location')

      if (type) query = query.eq('type', type)
      if (status) query = query.eq('status', status)
      if (minPrice) query = query.gte('price', parseFloat(minPrice))
      if (maxPrice) query = query.lte('price', parseFloat(maxPrice))
      if (location) query = query.ilike('address', `%${location}%`)

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Propiedades</h1>
          <p className="mt-2 text-sm text-gray-700">
            {properties.length} propiedades encontradas que coinciden con su criterio de búsqueda
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
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

      {properties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No se encontraron propiedades</h3>
          <p className="mt-2 text-sm text-gray-500">Intente ajustar sus criterios de búsqueda</p>
        </div>
      )}
    </div>
  )
} 