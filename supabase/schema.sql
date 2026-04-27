-- Dialekta Outbound Dashboard - Supabase Schema
-- Dieses Script im Supabase SQL Editor einfügen und ausführen.

create table if not exists public.dashboard_settings (
  id text primary key default 'default',
  current_call_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.staged_leads (
  id text primary key,
  company text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  website text,
  location text not null,
  branch text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key,
  company text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  website text,
  location text not null,
  branch text not null,
  notes text,
  status text not null default 'wait' check (status in (
    'wait', 'calling', 'appointment', 'interest', 'callback',
    'not_reached', 'not_responsible', 'no_interest', 'sales_done', 'sales_deleted'
  )),
  plan_info text,
  plan_timestamp bigint not null default 0,
  action_ts bigint not null default 0,
  summary text,
  appointment_date text,
  appointment_context text,
  ansprechpartner_name text,
  ansprechpartner_phone text,
  ansprechpartner_role text,
  prev_status text check (prev_status is null or prev_status in (
    'wait', 'calling', 'appointment', 'interest', 'callback',
    'not_reached', 'not_responsible', 'no_interest', 'sales_done', 'sales_deleted'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_queues (
  id text primary key,
  branch text not null,
  total integer not null default 0,
  is_planned boolean not null default false,
  plan_date text,
  plan_from text,
  plan_to text,
  plan_timestamp bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_queue_leads (
  id text primary key,
  queue_id text not null references public.live_queues(id) on delete cascade,
  lead_id text not null references public.leads(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(id) on delete set null,
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.export_logs (
  id uuid primary key default gen_random_uuid(),
  export_type text not null,
  branch text,
  row_count integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists touch_staged_leads_updated_at on public.staged_leads;
create trigger touch_staged_leads_updated_at
before update on public.staged_leads
for each row execute function public.touch_updated_at();

drop trigger if exists touch_leads_updated_at on public.leads;
create trigger touch_leads_updated_at
before update on public.leads
for each row execute function public.touch_updated_at();

drop trigger if exists touch_live_queues_updated_at on public.live_queues;
create trigger touch_live_queues_updated_at
before update on public.live_queues
for each row execute function public.touch_updated_at();

insert into public.dashboard_settings (id)
values ('default')
on conflict (id) do nothing;

-- Einfacher Prototyp-Modus: öffentlich lesbar/schreibbar mit anon key.
-- Für produktive Nutzung später unbedingt Login/Auth und strengere Policies ergänzen.
alter table public.dashboard_settings enable row level security;
alter table public.staged_leads enable row level security;
alter table public.leads enable row level security;
alter table public.live_queues enable row level security;
alter table public.live_queue_leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.export_logs enable row level security;

drop policy if exists "public dashboard settings" on public.dashboard_settings;
create policy "public dashboard settings" on public.dashboard_settings for all using (true) with check (true);

drop policy if exists "public staged leads" on public.staged_leads;
create policy "public staged leads" on public.staged_leads for all using (true) with check (true);

drop policy if exists "public leads" on public.leads;
create policy "public leads" on public.leads for all using (true) with check (true);

drop policy if exists "public live queues" on public.live_queues;
create policy "public live queues" on public.live_queues for all using (true) with check (true);

drop policy if exists "public live queue leads" on public.live_queue_leads;
create policy "public live queue leads" on public.live_queue_leads for all using (true) with check (true);

drop policy if exists "public lead events" on public.lead_events;
create policy "public lead events" on public.lead_events for all using (true) with check (true);

drop policy if exists "public export logs" on public.export_logs;
create policy "public export logs" on public.export_logs for all using (true) with check (true);
