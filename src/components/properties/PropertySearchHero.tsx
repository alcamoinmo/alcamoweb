import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, HomeIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const propertyTypes = [
  { id: 'casa', name: 'Casa' },
  { id: 'departamento', name: 'Departamento' },
  { id: 'terreno', name: 'Terreno' },
  { id: 'local', name: 'Local Comercial' },
];

const transactionTypes = [
  { id: 'venta', name: 'Comprar' },
  { id: 'renta', name: 'Rentar' },
];

export default function PropertySearchHero() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: '',
    type: '',
    transaction: 'venta',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    router.push(`/propiedades/buscar?${queryParams.toString()}`);
  };

  return (
    <div className="relative bg-brand-white py-16">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-brand-gray-900 mb-4">
            Encuentra tu hogar ideal en Aguascalientes
          </h1>
          <p className="text-xl text-brand-gray-600 max-w-2xl mx-auto">
            Explora las mejores propiedades en venta y renta en la ciudad
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <div className="bg-brand-white rounded-lg shadow-lg p-6">
            {/* Transaction Type Tabs */}
            <div className="flex space-x-4 mb-6">
              {transactionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSearchParams({ ...searchParams, transaction: type.id })}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchParams.transaction === type.id
                      ? 'bg-brand-accent text-brand-white'
                      : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Location */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ubicación"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HomeIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
                <select
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                >
                  <option value="">Tipo de Propiedad</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Precio Mín"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                />
                <input
                  type="number"
                  placeholder="Precio Máx"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={searchParams.bedrooms}
                  onChange={(e) => setSearchParams({ ...searchParams, bedrooms: e.target.value })}
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                >
                  <option value="">Recámaras</option>
                  {[1, 2, 3, 4, 5, '6+'].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === '6+' ? 'o más' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={searchParams.bathrooms}
                  onChange={(e) => setSearchParams({ ...searchParams, bathrooms: e.target.value })}
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                >
                  <option value="">Baños</option>
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === '5+' ? 'o más' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-brand-accent text-brand-white py-3 px-4 rounded-md hover:bg-brand-accent-dark transition-colors flex items-center justify-center space-x-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Buscar Propiedades</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 