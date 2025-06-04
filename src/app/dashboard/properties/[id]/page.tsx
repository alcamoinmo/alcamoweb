'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../../lib/hooks/useAuth'
import { supabase } from '../../../../lib/supabase/config'
import type { Database } from '../../../../lib/types/supabase'
import PropertyForm from '../../../../components/properties/PropertyForm'

type Property = Database['public']['Tables']['properties']['Row']

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchProperty()
    }
  }, [user, params.id])

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (err) {
      console.error('Error fetching property:', err)
      setError('Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Not authenticated</h2>
          <p className="mt-2 text-sm text-gray-500">Please sign in to continue.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Error</h2>
          <p className="mt-2 text-sm text-gray-500">{error || 'Property not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <PropertyForm initialData={property} agentId={user.id} />
      </div>
    </div>
  )
} 