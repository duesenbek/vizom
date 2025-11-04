-- Supabase Schema for Vizom AI Visual Engine
-- Requires: PostgreSQL on Supabase, pgcrypto extension (for gen_random_uuid)

-- Extensions (available on Supabase)
create extension if not exists pgcrypto with schema public;

-- Profiles table extending auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  photo_url text,
  plan text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Keep email in sync when available
create or replace function public.handle_profile_update()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

create trigger on_profiles_update
before update on public.profiles
for each row execute function public.handle_profile_update();

-- Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Projects (owned by user)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  content text, -- store HTML/JSON as needed
  version int not null default 1,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_projects_public on public.projects(is_public);

create or replace function public.handle_projects_update()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

create trigger on_projects_update
before update on public.projects
for each row execute function public.handle_projects_update();

-- Templates (curated + user-contributed)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  content jsonb, -- config/metadata
  is_public boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_templates_public on public.templates(is_public);
create index if not exists idx_templates_category on public.templates(category);

-- AI generations history
create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  prompt text not null,
  chart_type text,
  output jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_aigen_user on public.ai_generations(user_id);
create index if not exists idx_aigen_project on public.ai_generations(project_id);

-- User settings/preferences
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text default 'en',
  theme text default 'light',
  notifications boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_user_settings_update()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

create trigger on_user_settings_update
before update on public.user_settings
for each row execute function public.handle_user_settings_update();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.templates enable row level security;
alter table public.ai_generations enable row level security;
alter table public.user_settings enable row level security;

-- profiles policies
create policy if not exists "Read own profile" on public.profiles
for select using (id = auth.uid());

create policy if not exists "Update own profile" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy if not exists "Insert own profile" on public.profiles
for insert with check (id = auth.uid());

-- projects policies
create policy if not exists "Read public or own projects" on public.projects
for select using (is_public = true or user_id = auth.uid());

create policy if not exists "Insert own projects" on public.projects
for insert with check (user_id = auth.uid());

create policy if not exists "Update own projects" on public.projects
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists "Delete own projects" on public.projects
for delete using (user_id = auth.uid());

-- templates policies
create policy if not exists "Read public templates" on public.templates
for select using (is_public = true or created_by = auth.uid());

create policy if not exists "Insert own templates" on public.templates
for insert with check (created_by = auth.uid());

create policy if not exists "Update own templates" on public.templates
for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy if not exists "Delete own templates" on public.templates
for delete using (created_by = auth.uid());

-- ai_generations policies
create policy if not exists "Read own generations" on public.ai_generations
for select using (user_id = auth.uid());

create policy if not exists "Insert own generations" on public.ai_generations
for insert with check (user_id = auth.uid());

create policy if not exists "Delete own generations" on public.ai_generations
for delete using (user_id = auth.uid());

-- user_settings policies
create policy if not exists "Read own settings" on public.user_settings
for select using (user_id = auth.uid());

create policy if not exists "Insert own settings" on public.user_settings
for insert with check (user_id = auth.uid());

create policy if not exists "Update own settings" on public.user_settings
for update using (user_id = auth.uid()) with check (user_id = auth.uid());
