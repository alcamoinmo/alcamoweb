'use client';

import { useState, useEffect } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  propertyId: number | string;
  className?: string;
}

export default function FavoriteButton({
  propertyId,
  className = '',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkFavoriteStatus();
  }, [propertyId]);

  const checkFavoriteStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('is_property_favorited', { property_id: propertyId });

      if (error) throw error;
      setIsFavorited(data);
    } catch (err) {
      console.error('Error checking favorite status:', err);
      setError('Error al verificar el estado del favorito');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: session.user.id, property_id: propertyId });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: session.user.id, property_id: propertyId });

        if (error) throw error;
      }

      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error al actualizar el favorito');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center rounded-full p-2 text-brand-gray-400 hover:bg-brand-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${className}`}
      >
        <HeartOutline className="h-6 w-6 animate-pulse" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`inline-flex items-center rounded-full p-2 ${
        isFavorited
          ? 'text-brand-accent hover:text-brand-accent-dark'
          : 'text-brand-gray-400 hover:text-brand-gray-500'
      } hover:bg-brand-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${className}`}
      title={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorited ? (
        <HeartSolid className="h-6 w-6" aria-hidden="true" />
      ) : (
        <HeartOutline className="h-6 w-6" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </span>
    </button>
  );
} 