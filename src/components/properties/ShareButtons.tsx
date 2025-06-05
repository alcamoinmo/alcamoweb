'use client';

import { useState } from 'react';
import {
  ShareIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ShareButtonsProps {
  propertyId: number | string;
  propertyTitle: string;
  propertyUrl: string;
}

export default function ShareButtons({
  propertyId,
  propertyTitle,
  propertyUrl,
}: ShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      action: () => {
        const text = `¡Mira esta propiedad en Alcamo Real Estate!\n${propertyTitle}\n${propertyUrl}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: EnvelopeIcon,
      action: () => {
        const subject = `Propiedad en Alcamo Real Estate: ${propertyTitle}`;
        const body = `¡Mira esta propiedad en Alcamo Real Estate!\n\n${propertyTitle}\n${propertyUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="inline-flex items-center rounded-md bg-brand-white px-3 py-2 text-sm font-semibold text-brand-gray-900 shadow-sm ring-1 ring-inset ring-brand-gray-300 hover:bg-brand-gray-50"
      >
        <ShareIcon className="h-5 w-5 text-brand-gray-400" />
        <span className="ml-2">Compartir</span>
      </button>

      {showShareMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    setShowShareMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
                >
                  <option.icon className="mr-3 h-5 w-5 text-brand-gray-400" />
                  {option.name}
                </button>
              ))}
              <button
                onClick={() => {
                  handleCopyLink();
                  setShowShareMenu(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
              >
                <ShareIcon className="mr-3 h-5 w-5 text-brand-gray-400" />
                Copiar enlace
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 