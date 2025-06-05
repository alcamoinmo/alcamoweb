import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const propertyTypes = ['house', 'apartment', 'commercial'] as const;
const propertyStatus = ['for_sale', 'for_rent'] as const;
const locations = [
  'Colonia del Valle, CDMX',
  'Polanco, CDMX',
  'Condesa, CDMX',
  'Roma Norte, CDMX',
  'Lomas de Chapultepec, CDMX',
  'Santa Fe, CDMX',
  'Interlomas, Estado de México',
  'Valle Oriente, Monterrey',
  'Puerto Vallarta, Jalisco',
  'Tulum, Quintana Roo',
];

const sampleProperties = [
  {
    title: 'Hermosa Casa en Colonia del Valle',
    description: 'Amplia casa de 3 recámaras con jardín y terraza. Ubicada en una zona residencial tranquila, cerca de escuelas y centros comerciales.',
    type: 'house',
    status: 'for_sale',
    price: 8500000,
    location: 'Colonia del Valle, CDMX',
    bedrooms: 3,
    bathrooms: 2.5,
    area: 250,
    latitude: 19.3857,
    longitude: -99.1777,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Departamento Moderno en Polanco',
    description: 'Elegante departamento de lujo con acabados de primera calidad. Amenidades incluyen gimnasio, alberca y área de juegos.',
    type: 'apartment',
    status: 'for_rent',
    price: 35000,
    location: 'Polanco, CDMX',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    latitude: 19.4337,
    longitude: -99.1946,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Local Comercial en Condesa',
    description: 'Local comercial en excelente ubicación, ideal para restaurante o café. Alto tráfico peatonal y buena visibilidad.',
    type: 'commercial',
    status: 'for_rent',
    price: 45000,
    location: 'Condesa, CDMX',
    bedrooms: 0,
    bathrooms: 1,
    area: 80,
    latitude: 19.4117,
    longitude: -99.1733,
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Casa de Playa en Tulum',
    description: 'Hermosa casa de playa con vista al mar. Diseño moderno y minimalista, perfecta para vacaciones o inversión.',
    type: 'house',
    status: 'for_sale',
    price: 12500000,
    location: 'Tulum, Quintana Roo',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    latitude: 20.2150,
    longitude: -87.4515,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Penthouse en Santa Fe',
    description: 'Lujoso penthouse con terraza y vista panorámica. Amenidades de primer nivel y seguridad 24/7.',
    type: 'apartment',
    status: 'for_sale',
    price: 15000000,
    location: 'Santa Fe, CDMX',
    bedrooms: 3,
    bathrooms: 3.5,
    area: 280,
    latitude: 19.3573,
    longitude: -99.2591,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Oficina Ejecutiva en Interlomas',
    description: 'Moderno espacio de oficina en edificio corporativo. Ideal para empresas en crecimiento.',
    type: 'commercial',
    status: 'for_rent',
    price: 28000,
    location: 'Interlomas, Estado de México',
    bedrooms: 0,
    bathrooms: 1,
    area: 150,
    latitude: 19.3917,
    longitude: -99.2833,
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Casa Tradicional en Roma Norte',
    description: 'Encantadora casa restaurada con detalles originales. Ubicada en una de las zonas más cotizadas de la ciudad.',
    type: 'house',
    status: 'for_sale',
    price: 9500000,
    location: 'Roma Norte, CDMX',
    bedrooms: 3,
    bathrooms: 2,
    area: 220,
    latitude: 19.4177,
    longitude: -99.1677,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Departamento en Valle Oriente',
    description: 'Moderno departamento en zona exclusiva de Monterrey. Amenidades de lujo y excelente ubicación.',
    type: 'apartment',
    status: 'for_rent',
    price: 28000,
    location: 'Valle Oriente, Monterrey',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    latitude: 25.6500,
    longitude: -100.3167,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop',
    ],
  },
];

async function seedProperties() {
  try {
    // First, get the first agent from the database
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id')
      .limit(1);

    if (agentsError) throw agentsError;
    if (!agents || agents.length === 0) {
      console.error('No agents found in the database. Please create an agent first.');
      return;
    }

    const agentId = agents[0].id;

    // Insert properties
    for (const property of sampleProperties) {
      const { error } = await supabase
        .from('properties')
        .insert({
          ...property,
          agent_id: agentId,
        });

      if (error) {
        console.error('Error inserting property:', error);
      } else {
        console.log('Property inserted successfully:', property.title);
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedProperties(); 