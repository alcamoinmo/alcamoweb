import { useState } from 'react';
import { MapIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import PropertyMap from '@/components/maps/PropertyMap';
import type { Property } from '@/types/property';

interface PropertyViewToggleProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

export default function PropertyViewToggle({
  properties,
  onPropertyClick,
}: PropertyViewToggleProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Calculate the center point of all properties for the map
  const center = properties.length > 0
    ? {
        lat: properties.reduce((sum, p) => sum + (p.latitude || 0), 0) / properties.length,
        lng: properties.reduce((sum, p) => sum + (p.longitude || 0), 0) / properties.length,
      }
    : { lat: 19.4326, lng: -99.1332 }; // Default to Mexico City

  return (
    <div className="space-y-4">
      {/* View Toggle Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
            viewMode === 'grid'
              ? 'bg-brand-accent text-brand-white'
              : 'bg-brand-white text-brand-gray-900 hover:bg-brand-gray-50'
          }`}
        >
          <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
          <span className="ml-2">Vista de Cuadrícula</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
            viewMode === 'map'
              ? 'bg-brand-accent text-brand-white'
              : 'bg-brand-white text-brand-gray-900 hover:bg-brand-gray-50'
          }`}
        >
          <MapIcon className="h-5 w-5" aria-hidden="true" />
          <span className="ml-2">Vista de Mapa</span>
        </button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-brand-gray-200 bg-brand-white"
              onClick={() => onPropertyClick?.(property)}
            >
              <div className="aspect-h-3 aspect-w-4 bg-brand-gray-200 sm:aspect-none sm:h-48">
                <img
                  src={property.images?.[0] || '/images/placeholder.jpg'}
                  alt={property.title}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-brand-gray-900">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {property.title}
                </h3>
                <p className="text-sm text-brand-gray-500">{property.address}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-brand-accent">
                    ${property.price.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-brand-gray-500">
                    <span>{property.bedrooms} hab</span>
                    <span>•</span>
                    <span>{property.bathrooms} baños</span>
                    {property.area && (
                      <>
                        <span>•</span>
                        <span>{property.area}m²</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="h-[600px] w-full rounded-lg overflow-hidden border border-brand-gray-200">
          <PropertyMap
            latitude={center.lat}
            longitude={center.lng}
            markers={properties.map((property) => ({
              lat: property.latitude || 0,
              lng: property.longitude || 0,
              title: property.title,
              address: property.address,
              onClick: () => onPropertyClick?.(property),
            }))}
            zoom={12}
            height="100%"
          />
        </div>
      )}
    </div>
  );
} 