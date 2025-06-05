'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { LeadStatus, InquiryStatus, VisitStatus } from '@/types/agent';

interface StatusUpdateButtonProps {
  id: string;
  type: 'lead' | 'inquiry' | 'visit';
  currentStatus: LeadStatus | InquiryStatus | VisitStatus;
  onStatusUpdate: (newStatus: LeadStatus | InquiryStatus | VisitStatus) => void;
}

const statusOptions = {
  lead: [
    { value: 'new', label: 'Nuevo' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'qualified', label: 'Calificado' },
    { value: 'converted', label: 'Convertido' },
    { value: 'lost', label: 'Perdido' },
  ],
  inquiry: [
    { value: 'new', label: 'Nueva' },
    { value: 'contacted', label: 'Contactada' },
    { value: 'scheduled', label: 'Agendada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
  ],
  visit: [
    { value: 'scheduled', label: 'Agendada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'no_show', label: 'No asistió' },
  ],
} as const;

const statusColors = {
  lead: {
    new: 'bg-green-100 text-green-800',
    contacted: 'bg-blue-100 text-blue-800',
    qualified: 'bg-yellow-100 text-yellow-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-gray-100 text-gray-800',
  },
  inquiry: {
    new: 'bg-green-100 text-green-800',
    contacted: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  },
  visit: {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-yellow-100 text-yellow-800',
  },
} as const;

export function StatusUpdateButton({ id, type, currentStatus, onStatusUpdate }: StatusUpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClientComponentClient();

  const handleStatusUpdate = async (newStatus: LeadStatus | InquiryStatus | VisitStatus) => {
    if (isUpdating || newStatus === currentStatus) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from(type + 's')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      onStatusUpdate(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const options = statusOptions[type];
  const colors = statusColors[type];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          disabled={isUpdating}
          className={`
            inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${colors[currentStatus as keyof typeof colors]}
            ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
          `}
        >
          {options.find(opt => opt.value === currentStatus)?.label}
          <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusUpdate(option.value as any)}
                    disabled={isUpdating || option.value === currentStatus}
                    className={`
                      ${active ? 'bg-gray-100' : ''}
                      ${option.value === currentStatus ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'text-gray-700'}
                      block w-full px-4 py-2 text-left text-sm
                    `}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 