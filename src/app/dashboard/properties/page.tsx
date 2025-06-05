'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase/config'
import type { Database } from '../../../lib/types/supabase'
import Link from 'next/link'
import Image from 'next/image'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

type Property = Database['public']['Tables']['properties']['Row'] & {
  property_media: Database['public']['Tables']['property_media']['Row'][]
  agent: Database['public']['Tables']['users']['Row']
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*),
          agent:users!properties_agent_id_fkey (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (propertyId: string, newStatus: Property['status']) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId)

      if (error) throw error
      fetchProperties()
    } catch (error) {
      console.error('Error updating property status:', error)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error
      fetchProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
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
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all properties in your real estate portfolio.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/properties/new"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Property
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Property
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Agent
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-200 bg-brand-white">
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {property.property_media?.[0] ? (
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={property.property_media[0].url}
                                alt=""
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{property.title}</div>
                            <div className="text-gray-500">{property.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property.id, e.target.value as Property['status'])}
                          className="rounded-md border-gray-300 text-sm"
                        >
                          <option value="FOR_SALE">For Sale</option>
                          <option value="FOR_RENT">For Rent</option>
                          <option value="SOLD">Sold</option>
                          <option value="RENTED">Rented</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: property.currency,
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {property.agent.avatar_url ? (
                            <Image
                              className="h-8 w-8 rounded-full"
                              src={property.agent.avatar_url}
                              alt=""
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-500">
                                {property.agent.full_name[0]}
                              </span>
                            </div>
                          )}
                          <span className="ml-2">{property.agent.full_name}</span>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/properties/${property.id}`}
                            className="text-brand-accent hover:text-brand-accent-dark"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">Ver</span>
                          </Link>
                          <Link
                            href={`/dashboard/properties/${property.id}/edit`}
                            className="text-brand-accent hover:text-brand-accent-dark"
                          >
                            <PencilIcon className="h-5 w-5" />
                            <span className="sr-only">Editar</span>
                          </Link>
                          <button
                            onClick={() => setSelectedProperty(Number(property.id))}
                            className="text-brand-red-600 hover:text-brand-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedProperty && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Eliminar Propiedad
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar esta propiedad? Esta
                        acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      // Handle delete
                      setSelectedProperty(null)
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setSelectedProperty(null)}
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
  )
} 