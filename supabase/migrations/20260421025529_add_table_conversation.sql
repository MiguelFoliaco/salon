-- =========================
-- EXTENSION
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- ENUM
-- =========================
do $$ begin
    create type role_enum as enum ('system','user','assistant');
exception
    when duplicate_object then null;
end $$;

-- =========================
-- TABLE: conversation
-- =========================
create table if not exists public.conversation (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    title text
);

-- Índices
create index if not exists idx_conversation_user_id
on public.conversation(user_id);

create index if not exists idx_conversation_user_created_at
on public.conversation(user_id, created_at desc);

-- =========================
-- TABLE: messages
-- =========================
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversation(id) on delete cascade,
    role role_enum not null,
    content text not null,
    created_at timestamptz default now()
);

-- Índice correcto para chat (CRÍTICO)
create index if not exists idx_messages_conversation_created_at
on public.messages(conversation_id, created_at desc);

-- =========================
-- FULL TEXT SEARCH (opcional pero bien hecho)
-- =========================
alter table public.messages
add column if not exists content_tsv tsvector
generated always as (to_tsvector('spanish', content)) stored;

create index if not exists idx_messages_content_tsv
on public.messages using gin(content_tsv);

-- =========================
-- RLS
-- =========================
alter table public.conversation enable row level security;
alter table public.messages enable row level security;

-- =========================
-- POLICIES: conversation
-- =========================
drop policy if exists "conversation_select_own" on public.conversation;
create policy "conversation_select_own"
on public.conversation
for select
using (auth.uid() = user_id);

drop policy if exists "conversation_insert_own" on public.conversation;
create policy "conversation_insert_own"
on public.conversation
for insert
with check (auth.uid() = user_id);

drop policy if exists "conversation_delete_own" on public.conversation;
create policy "conversation_delete_own"
on public.conversation
for delete
using (auth.uid() = user_id);

-- (opcional) update si lo necesitas
drop policy if exists "conversation_update_own" on public.conversation;
create policy "conversation_update_own"
on public.conversation
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================
-- POLICIES: messages
-- =========================
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own"
on public.messages
for select
using (
  exists (
    select 1
    from public.conversation c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
on public.messages
for insert
with check (
  exists (
    select 1
    from public.conversation c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own"
on public.messages
for delete
using (
  exists (
    select 1
    from public.conversation c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);