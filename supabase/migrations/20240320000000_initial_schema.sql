-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('ADMIN', 'AGENT', 'CLIENT');
create type property_type as enum ('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE');
create type property_status as enum ('FOR_SALE', 'FOR_RENT', 'SOLD', 'RENTED');
create type appointment_status as enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
create type lead_status as enum ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role user_role not null default 'CLIENT',
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users table
alter table public.users enable row level security;

-- Create properties table
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type property_type not null,
  status property_status not null default 'FOR_SALE',
  price numeric(12,2) not null,
  currency text not null default 'MXN',
  bedrooms smallint,
  bathrooms smallint,
  area_size numeric(10,2) not null,
  area_unit text not null default 'm²',
  address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'Mexico',
  latitude numeric(10,8),
  longitude numeric(11,8),
  features text[] default '{}',
  agent_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on properties table
alter table public.properties enable row level security;

-- Create property_media table
create table public.property_media (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  url text not null,
  type text not null default 'IMAGE',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on property_media table
alter table public.property_media enable row level security;

-- Create appointments table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  client_id uuid references public.users(id) on delete cascade not null,
  agent_id uuid references public.users(id) on delete cascade not null,
  date timestamp with time zone not null,
  status appointment_status not null default 'PENDING',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on appointments table
alter table public.appointments enable row level security;

-- Create leads table
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  message text not null,
  property_id uuid references public.properties(id) on delete set null,
  status lead_status not null default 'NEW',
  assigned_agent_id uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on leads table
alter table public.leads enable row level security;

-- Create RLS policies

-- Users policies
create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Properties policies
create policy "Anyone can view properties"
  on public.properties for select
  using (true);

create policy "Agents can create properties"
  on public.properties for insert
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('AGENT', 'ADMIN')
    )
  );

create policy "Agents can update their own properties"
  on public.properties for update
  using (
    agent_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'ADMIN'
    )
  );

-- Property media policies
create policy "Anyone can view property media"
  on public.property_media for select
  using (true);

create policy "Agents can manage their property media"
  on public.property_media for all
  using (
    exists (
      select 1 from public.properties
      where id = property_id
      and (
        agent_id = auth.uid() or
        exists (
          select 1 from public.users
          where id = auth.uid()
          and role = 'ADMIN'
        )
      )
    )
  );

-- Appointments policies
create policy "Users can view their own appointments"
  on public.appointments for select
  using (
    client_id = auth.uid() or
    agent_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'ADMIN'
    )
  );

create policy "Clients can create appointments"
  on public.appointments for insert
  using (auth.uid() = client_id);

create policy "Users can update their own appointments"
  on public.appointments for update
  using (
    client_id = auth.uid() or
    agent_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'ADMIN'
    )
  );

-- Leads policies
create policy "Agents can view assigned leads"
  on public.leads for select
  using (
    assigned_agent_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'ADMIN'
    )
  );

create policy "Anyone can create leads"
  on public.leads for insert
  using (true);

create policy "Agents can update their leads"
  on public.leads for update
  using (
    assigned_agent_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'ADMIN'
    )
  );

-- Create functions and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_updated_at
  before update on public.properties
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.appointments
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at(); 