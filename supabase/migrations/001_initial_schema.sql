-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile (supplements Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  created_at timestamptz not null default now()
);

-- Startups
create table public.startups (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text not null,
  website text,
  category text,
  keywords text[] not null default '{}',
  discovery_status text not null default 'pending' check (discovery_status in ('pending', 'in_progress', 'complete', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Global community database
create table public.communities (
  id uuid primary key default uuid_generate_v4(),
  platform text not null check (platform in ('reddit', 'twitter', 'indie_hackers', 'hacker_news')),
  name text not null,
  url text not null,
  tags text[] not null default '{}',
  members integer not null default 0,
  active boolean not null default true,
  self_promo_allowed boolean,
  links_allowed boolean,
  last_checked timestamptz,
  created_at timestamptz not null default now(),
  unique(platform, name)
);

-- Per-user community pool
create table public.user_communities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  last_used_at timestamptz,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, community_id)
);

-- Daily posts (today's opportunities)
create table public.daily_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  startup_id uuid not null references public.startups(id) on delete cascade,
  community_id uuid references public.communities(id) on delete set null,
  platform text not null check (platform in ('reddit', 'twitter', 'indie_hackers', 'hacker_news')),
  post_title text,
  post_content text not null,
  post_url text not null,
  template_index integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'done', 'skipped')),
  generated_at date not null,
  done_at timestamptz,
  regen_count integer not null default 0,
  slot_index integer not null,
  created_at timestamptz not null default now()
);

-- Index for daily scheduler query
create index daily_posts_user_date on public.daily_posts(user_id, generated_at);
create index user_communities_rotation on public.user_communities(user_id, last_used_at, usage_count);

-- Trigger to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to update startups.updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger startups_updated_at
  before update on public.startups
  for each row execute procedure public.update_updated_at();
