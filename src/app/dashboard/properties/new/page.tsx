'use client'

import { useAuth } from '../../../../lib/hooks/useAuth'
import PropertyForm from '../../../../components/properties/PropertyForm'

export default function AddPropertyPage() {
  const { user } = useAuth()

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <PropertyForm agentId={user.id} />
      </div>
    </div>
  )
} 