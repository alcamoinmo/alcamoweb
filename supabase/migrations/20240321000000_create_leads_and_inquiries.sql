-- Create leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'lost', 'converted')),
  source text not null default 'website' check (source in ('website', 'phone', 'email', 'referral', 'other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create inquiries table
create table public.inquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  preferred_date date,
  preferred_time text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create visits table
create table public.visits (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  lead_id uuid references public.leads(id) on delete set null,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  visit_date date not null,
  visit_time text not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.leads enable row level security;
alter table public.inquiries enable row level security;
alter table public.visits enable row level security;

-- Create policies for leads
create policy "Agents can view their own leads"
  on public.leads for select
  using (auth.uid() = agent_id);

create policy "Agents can insert leads"
  on public.leads for insert
  with check (auth.uid() = agent_id);

create policy "Agents can update their own leads"
  on public.leads for update
  using (auth.uid() = agent_id);

-- Create policies for inquiries
create policy "Agents can view their own inquiries"
  on public.inquiries for select
  using (auth.uid() = agent_id);

create policy "Agents can insert inquiries"
  on public.inquiries for insert
  with check (auth.uid() = agent_id);

create policy "Agents can update their own inquiries"
  on public.inquiries for update
  using (auth.uid() = agent_id);

-- Create policies for visits
create policy "Agents can view their own visits"
  on public.visits for select
  using (auth.uid() = agent_id);

create policy "Agents can insert visits"
  on public.visits for insert
  with check (auth.uid() = agent_id);

create policy "Agents can update their own visits"
  on public.visits for update
  using (auth.uid() = agent_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger handle_leads_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

create trigger handle_inquiries_updated_at
  before update on public.inquiries
  for each row
  execute function public.handle_updated_at();

create trigger handle_visits_updated_at
  before update on public.visits
  for each row
  execute function public.handle_updated_at(); 