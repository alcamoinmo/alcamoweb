'use client'

import { useState } from 'react'
import PropertySearchForm from '../../../components/properties/PropertySearchForm'
import { supabase } from '../../../lib/supabase/client'
import type { Database } from '../../../lib/types/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { SearchFormData } from '../../../components/properties/PropertySearchForm'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyWithMedia = Property & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
}

export default function PropertySearchPage() {
  const [properties, setProperties] = useState<PropertyWithMedia[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (data: SearchFormData) => {
    setLoading(true)
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('status', data['status'] === 'ALL' ? 'FOR_SALE' : data['status'])

      if (data['type'] !== 'ALL') {
        query = query.eq('type', data['type'])
      }

      if (data['minPrice']) {
        query = query.gte('price', parseFloat(data['minPrice']))
      }

      if (data['maxPrice']) {
        query = query.lte('price', parseFloat(data['maxPrice']))
      }

      if (data['bedrooms'] !== 'ANY') {
        query = query.eq('bedrooms', data['bedrooms'] === '5+' ? 5 : parseInt(data['bedrooms']))
      }

      if (data['bathrooms'] !== 'ANY') {
        query = query.eq('bathrooms', data['bathrooms'] === '5+' ? 5 : parseInt(data['bathrooms']))
      }

      if (data['query']) {
        query = query.or(`title.ilike.%${data['query']}%,description.ilike.%${data['query']}%,address.ilike.%${data['query']}%`)
      }

      const { data: results, error } = await query

      if (error) throw error
      setProperties(results || [])
    } catch (error) {
      console.error('Error searching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <PropertySearchForm onSearch={handleSearch} />
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group relative block overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {property.property_media?.length > 0 ? (
                      <Image
                        src={property.property_media[0].url}
                        alt={property.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{property.address}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: property.currency,
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {property.bedrooms && (
                          <span>{property.bedrooms} {property.bedrooms === 1 ? 'habitación' : 'habitaciones'}</span>
                        )}
                        {property.bathrooms && (
                          <>
                            <span>•</span>
                            <span>{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No se encontraron propiedades que coincidan con tus criterios.</p>
          )}
        </div>
      </div>
    </div>
  )
} 