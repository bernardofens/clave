-- C2 · Registro de tentativas
-- Uma linha por resposta, imutável, no mesmo formato de src/state/attempts.ts (ATTEMPT_SCHEMA = 1).
-- É o que a análise da Fase 2 vai ler (decisão 9): o app grava tudo desde já e não mostra nada.
-- Rode depois de 20261023120000_init.sql, uma vez, no SQL Editor (ou via `supabase db push`).
-- A sincronização entre o aparelho e a conta é da B2; até lá as tentativas ficam só no IndexedDB.

-- ---------------------------------------------------------------------------
-- tentativas
-- ---------------------------------------------------------------------------
create table if not exists public.attempts (
  id uuid primary key, -- gerado no aparelho, para a mesma tentativa nunca entrar duas vezes
  user_id uuid not null references auth.users (id) on delete cascade,
  schema smallint not null,
  at timestamptz not null,
  session_id text not null,
  exercise_id text not null,
  primary_module text not null,
  skill_tags text[] not null,
  content_tags text[] not null,
  taxonomy_version integer not null,
  locale text not null,
  question jsonb not null,            -- esperado, superfície, opções oferecidas, notas tocadas
  parameters_snapshot jsonb not null, -- configurações, parâmetros globais e apresentação do som
  response jsonb not null,            -- resposta estruturada (Response)
  outcome text not null check (outcome in ('correct', 'partial', 'incorrect', 'self_assessed', 'unscored')),
  validation_type text not null check (validation_type in ('deterministic', 'self_report', 'none')),
  error_code text check (error_code in ('enharmonic_spelling', 'octave', 'semitone', 'chord_quality', 'chord_root', 'unclassified')),
  response_time_ms integer not null check (response_time_ms >= 0),
  hints integer not null default 0 check (hints >= 0),
  repetitions integer not null default 0 check (repetitions >= 0),
  -- código de erro só existe em resposta errada (ou parcial)
  check (error_code is null or outcome in ('incorrect', 'partial'))
);
create index if not exists attempts_user_at_idx on public.attempts (user_id, at desc);
-- a análise filtra por etiqueta, nunca pelo nome do exercício
create index if not exists attempts_skill_tags_idx on public.attempts using gin (skill_tags);
create index if not exists attempts_content_tags_idx on public.attempts using gin (content_tags);

alter table public.attempts enable row level security;

-- sem política de update: uma tentativa gravada não muda
create policy "attempts: dono lê" on public.attempts
  for select using (auth.uid() = user_id);
create policy "attempts: dono insere" on public.attempts
  for insert with check (auth.uid() = user_id);
create policy "attempts: dono apaga" on public.attempts
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- confiança declarada ao fim de uma série (pergunta ocasional e opcional)
-- ---------------------------------------------------------------------------
create table if not exists public.attempt_feedback (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  schema smallint not null,
  at timestamptz not null,
  session_id text not null,
  attempt_ids uuid[] not null,
  confidence text not null check (confidence in ('guess', 'unsure', 'sure'))
);
create index if not exists attempt_feedback_user_at_idx on public.attempt_feedback (user_id, at desc);

alter table public.attempt_feedback enable row level security;

create policy "attempt_feedback: dono lê" on public.attempt_feedback
  for select using (auth.uid() = user_id);
create policy "attempt_feedback: dono insere" on public.attempt_feedback
  for insert with check (auth.uid() = user_id);
create policy "attempt_feedback: dono apaga" on public.attempt_feedback
  for delete using (auth.uid() = user_id);

-- apagar a conta (delete_my_account, no init) leva estas tabelas junto pelo "on delete cascade"
