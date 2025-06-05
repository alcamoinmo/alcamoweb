import React from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainLayout from '../components/layout/MainLayout'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alcamo Real Estate',
  description: 'Tu socio confiable en bienes raíces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full bg-gray-100">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  )
} 