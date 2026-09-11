-- Exemplo conceitual de Row Level Security para portfólio.
-- A política real depende do modelo de autenticação e tenancy adotado.

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;

-- Exemplo simples: usuários autenticados podem consultar leads atribuídos a eles.
create policy "read assigned leads"
on public.leads
for select
to authenticated
using (assigned_to = auth.uid());

-- Eventos só podem ser lidos quando pertencem a um lead acessível ao usuário.
create policy "read events from assigned leads"
on public.lead_events
for select
to authenticated
using (
  exists (
    select 1
    from public.leads
    where leads.id = lead_events.lead_id
      and leads.assigned_to = auth.uid()
  )
);

-- Escritas privilegiadas devem ser realizadas pelo backend/orquestração
-- usando credenciais adequadas, nunca expondo service-role no frontend.
