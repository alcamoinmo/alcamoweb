'use client'

import React from "react"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../../../lib/supabase/config'
import type { Database } from '../../../lib/types/supabase'
import { useAuth } from '../../../lib/hooks/useAuth'

type Property = Database['public']['Tables']['properties']['Row'] & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
  agent: Database['public']['Tables']['users']['Row']
}

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*),
          agent:users!properties_agent_id_fkey (*)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (err) {
      console.error('Error fetching property:', err)
      setError('No se pudo cargar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperty()
  }, [params.id, fetchProperty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const { error } = await supabase.from('leads').insert([
        {
          ...formData,
          property_id: params.id,
          status: 'NEW',
          assigned_agent_id: property?.agent_id,
        },
      ])

      if (error) throw error
      setFormSuccess(true)
      setFormData({ full_name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Error submitting lead:', err)
      setError('Failed to submit your request')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Error</h2>
          <p className="mt-2 text-sm text-gray-500">{error || 'Property not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
            {property.property_media?.[0] && (
              <Image
                src={property.property_media[0].url}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          {property.property_media && property.property_media.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {property.property_media.slice(1).map((media) => (
                <div key={media.id} className="aspect-w-1 aspect-h-1 relative rounded-lg overflow-hidden">
                  <Image
                    src={media.url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: property.currency,
                maximumFractionDigits: 0,
              }).format(property.price)}
            </span>
            <span className="ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {property.status === 'FOR_SALE' ? 'En venta' : 'En renta'}
            </span>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.address}</dd>
              </div>
              {property.bedrooms && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Habitaciones</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.bedrooms}</dd>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Baños</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.bathrooms}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Área</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {property.area_size} {property.area_unit}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Descripción</h3>
            <div className="mt-2 text-sm text-gray-500 space-y-4">
              <p>{property.description}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Listado por</h3>
            <div className="mt-3 flex items-center">
              {property.agent.avatar_url ? (
                <Image
                  src={property.agent.avatar_url}
                  alt={property.agent.full_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    {property.agent.full_name[0]}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{property.agent.full_name}</p>
                <p className="text-sm text-gray-500">{property.agent.email}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {!user && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Contact Agent
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {formLoading ? 'Sending...' : 'Send Message'}
                  </button>
                  {formSuccess && (
                    <p className="mt-2 text-sm text-green-600">
                      Your message has been sent! The agent will contact you soon.
                    </p>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 