'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const propertyTypes = [
  { id: 'house', name: 'Casa' },
  { id: 'apartment', name: 'Departamento' },
  { id: 'land', name: 'Terreno' },
  { id: 'commercial', name: 'Local Comercial' },
]

const propertyStatus = [
  { id: 'for_sale', name: 'En Venta' },
  { id: 'for_rent', name: 'En Renta' },
  { id: 'sold', name: 'Vendida' },
  { id: 'rented', name: 'Rentada' },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    price: '',
    address: '',
    city: 'Aguascalientes',
    state: 'Aguascalientes',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    features: [] as string[],
    images: [] as File[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement property creation with Supabase
      // const { data, error } = await supabase
      //   .from('properties')
      //   .insert([
      //     {
      //       ...formData,
      //       user_id: user?.id,
      //       created_at: new Date().toISOString(),
      //     },
      //   ])

      // if (error) throw error

      router.push('/dashboard/properties')
    } catch (err) {
      setError('Error al crear la propiedad. Por favor intenta de nuevo.')
      console.error('Error creating property:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files || [])],
      }))
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-gray-900">
          Nueva Propiedad
        </h1>
        <p className="mt-1 text-sm text-brand-gray-500">
          Completa el formulario para agregar una nueva propiedad al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-brand-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-brand-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-base font-semibold text-brand-gray-900">
              Información Básica
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Tipo de Propiedad
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                >
                  <option value="">Seleccionar tipo</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                >
                  <option value="">Seleccionar estado</option>
                  {propertyStatus.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Precio
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                  placeholder="Ej: $2,500,000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-brand-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <h2 className="text-base font-semibold text-brand-gray-900">
              Ubicación
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Código Postal
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="text-base font-semibold text-brand-gray-900">
              Detalles
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Habitaciones
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Baños
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  required
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Área (m²)
                </label>
                <input
                  type="number"
                  name="area"
                  id="area"
                  required
                  min="0"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-base font-semibold text-brand-gray-900">
              Imágenes
            </h2>
            <div className="mt-4">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-brand-gray-700"
              >
                Subir imágenes
              </label>
              <input
                type="file"
                name="images"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-brand-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-accent file:text-brand-white
                  hover:file:bg-brand-accent-dark"
              />
              <p className="mt-2 text-sm text-brand-gray-500">
                Puedes seleccionar múltiples imágenes. Formatos permitidos: JPG,
                PNG, GIF.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-brand-gray-300 bg-brand-white px-4 py-2 text-sm font-semibold text-brand-gray-900 shadow-sm hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
} 