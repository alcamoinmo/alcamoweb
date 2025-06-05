'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ScheduleVisitFormProps {
  propertyId: number | string;
  propertyTitle: string;
  agentName: string;
  agentEmail: string;
  onClose?: () => void;
}

export default function ScheduleVisitForm({
  propertyId,
  propertyTitle,
  agentName,
  agentEmail,
  onClose,
}: ScheduleVisitFormProps) {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('visits').insert({
        property_id: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        notes: formData.notes,
        status: 'pending',
      });

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      });
    } catch (err) {
      setError(
        'Error al programar la visita. Por favor intenta de nuevo más tarde.'
      );
      console.error('Error scheduling visit:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-brand-white p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-brand-gray-900">
            ¡Visita programada!
          </h3>
          <p className="mt-2 text-sm text-brand-gray-500">
            Gracias por tu interés. {agentName} te contactará pronto para confirmar la cita.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 inline-flex justify-center rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-white hover:bg-brand-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-brand-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-brand-gray-900">
          Programar visita
        </h3>
        <p className="mt-1 text-sm text-brand-gray-500">
          {propertyTitle}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-brand-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-brand-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-brand-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-brand-gray-700"
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="preferredDate"
              className="block text-sm font-medium text-brand-gray-700"
            >
              Fecha preferida
            </label>
            <div className="relative mt-1">
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.preferredDate}
                onChange={handleChange}
                className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="preferredTime"
              className="block text-sm font-medium text-brand-gray-700"
            >
              Hora preferida
            </label>
            <div className="relative mt-1">
              <select
                id="preferredTime"
                name="preferredTime"
                required
                value={formData.preferredTime}
                onChange={handleChange}
                className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
              >
                <option value="">Seleccionar hora</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
              <ClockIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-brand-gray-700"
          >
            Notas adicionales
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
            placeholder="¿Hay algo más que debamos saber?"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-brand-gray-300 bg-brand-white px-4 py-2 text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-white hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Programar visita'}
          </button>
        </div>
      </form>
    </div>
  );
} 