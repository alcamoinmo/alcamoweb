'use client'

import React from "react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth/AuthProvider'
import PropertyMap from '@/components/maps/PropertyMap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

interface Property {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  created_at: string;
  updated_at: string;
  images: string[];
  agent: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Visit {
  id: number;
  client: string;
  date: string;
  time: string;
  status: string;
}

const propertyImages = [
  '/images/properties/property-1.jpg',
  '/images/properties/property-2.jpg',
  '/images/properties/property-3.jpg',
]

const propertyDetails = {
  id: 1,
  title: 'Casa en Residencial Campestre',
  description:
    'Hermosa casa en venta en Residencial Campestre. Amplia, moderna y con excelente ubicación. Cuenta con 4 habitaciones, 3 baños, cocina integral, sala de estar, comedor, jardín y cochera para 2 autos.',
  type: 'Casa',
  status: 'En Venta',
  price: '$2,500,000',
  address: 'Av. Principal #123',
  city: 'Aguascalientes',
  state: 'Aguascalientes',
  zipCode: '20100',
  bedrooms: 4,
  bathrooms: 3,
  area: 250,
  features: [
    'Cocina Integral',
    'Jardín',
    'Cochera',
    'Seguridad 24/7',
    'Área de Juegos',
    'Alberca',
  ],
  createdAt: '2024-03-15',
  updatedAt: '2024-03-15',
  agent: {
    name: 'Juan Pérez',
    email: 'juan@alcamo.com',
    phone: '(449) 123-4567',
  },
  visits: [
    {
      id: 1,
      client: 'María González',
      date: '2024-03-20',
      time: '15:00',
      status: 'Programada',
    },
    {
      id: 2,
      client: 'Carlos Rodríguez',
      date: '2024-03-21',
      time: '11:00',
      status: 'Programada',
    },
  ],
}

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()
  const [property, setProperty] = useState<Property | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*, agent:agents(name, email, phone)')
          .eq('id', params.id)
          .single()

        if (propertyError) throw propertyError

        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .eq('property_id', params.id)
          .order('date', { ascending: true })

        if (visitsError) throw visitsError

        setProperty(propertyData)
        setVisits(visitsData)
        setLoading(false)
      } catch (err) {
        setError('Error al cargar la propiedad. Por favor intenta de nuevo.')
        console.error('Error fetching property:', err)
        setLoading(false)
      }
    }

    if (user) {
      fetchProperty()
    }
  }, [params.id, user, supabase])

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/properties')
    } catch (err) {
      setError('Error al eliminar la propiedad. Por favor intenta de nuevo.')
      console.error('Error deleting property:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-brand-gray-900">
            Cargando propiedad...
          </h2>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="rounded-md bg-brand-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-brand-red-800">
              {error || 'Propiedad no encontrada'}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-gray-900">
            {property.title}
          </h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            ID: {property.id} · Creada el{' '}
            {new Date(property.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/dashboard/properties/${params.id}/edit`}
            className="inline-flex items-center rounded-md bg-brand-white px-3 py-2 text-sm font-semibold text-brand-gray-900 shadow-sm ring-1 ring-inset ring-brand-gray-300 hover:bg-brand-gray-50"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center rounded-md bg-brand-red-600 px-3 py-2 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-red-500"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-brand-gray-100">
          <Image
            src={property.images[selectedImage] || '/images/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${
                selectedImage === index
                  ? 'ring-2 ring-brand-accent'
                  : 'ring-1 ring-brand-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${property.title} - Imagen ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Información Básica
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-brand-gray-500">
                    Tipo de Propiedad
                  </p>
                  <p className="mt-1 text-sm text-brand-gray-900">
                    {property.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-gray-500">
                    Estado
                  </p>
                  <p className="mt-1 text-sm text-brand-gray-900">
                    {property.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-gray-500">
                    Precio
                  </p>
                  <p className="mt-1 text-sm text-brand-gray-900">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-gray-500">
                    Área Total
                  </p>
                  <p className="mt-1 text-sm text-brand-gray-900">
                    {property.area}m²
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Descripción
              </h2>
              <p className="mt-4 text-sm text-brand-gray-500">
                {property.description}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Ubicación
              </h2>
              <div className="mt-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-brand-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm text-brand-gray-900">
                      {property.address}
                    </p>
                    <p className="text-sm text-brand-gray-500">
                      {property.city}, {property.state} {property.zip_code}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    title={property.title}
                    address={property.address}
                    height="300px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Características
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {property.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center text-sm text-brand-gray-500"
                  >
                    <HomeIcon className="h-5 w-5 text-brand-gray-400" />
                    <span className="ml-2">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Agent Info */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Agente Responsable
              </h2>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-brand-gray-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-brand-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-brand-gray-900">
                      {property.agent.name}
                    </p>
                    <p className="text-sm text-brand-gray-500">
                      {property.agent.email}
                    </p>
                    <p className="text-sm text-brand-gray-500">
                      {property.agent.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visits */}
          <div className="rounded-lg bg-brand-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-brand-gray-900">
                Próximas Visitas
              </h2>
              <div className="mt-4 space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-start space-x-3 rounded-lg border border-brand-gray-200 p-3"
                  >
                    <CalendarIcon className="h-5 w-5 text-brand-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-brand-gray-900">
                        {visit.client}
                      </p>
                      <p className="text-sm text-brand-gray-500">
                        {visit.date} a las {visit.time}
                      </p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-brand-green-50 px-2 py-1 text-xs font-medium text-brand-green-700">
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-brand-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-brand-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon
                      className="h-6 w-6 text-brand-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-brand-gray-900">
                      Eliminar Propiedad
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-brand-gray-500">
                        ¿Estás seguro de que deseas eliminar esta propiedad? Esta
                        acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-brand-red-600 px-3 py-2 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-brand-white px-3 py-2 text-sm font-semibold text-brand-gray-900 shadow-sm ring-1 ring-inset ring-brand-gray-300 hover:bg-brand-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 