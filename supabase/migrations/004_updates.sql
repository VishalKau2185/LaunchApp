-- Add target_audience to startups
alter table public.startups
  add column if not exists target_audience text;

-- Add rules_summary to communities
alter table public.communities
  add column if not exists rules_summary text;

-- Add last_status to user_communities
alter table public.user_communities
  add column if not exists last_status text;

-- Create daily_opportunities table (replaces daily_posts)
create table if not exists public.daily_opportunities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  platform text not null check (platform in ('reddit', 'twitter', 'indie_hackers', 'hacker_news')),
  community_id uuid references public.communities(id) on delete set null,
  post_url text not null,
  generated_title text,
  generated_body text not null,
  template_type text not null,
  status text not null default 'pending' check (status in ('pending', 'skipped', 'done')),
  slot_index integer not null,
  regen_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists daily_opportunities_user_date
  on public.daily_opportunities(user_id, date);

-- RLS
alter table public.daily_opportunities enable row level security;

create policy "daily_opportunities: all own"
  on public.daily_opportunities
  for all using (auth.uid() = user_id);
