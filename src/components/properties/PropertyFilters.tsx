'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export interface FilterState {
  type: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const propertyTypes = [
  { id: 'casa', name: 'Casa' },
  { id: 'departamento', name: 'Departamento' },
  { id: 'terreno', name: 'Terreno' },
  { id: 'local', name: 'Local Comercial' },
  { id: 'oficina', name: 'Oficina' },
];

const features = [
  { id: 'estacionamiento', name: 'Estacionamiento' },
  { id: 'seguridad', name: 'Seguridad 24/7' },
  { id: 'alberca', name: 'Alberca' },
  { id: 'jardin', name: 'Jardín' },
  { id: 'terraza', name: 'Terraza' },
  { id: 'amueblado', name: 'Amueblado' },
];

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const applyFilters = () => {
    // Actualizar la URL con los filtros
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);

    router.push(`/propiedades?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
    });
    router.push('/propiedades');
    onFilterChange(filters);
  };

  return (
    <>
      {/* Mobile filter dialog */}
      <div className="lg:hidden">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-gray-700 bg-brand-white border border-brand-gray-300 rounded-md hover:bg-brand-gray-50"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          Filtros
        </button>
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <div className="bg-brand-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Property Type */}
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
                value={filters.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="house">Casa</option>
                <option value="apartment">Departamento</option>
                <option value="commercial">Comercial</option>
                <option value="land">Terreno</option>
              </select>
            </div>

            {/* Status */}
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
                value={filters.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="for_sale">En Venta</option>
                <option value="for_rent">En Renta</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="Min"
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-sm font-medium text-brand-gray-700"
                >
                  Precio Máximo
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="Max"
                  className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-brand-gray-700"
              >
                Habitaciones
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-brand-gray-700"
              >
                Baños
              </label>
              <select
                id="bathrooms"
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter dialog */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-brand-white px-4 py-6 sm:max-w-sm sm:ring-1 sm:ring-brand-gray-900/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-brand-gray-900">Filtros</h2>
              <button
                type="button"
                className="-mr-2 rounded-md p-2 text-brand-gray-400 hover:text-brand-gray-500"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Mobile filter content - same as desktop but in a scrollable container */}
            <div className="mt-4 flow-root">
              <div className="space-y-6">
                {/* Copy all the filter sections from above */}
                {/* ... */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 