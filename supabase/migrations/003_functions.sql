-- Increment community usage (called after marking a post as done)
create or replace function public.increment_community_usage(
  p_user_id uuid,
  p_community_id uuid
)
returns void as $$
begin
  update public.user_communities
  set
    last_used_at = now(),
    usage_count = usage_count + 1
  where
    user_id = p_user_id
    and community_id = p_community_id;
end;
$$ language plpgsql security definer;
