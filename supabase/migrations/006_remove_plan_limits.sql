-- Remove the community pool limit trigger (plan gating has been removed)
drop trigger if exists enforce_community_pool_limit on public.user_communities;
drop function if exists public.check_community_pool_limit();

-- Allow authenticated users to write to communities (discovery uses service role,
-- but this policy lets us drop the service-role dependency in future)
drop policy if exists "communities: authenticated can upsert" on public.communities;
create policy "communities: authenticated can upsert"
  on public.communities
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Expand platform check in communities to support all launch platforms
-- (same as 005 does for daily_opportunities, but applied here if 005 wasn't run yet)
alter table public.communities
  drop constraint if exists communities_platform_check;

alter table public.communities
  add constraint communities_platform_check
  check (platform in (
    'reddit', 'twitter', 'indie_hackers', 'hacker_news',
    'medium', 'devto', 'hashnode',
    'product_hunt', 'betalist', 'uneed', 'launching_next',
    'sideprojectors', 'microlaunch', 'peerlist'
  ));

-- Expand platform check in daily_opportunities too (if 005 wasn't run)
alter table public.daily_opportunities
  drop constraint if exists daily_opportunities_platform_check;

alter table public.daily_opportunities
  add constraint daily_opportunities_platform_check
  check (platform in (
    'reddit', 'twitter', 'indie_hackers', 'hacker_news',
    'medium', 'devto', 'hashnode',
    'product_hunt', 'betalist', 'uneed', 'launching_next',
    'sideprojectors', 'microlaunch', 'peerlist'
  ));

-- Add match_reason if missing (from 005)
alter table public.daily_opportunities
  add column if not exists match_reason text;

-- Fix status check: remove 'skipped' since we removed skip feature
alter table public.daily_opportunities
  drop constraint if exists daily_opportunities_status_check;

alter table public.daily_opportunities
  add constraint daily_opportunities_status_check
  check (status in ('pending', 'done'));
