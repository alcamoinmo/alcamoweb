'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ContactFormProps {
  propertyId: number | string;
  propertyTitle: string;
  agentName: string;
  agentEmail: string;
  onClose?: () => void;
}

export default function ContactForm({
  propertyId,
  propertyTitle,
  agentName,
  agentEmail,
  onClose,
}: ContactFormProps) {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('inquiries').insert({
        property_id: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'new',
      });

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(
        'Error al enviar el mensaje. Por favor intenta de nuevo más tarde.'
      );
      console.error('Error submitting inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-brand-white p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-brand-gray-900">
            ¡Mensaje enviado!
          </h3>
          <p className="mt-2 text-sm text-brand-gray-500">
            Gracias por tu interés. {agentName} te contactará pronto.
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
          Solicitar información
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

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-brand-gray-700"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
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
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>
      </form>
    </div>
  );
} 