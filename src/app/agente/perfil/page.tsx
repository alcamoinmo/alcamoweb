'use client';

import React from "react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Agent } from '@/types/agent';

export default function AgentProfile() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', user.id)
          .single();

        if (agentError) throw agentError;
        setAgent(agentData);
      } catch (err) {
        console.error('Error fetching agent profile:', err);
        setError('Error al cargar el perfil. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProfile();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agent) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('agents')
        .update({
          name: agent.name,
          phone: agent.phone,
        })
        .eq('id', agent.id);

      if (updateError) throw updateError;

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: agent.name }
      });

      if (authError) throw authError;

      setSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      console.error('Error updating agent profile:', err);
      setError('Error al actualizar el perfil. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">No se encontró el perfil del agente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Perfil de Agente</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={agent.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              El correo electrónico no se puede modificar.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={agent.name}
              onChange={(e) => setAgent({ ...agent, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              value={agent.phone || ''}
              onChange={(e) => setAgent({ ...agent, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`
                inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white
                ${saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }
              `}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 