export interface Property {
  id: number;
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'commercial';
  status: 'for_sale' | 'for_rent';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
  agent_id: number;
  created_at: string;
  updated_at: string;
  agent?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

export interface PropertyMarker {
  lat: number;
  lng: number;
  title: string;
  address: string;
  onClick?: () => void;
} 