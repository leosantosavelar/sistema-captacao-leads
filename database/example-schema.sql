-- Exemplo público e simplificado do modelo de dados.
-- Não representa o schema integral de produção.

create extension if not exists pgcrypto;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  external_event_id text unique,
  full_name text not null,
  email text,
  phone text,
  source text,
  campaign_id text,
  status text not null default 'new',
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index lead_events_lead_id_created_at_idx
  on public.lead_events (lead_id, created_at desc);

create index leads_source_created_at_idx
  on public.leads (source, created_at desc);

-- Em produção, validações adicionais, enums/domínios, constraints,
-- políticas de acesso e tabelas auxiliares são aplicadas conforme o contexto.
