'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PropertyMap from '@/components/maps/PropertyMap';
import {
  MapPinIcon,
  HomeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import ContactForm from '@/components/properties/ContactForm';
import ShareButtons from '@/components/properties/ShareButtons';
import ScheduleVisitForm from '@/components/properties/ScheduleVisitForm';
import FavoriteButton from '@/components/properties/FavoriteButton';
import type { Property } from '@/types/property';
import { trackPropertyView } from '@/components/analytics/GoogleAnalytics';
import MainLayout from '@/components/layout/MainLayout';

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClientComponentClient();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScheduleVisit, setShowScheduleVisit] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            agent:agents (
              id,
              name,
              email,
              phone,
              avatar_url
            )
          `)
          .eq('id', Number(params.id))
          .single();

        if (error) throw error;
        if (data) {
          setProperty(data as Property);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Error al cargar la propiedad');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [params.id, supabase]);

  useEffect(() => {
    if (property) {
      trackPropertyView(property.id, property.title);
    }
  }, [property]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-600 text-center">{error || 'Propiedad no encontrada'}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Property Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="mt-2 text-lg text-gray-600">{property.location}</p>
            </div>
            <div className="flex items-center space-x-4">
              <FavoriteButton propertyId={String(property.id)} />
              <ShareButtons
                propertyId={String(property.id)}
                propertyTitle={property.title}
                propertyUrl={typeof window !== 'undefined' ? window.location.href : ''}
              />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <Image
              src={property.images[0] || '/images/placeholder.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Descripción</h2>
                <p className="mt-4 text-gray-600">{property.description}</p>
              </div>

              {/* Property Features */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Características</h2>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                      {property.type === 'house' ? 'Casa' : property.type === 'apartment' ? 'Departamento' : 'Comercial'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                      {property.status === 'for_sale' ? 'En Venta' : 'En Renta'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Precio</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {property.status === 'for_sale'
                        ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(property.price)
                        : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(property.price) + ' /mes'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Área</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{property.area} m²</dd>
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500">Recámaras</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">{property.bedrooms}</dd>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Baños</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{property.bathrooms}</dd>
                  </div>
                </dl>
              </div>

              {/* Location Map */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Ubicación</h2>
                <div className="mt-4 h-96 rounded-lg overflow-hidden">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    markers={[{
                      lat: property.latitude,
                      lng: property.longitude,
                      title: property.title,
                    }]}
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              {property.agent && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-900">Agente</h2>
                  <div className="mt-4 flex items-center space-x-4">
                    {property.agent.avatar_url ? (
                      <Image
                        src={property.agent.avatar_url}
                        alt={property.agent.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{property.agent.name}</p>
                      <p className="text-sm text-gray-500">{property.agent.email}</p>
                      <p className="text-sm text-gray-500">{property.agent.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900">Contactar</h2>
                <ContactForm propertyId={String(property.id)} propertyTitle={property.title} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900">Agendar Visita</h2>
                <ScheduleVisitForm
                  propertyId={String(property.id)}
                  propertyTitle={property.title}
                  agentName={property.agent?.name || ''}
                  agentEmail={property.agent?.email || ''}
                  onClose={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 