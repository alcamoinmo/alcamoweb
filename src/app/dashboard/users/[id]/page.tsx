'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../../lib/hooks/useAuth'
import { supabase } from '../../../../lib/supabase/config'
import type { Database } from '../../../../lib/types/supabase'
import UserForm from '../../../../components/users/UserForm'

type User = Database['public']['Tables']['users']['Row']

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { user } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchUser()
    }
  }, [user, params.id])

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setUserData(data)
    } catch (err) {
      console.error('Error fetching user:', err)
      setError('Failed to load user')
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

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Error</h2>
          <p className="mt-2 text-sm text-gray-500">{error || 'User not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <UserForm initialData={userData} />
      </div>
    </div>
  )
} 