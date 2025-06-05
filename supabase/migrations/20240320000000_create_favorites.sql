-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- Create policies
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Create function to check if a property is favorited
create or replace function public.is_property_favorited(property_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from public.favorites
    where user_id = auth.uid()
    and property_id = $1
  );
$$; 