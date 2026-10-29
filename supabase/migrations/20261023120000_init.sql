-- B1 · Fundação de contas (Supabase)
-- Tabelas do app (perfil, estatísticas, histórico, arsenal, configurações, cargas e plano de
-- tonalidade), cada uma presa a auth.users por user_id, com RLS para que cada pessoa só leia e
-- escreva os seus próprios dados. Rode este arquivo uma vez no SQL Editor do projeto Supabase
-- (ou via `supabase db push`, se usar a CLI).

-- ---------------------------------------------------------------------------
-- perfil
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  kind text not null default 'hobby',
  instrument text not null default 'violao',
  goals text[] not null default '{}',
  levels jsonb not null default '{}'::jsonb,
  naming text not null default 'pt',
  sound boolean not null default true,
  -- Data de nascimento: só existe para quem tem 13 anos ou mais (ver docs/decisoes.md).
  -- Menores de 13 nunca chegam a criar conta, então nunca existe linha para eles aqui.
  birthdate date,
  age_group text check (age_group in ('13to17', '18plus')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: dono lê" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles: dono insere" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles: dono atualiza" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles: dono apaga" on public.profiles
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- estatísticas (uma linha por exercício)
-- ---------------------------------------------------------------------------
create table if not exists public.stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  best_streak integer not null default 0,
  last_at timestamptz,
  primary key (user_id, exercise_id)
);

alter table public.stats enable row level security;

create policy "stats: dono lê" on public.stats
  for select using (auth.uid() = user_id);
create policy "stats: dono insere" on public.stats
  for insert with check (auth.uid() = user_id);
create policy "stats: dono atualiza" on public.stats
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "stats: dono apaga" on public.stats
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- histórico de atividades
-- ---------------------------------------------------------------------------
create table if not exists public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  at timestamptz not null default now(),
  exercise_id text not null,
  title text not null,
  area text not null,
  seconds integer not null,
  correct integer,
  total integer
);

create index if not exists history_user_at_idx on public.history (user_id, at desc);

alter table public.history enable row level security;

create policy "history: dono lê" on public.history
  for select using (auth.uid() = user_id);
create policy "history: dono insere" on public.history
  for insert with check (auth.uid() = user_id);
create policy "history: dono apaga" on public.history
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- arsenal (quais exercícios estão na rotação de cada pessoa)
-- ---------------------------------------------------------------------------
create table if not exists public.arsenal (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  added_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

alter table public.arsenal enable row level security;

create policy "arsenal: dono lê" on public.arsenal
  for select using (auth.uid() = user_id);
create policy "arsenal: dono insere" on public.arsenal
  for insert with check (auth.uid() = user_id);
create policy "arsenal: dono apaga" on public.arsenal
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- configurações salvas por exercício/ferramenta
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  values jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

alter table public.settings enable row level security;

create policy "settings: dono lê" on public.settings
  for select using (auth.uid() = user_id);
create policy "settings: dono insere" on public.settings
  for insert with check (auth.uid() = user_id);
create policy "settings: dono atualiza" on public.settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings: dono apaga" on public.settings
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- cargas (recorde em bpm por rotina — usado a partir da C3)
-- ---------------------------------------------------------------------------
create table if not exists public.cargas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id text not null,
  bpm integer not null,
  self_reported boolean not null default false,
  at timestamptz not null default now()
);

create index if not exists cargas_user_routine_idx on public.cargas (user_id, routine_id, at desc);

alter table public.cargas enable row level security;

create policy "cargas: dono lê" on public.cargas
  for select using (auth.uid() = user_id);
create policy "cargas: dono insere" on public.cargas
  for insert with check (auth.uid() = user_id);
create policy "cargas: dono apaga" on public.cargas
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- plano de tonalidade ("internalizar uma tonalidade")
-- ---------------------------------------------------------------------------
create table if not exists public.tonality_plan (
  user_id uuid primary key references auth.users (id) on delete cascade,
  fifths integer not null,
  done text[] not null default '{}',
  started_at timestamptz not null default now()
);

alter table public.tonality_plan enable row level security;

create policy "tonality_plan: dono lê" on public.tonality_plan
  for select using (auth.uid() = user_id);
create policy "tonality_plan: dono insere" on public.tonality_plan
  for insert with check (auth.uid() = user_id);
create policy "tonality_plan: dono atualiza" on public.tonality_plan
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tonality_plan: dono apaga" on public.tonality_plan
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- apagar a própria conta (exigência da Apple: apagar de dentro do app)
-- ---------------------------------------------------------------------------
-- security definer: roda com o dono da função (não com o papel de quem chama), então consegue
-- apagar de auth.users mesmo sem o client ter acesso a esse schema. O "on delete cascade" em
-- cada tabela acima cuida de apagar o resto sozinho.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
