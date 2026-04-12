-- Row Level Security

-- Users: can only read/update own row
alter table public.users enable row level security;

create policy "users: read own" on public.users
  for select using (auth.uid() = id);

create policy "users: update own" on public.users
  for update using (auth.uid() = id);

-- Startups: full CRUD on own rows
alter table public.startups enable row level security;

create policy "startups: all own" on public.startups
  for all using (auth.uid() = user_id);

-- Communities: globally readable, only service role can write
alter table public.communities enable row level security;

create policy "communities: read all" on public.communities
  for select using (true);

-- user_communities: full CRUD on own rows
alter table public.user_communities enable row level security;

create policy "user_communities: all own" on public.user_communities
  for all using (auth.uid() = user_id);

-- daily_posts: full CRUD on own rows
alter table public.daily_posts enable row level security;

create policy "daily_posts: all own" on public.daily_posts
  for all using (auth.uid() = user_id);

-- Free tier: enforce max 10 communities in pool
create or replace function public.check_community_pool_limit()
returns trigger as $$
declare
  user_plan text;
  pool_count integer;
  max_pool integer;
begin
  select plan into user_plan from public.users where id = new.user_id;
  select count(*) into pool_count from public.user_communities where user_id = new.user_id;

  max_pool := case when user_plan = 'paid' then 40 else 10 end;

  if pool_count >= max_pool then
    raise exception 'Community pool limit reached for plan: %', user_plan;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger enforce_community_pool_limit
  before insert on public.user_communities
  for each row execute procedure public.check_community_pool_limit();
