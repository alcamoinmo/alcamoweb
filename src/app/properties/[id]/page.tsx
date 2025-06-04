'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../../../lib/supabase/client'
import type { Database } from '../../../lib/types/supabase'
import { useAuth } from '../../../lib/hooks/useAuth'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyWithDetails = Property & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
  agent: Database['public']['Tables']['users']['Row']
}

export default function PropertyPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*),
          agent:users!properties_agent_id_fkey (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProperty(data)
      if (data?.property_media?.[0]) {
        setSelectedImage(data.property_media[0].url)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!property) return

    const form = e.currentTarget
    const formData = new FormData(form)

    setSubmitting(true)
    try {
      const { error } = await supabase.from('leads').insert([
        {
          full_name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          message: formData.get('message') as string,
          property_id: property.id,
          assigned_agent_id: property.agent_id,
          status: 'NEW',
        },
      ])

      if (error) throw error
      setShowContactForm(false)
      alert('Thank you! The agent will contact you soon.')
      form.reset()
    } catch (error) {
      console.error('Error submitting lead:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold">Property not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Images */}
          <div className="lg:max-w-lg">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {property.property_media.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {property.property_media.map((media) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedImage(media.url)}
                    className={`aspect-w-1 aspect-h-1 relative overflow-hidden rounded-lg ${
                      selectedImage === media.url ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={media.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property details */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{property.title}</h1>
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: property.currency,
                  maximumFractionDigits: 0,
                }).format(property.price)}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Details</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Type</p>
                  <p className="mt-1">{property.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Status</p>
                  <p className="mt-1">{property.status}</p>
                </div>
                {property.bedrooms && (
                  <div>
                    <p className="font-medium text-gray-500">Bedrooms</p>
                    <p className="mt-1">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <p className="font-medium text-gray-500">Bathrooms</p>
                    <p className="mt-1">{property.bathrooms}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-500">Area</p>
                  <p className="mt-1">
                    {property.area_size} {property.area_unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-4 whitespace-pre-wrap text-gray-700">{property.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Location</h2>
              <p className="mt-4 text-gray-700">
                {property.address}
                <br />
                {property.city}, {property.state} {property.postal_code}
              </p>
            </div>

            {property.features?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Features</h2>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-blue-600"
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Contact Agent
                </button>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      defaultValue={user?.full_name || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      defaultValue={user?.email || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      defaultValue={user?.phone || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      required
                      defaultValue={`I'm interested in this ${property.type.toLowerCase()} at ${property.address}`}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 rounded-md bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 