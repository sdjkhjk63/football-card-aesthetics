create extension if not exists pgcrypto;

create table if not exists public.card_feedback (
  id bigint generated always as identity primary key,
  card_slug text not null check (char_length(card_slug) between 1 and 120),
  message text not null check (char_length(message) between 5 and 500),
  created_at timestamptz not null default now()
);

alter table public.card_feedback enable row level security;
revoke all on table public.card_feedback from anon, authenticated;
grant insert on table public.card_feedback to anon, authenticated;
grant usage, select on sequence public.card_feedback_id_seq to anon, authenticated;

drop policy if exists "public can submit card feedback" on public.card_feedback;
create policy "public can submit card feedback"
on public.card_feedback for insert to anon, authenticated
with check (
  char_length(card_slug) between 1 and 120
  and char_length(message) between 5 and 500
);

create table if not exists public.card_ratings (
  card_slug text not null check (char_length(card_slug) between 1 and 120),
  device_token uuid not null,
  score numeric(3,1) not null check (score between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (card_slug, device_token)
);

alter table public.card_ratings enable row level security;
revoke all on table public.card_ratings from anon, authenticated;

create or replace function public.get_card_rating_summary(
  p_card_slug text,
  p_device_token uuid
)
returns table (average_score numeric, rating_count bigint, own_score numeric)
language sql
security definer
set search_path = public
as $$
  select
    round(avg(score), 1) as average_score,
    count(*) as rating_count,
    max(score) filter (where device_token = p_device_token) as own_score
  from public.card_ratings
  where card_slug = p_card_slug;
$$;

create or replace function public.upsert_card_rating(
  p_card_slug text,
  p_device_token uuid,
  p_score numeric
)
returns table (average_score numeric, rating_count bigint, own_score numeric)
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(p_card_slug) not between 1 and 120 or p_score not between 1 and 10 then
    raise exception 'invalid rating';
  end if;

  insert into public.card_ratings (card_slug, device_token, score)
  values (p_card_slug, p_device_token, round(p_score, 1))
  on conflict (card_slug, device_token)
  do update set score = excluded.score, updated_at = now();

  return query
  select
    round(avg(r.score), 1),
    count(*),
    max(r.score) filter (where r.device_token = p_device_token)
  from public.card_ratings r
  where r.card_slug = p_card_slug;
end;
$$;

revoke all on function public.get_card_rating_summary(text, uuid) from public;
revoke all on function public.upsert_card_rating(text, uuid, numeric) from public;
grant execute on function public.get_card_rating_summary(text, uuid) to anon, authenticated;
grant execute on function public.upsert_card_rating(text, uuid, numeric) to anon, authenticated;
