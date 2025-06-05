'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tab } from '@headlessui/react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { StatusUpdateButton } from '@/components/agent/StatusUpdateButton';
import type { Property } from '@/types/property';
import type { Lead, Inquiry, Visit, LeadStatus, InquiryStatus, VisitStatus } from '@/types/agent';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch agent's properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .eq('agent_id', user.id);

        if (propertiesError) throw propertiesError;
        setProperties(propertiesData || []);

        // Fetch agent's leads
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select(`
            *,
            property:properties(*)
          `)
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false });

        if (leadsError) throw leadsError;
        setLeads(leadsData || []);

        // Fetch agent's inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('inquiries')
          .select(`
            *,
            property:properties(*)
          `)
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false });

        if (inquiriesError) throw inquiriesError;
        setInquiries(inquiriesData || []);

        // Fetch agent's visits
        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select(`
            *,
            property:properties(*),
            lead:leads(*),
            inquiry:inquiries(*)
          `)
          .eq('agent_id', user.id)
          .order('visit_date', { ascending: true });

        if (visitsError) throw visitsError;
        setVisits(visitsData || []);

      } catch (err) {
        console.error('Error fetching agent data:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [router, supabase]);

  const handleLeadStatusUpdate = (leadId: string, newStatus: LeadStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleInquiryStatusUpdate = (inquiryId: string, newStatus: InquiryStatus) => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    ));
  };

  const handleVisitStatusUpdate = (visitId: string, newStatus: VisitStatus) => {
    setVisits(visits.map(visit => 
      visit.id === visitId ? { ...visit, status: newStatus } : visit
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Agente</h1>
          <a
            href="/agente/perfil"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Editar Perfil
          </a>
        </div>

        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              Propiedades
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              Leads
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              Consultas
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              Visitas
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Properties Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
                {properties.length === 0 && (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    No tienes propiedades publicadas.
                  </p>
                )}
              </div>
            </Tab.Panel>

            {/* Leads Panel */}
            <Tab.Panel>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <li key={lead.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {lead.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {lead.email} {lead.phone && `• ${lead.phone}`}
                            </p>
                            {lead.property && (
                              <p className="mt-1 text-sm text-gray-900">
                                Propiedad: {lead.property.title}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <StatusUpdateButton
                              id={lead.id}
                              type="lead"
                              currentStatus={lead.status}
                              onStatusUpdate={(newStatus) => handleLeadStatusUpdate(lead.id, newStatus as LeadStatus)}
                            />
                          </div>
                        </div>
                        {lead.message && (
                          <p className="mt-2 text-sm text-gray-500">
                            {lead.message}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                  {leads.length === 0 && (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No hay leads disponibles.
                    </li>
                  )}
                </ul>
              </div>
            </Tab.Panel>

            {/* Inquiries Panel */}
            <Tab.Panel>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <li key={inquiry.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {inquiry.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {inquiry.email} {inquiry.phone && `• ${inquiry.phone}`}
                            </p>
                            {inquiry.property && (
                              <p className="mt-1 text-sm text-gray-900">
                                Propiedad: {inquiry.property.title}
                              </p>
                            )}
                            {inquiry.preferred_date && inquiry.preferred_time && (
                              <p className="mt-1 text-sm text-gray-500">
                                Fecha preferida: {new Date(inquiry.preferred_date).toLocaleDateString()} a las {inquiry.preferred_time}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <StatusUpdateButton
                              id={inquiry.id}
                              type="inquiry"
                              currentStatus={inquiry.status}
                              onStatusUpdate={(newStatus) => handleInquiryStatusUpdate(inquiry.id, newStatus as InquiryStatus)}
                            />
                          </div>
                        </div>
                        {inquiry.message && (
                          <p className="mt-2 text-sm text-gray-500">
                            {inquiry.message}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                  {inquiries.length === 0 && (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No hay consultas disponibles.
                    </li>
                  )}
                </ul>
              </div>
            </Tab.Panel>

            {/* Visits Panel */}
            <Tab.Panel>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {visits.map((visit) => (
                    <li key={visit.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {visit.lead?.name || visit.inquiry?.name || 'Visitante'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {visit.lead?.email || visit.inquiry?.email}
                              {(visit.lead?.phone || visit.inquiry?.phone) && 
                                ` • ${visit.lead?.phone || visit.inquiry?.phone}`}
                            </p>
                            {visit.property && (
                              <p className="mt-1 text-sm text-gray-900">
                                Propiedad: {visit.property.title}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                              Fecha: {new Date(visit.visit_date).toLocaleDateString()} a las {visit.visit_time}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <StatusUpdateButton
                              id={visit.id}
                              type="visit"
                              currentStatus={visit.status}
                              onStatusUpdate={(newStatus) => handleVisitStatusUpdate(visit.id, newStatus as VisitStatus)}
                            />
                          </div>
                        </div>
                        {visit.notes && (
                          <p className="mt-2 text-sm text-gray-500">
                            {visit.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                  {visits.length === 0 && (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No hay visitas programadas.
                    </li>
                  )}
                </ul>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 