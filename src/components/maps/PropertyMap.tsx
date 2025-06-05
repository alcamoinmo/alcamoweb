'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMarker {
  lat: number;
  lng: number;
  title: string;
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  markers?: PropertyMarker[];
  zoom?: number;
  height?: string;
}

export default function PropertyMap({
  latitude,
  longitude,
  markers = [],
  zoom = 15,
  height = '400px',
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add markers
    markers.forEach((marker) => {
      new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker.title}</h3>`))
        .addTo(map.current!);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, markers, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{ height, width: '100%' }}
      className="rounded-lg"
    />
  );
} 