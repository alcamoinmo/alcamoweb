'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Property } from '@/types/property';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyViewToggle from '@/components/properties/PropertyViewToggle';

interface FilterState {
  type: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

export default function PropertiesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('*, agent:agents(*)')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseInt(filters.maxPrice));
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', parseInt(filters.bathrooms));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      setError('Error al cargar las propiedades');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePropertyClick = (property: Property) => {
    router.push(`/propiedades/${property.id}`);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar las propiedades
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Filters */}
        <PropertyFilters onFilterChange={handleFilterChange} />

        {/* Properties Grid/Map */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-brand-gray-200 bg-brand-white p-4"
              >
                <div className="aspect-h-3 aspect-w-4 bg-brand-gray-200 sm:aspect-none sm:h-48" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-brand-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-brand-gray-200" />
                  <div className="h-4 w-1/4 rounded bg-brand-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-brand-gray-900">
              No se encontraron propiedades
            </h3>
            <p className="mt-1 text-sm text-brand-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <PropertyViewToggle
            properties={properties}
            onPropertyClick={handlePropertyClick}
          />
        )}
      </div>
    </div>
  );
} 