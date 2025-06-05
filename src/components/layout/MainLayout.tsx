import { ReactNode } from 'react';
import Link from 'next/link';
import { UserCircleIcon, HeartIcon, HomeIcon, BuildingOfficeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Comprar', href: '/propiedades/comprar', icon: BuildingOfficeIcon },
  { name: 'Rentar', href: '/propiedades/rentar', icon: BuildingOfficeIcon },
  { name: 'Contacto', href: '/contacto', icon: PhoneIcon },
];

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-white">
      {/* Header */}
      <header className="bg-brand-white shadow-sm">
        <nav className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-montserrat font-bold text-brand-accent">
                Alcamo
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-brand-gray-600 hover:text-brand-accent px-3 py-2 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/favoritos"
                className="text-brand-gray-600 hover:text-brand-accent p-2"
                aria-label="Favoritos"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>
              <Link
                href="/auth/login"
                className="text-brand-gray-600 hover:text-brand-accent p-2"
                aria-label="Iniciar sesión"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-gray-900 text-brand-white">
        <div className="container-custom mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">Alcamo Inmobiliaria</h3>
              <p className="text-brand-gray-300">
                Tu socio de confianza en bienes raíces en Aguascalientes
              </p>
            </div>
            <div>
              <h4 className="text-sm font-montserrat font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-brand-gray-300 hover:text-brand-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-montserrat font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/aviso-de-privacidad" className="text-brand-gray-300 hover:text-brand-white">
                    Aviso de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terminos-y-condiciones" className="text-brand-gray-300 hover:text-brand-white">
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-montserrat font-semibold mb-4">Contacto</h4>
              <address className="text-brand-gray-300 not-italic">
                <p>Aguascalientes, México</p>
                <p className="mt-2">contacto@alcamoinmo.com</p>
                <p className="mt-2">+52 (449) XXX-XXXX</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-brand-gray-800 text-center text-brand-gray-400">
            <p>&copy; {new Date().getFullYear()} Alcamo Inmobiliaria. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 