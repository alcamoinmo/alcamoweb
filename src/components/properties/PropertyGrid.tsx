import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  type: string;
  status: 'venta' | 'renta';
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  imageUrl: string;
  features: string[];
}

interface PropertyGridProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
}

export default function PropertyGrid({ properties, viewMode = 'grid' }: PropertyGridProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/propiedades/${property.id}`}
            className="block bg-brand-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-64 h-48 md:h-auto">
                <Image
                  src={property.imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-brand-gray-900 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-brand-accent font-semibold mb-4">
                      {formatPrice(property.price, property.currency)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(property.id);
                    }}
                    className="p-2 text-brand-gray-400 hover:text-brand-accent"
                  >
                    {favorites.includes(property.id) ? (
                      <HeartIconSolid className="h-6 w-6 text-brand-accent" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div className="flex items-center text-brand-gray-600 mb-4">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-brand-gray-600">
                    <HomeIcon className="h-5 w-5 mr-2" />
                    <span>{property.type}</span>
                  </div>
                  <div className="flex items-center text-brand-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    <span>{property.status === 'venta' ? 'En venta' : 'En renta'}</span>
                  </div>
                  <div className="text-brand-gray-600">
                    {property.bedrooms} {property.bedrooms === 1 ? 'Recámara' : 'Recámaras'}
                  </div>
                  <div className="text-brand-gray-600">
                    {property.bathrooms} {property.bathrooms === 1 ? 'Baño' : 'Baños'}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/propiedades/${property.id}`}
          className="group bg-brand-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property.id);
              }}
              className="absolute top-2 right-2 p-2 bg-brand-white rounded-full shadow-sm hover:bg-brand-gray-50"
            >
              {favorites.includes(property.id) ? (
                <HeartIconSolid className="h-5 w-5 text-brand-accent" />
              ) : (
                <HeartIcon className="h-5 w-5 text-brand-gray-400" />
              )}
            </button>
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-accent text-brand-white">
                {property.status === 'venta' ? 'En venta' : 'En renta'}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-montserrat font-semibold text-brand-gray-900 mb-2">
              {property.title}
            </h3>
            <p className="text-brand-accent font-semibold mb-2">
              {formatPrice(property.price, property.currency)}
            </p>
            <div className="flex items-center text-brand-gray-600 text-sm mb-4">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-brand-gray-500">
              <div className="flex items-center space-x-4">
                <span>{property.type}</span>
                <span>•</span>
                <span>{property.bedrooms} rec</span>
                <span>•</span>
                <span>{property.bathrooms} baños</span>
              </div>
              <span>{property.area} {property.areaUnit}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-800"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-800">
                  +{property.features.length - 3}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 