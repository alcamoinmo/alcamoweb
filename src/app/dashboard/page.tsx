'use client'

import { useState } from 'react'
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Propiedades Activas',
    value: '12',
    icon: HomeIcon,
    change: '+2',
    changeType: 'positive',
  },
  {
    name: 'Clientes Nuevos',
    value: '24',
    icon: UsersIcon,
    change: '+4',
    changeType: 'positive',
  },
  {
    name: 'Citas Programadas',
    value: '8',
    icon: CalendarIcon,
    change: '+3',
    changeType: 'positive',
  },
  {
    name: 'Ventas del Mes',
    value: '$45,000',
    icon: CurrencyDollarIcon,
    change: '+12%',
    changeType: 'positive',
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'property',
    title: 'Nueva propiedad agregada',
    description: 'Casa en Residencial Campestre',
    date: 'Hace 2 horas',
  },
  {
    id: 2,
    type: 'client',
    title: 'Nuevo cliente registrado',
    description: 'Juan Pérez',
    date: 'Hace 3 horas',
  },
  {
    id: 3,
    type: 'appointment',
    title: 'Cita programada',
    description: 'Visita a propiedad en Col. Centro',
    date: 'Hace 5 horas',
  },
  {
    id: 4,
    type: 'sale',
    title: 'Venta completada',
    description: 'Departamento en Col. Moderna',
    date: 'Hace 1 día',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-gray-500">
          Bienvenido de nuevo. Aquí está un resumen de tu actividad.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-brand-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-brand-accent p-3">
                <stat.icon
                  className="h-6 w-6 text-brand-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-brand-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-brand-gray-900">
                {stat.value}
              </p>
              <p
                className={classNames(
                  stat.changeType === 'positive'
                    ? 'text-brand-green-600'
                    : 'text-brand-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold leading-6 text-brand-gray-900">
              Actividad Reciente
            </h2>
            <p className="mt-2 text-sm text-brand-gray-700">
              Lista de las últimas actividades en el sistema.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-brand-gray-900 ring-1 ring-inset ring-brand-gray-300 focus:ring-2 focus:ring-brand-accent sm:text-sm sm:leading-6"
            >
              <option value="day">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-brand-black ring-opacity-5 sm:rounded-lg">
                <ul role="list" className="divide-y divide-brand-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-brand-gray-50 flex items-center justify-center">
                              {activity.type === 'property' && (
                                <HomeIcon
                                  className="h-5 w-5 text-brand-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                              {activity.type === 'client' && (
                                <UsersIcon
                                  className="h-5 w-5 text-brand-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                              {activity.type === 'appointment' && (
                                <CalendarIcon
                                  className="h-5 w-5 text-brand-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                              {activity.type === 'sale' && (
                                <CurrencyDollarIcon
                                  className="h-5 w-5 text-brand-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-brand-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-brand-gray-500">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex flex-shrink-0">
                          <p className="text-sm text-brand-gray-500">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 