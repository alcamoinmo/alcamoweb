'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Property } from '@/types/property';
import PropertyViewToggle from '@/components/properties/PropertyViewToggle';

interface FavoriteWithProperty {
  property: Property;
}

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          property:properties (
            id,
            title,
            description,
            type,
            status,
            price,
            address,
            city,
            state,
            zip_code,
            latitude,
            longitude,
            bedrooms,
            bathrooms,
            area,
            features,
            images,
            created_at,
            agent:agents (
              id,
              name,
              email,
              phone
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the Property type
      const favoriteProperties = (data as unknown as FavoriteWithProperty[]).map(
        (item) => item.property
      );

      setProperties(favoriteProperties);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Error al cargar los favoritos');
    } finally {
      setLoading(false);
    }
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
                Error al cargar los favoritos
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-gray-900">
          Mis Favoritos
        </h1>
        <p className="mt-2 text-sm text-brand-gray-500">
          Propiedades que has guardado como favoritas
        </p>
      </div>

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
            No tienes propiedades favoritas
          </h3>
          <p className="mt-1 text-sm text-brand-gray-500">
            Explora nuestras propiedades y agrega tus favoritas.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push('/propiedades')}
              className="inline-flex items-center rounded-md bg-brand-accent px-3 py-2 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Ver Propiedades
            </button>
          </div>
        </div>
      ) : (
        <PropertyViewToggle
          properties={properties}
          onPropertyClick={handlePropertyClick}
        />
      )}
    </div>
  );
} 