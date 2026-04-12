-- Expand platform check in daily_opportunities to support blog/directory platforms
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

-- Add new fields to communities
alter table public.communities
  add column if not exists vertical text,
  add column if not exists audience_type text,
  add column if not exists quality_score float default 3.0,
  add column if not exists activity_score float default 3.0,
  add column if not exists content_type text,
  add column if not exists platform_type text default 'reddit';

-- Add match_reason to daily_opportunities
alter table public.daily_opportunities
  add column if not exists match_reason text;

-- Expand platform check in communities too (for future IH/HN entries)
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
