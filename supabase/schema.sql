create table if not exists public.activity_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  id bigint not null,
  activity text not null,
  start_time text not null,
  end_time text not null,
  duration text not null,
  duration_seconds integer,
  session_date text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists activity_sessions_user_created_idx
  on public.activity_sessions (user_id, created_at desc);

alter table public.activity_sessions enable row level security;

revoke all on table public.activity_sessions from anon;
grant select, insert, update, delete on table public.activity_sessions to authenticated;

drop policy if exists "Users can read their own sessions" on public.activity_sessions;
create policy "Users can read their own sessions"
on public.activity_sessions
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own sessions" on public.activity_sessions;
create policy "Users can insert their own sessions"
on public.activity_sessions
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own sessions" on public.activity_sessions;
create policy "Users can update their own sessions"
on public.activity_sessions
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own sessions" on public.activity_sessions;
create policy "Users can delete their own sessions"
on public.activity_sessions
for delete
to authenticated
using ((select auth.uid()) = user_id);
