-- Dialekta Outbound Dashboard - Supabase Komplett-Setup
-- Im Supabase SQL Editor komplett ausfuehren.
-- Achtung: loescht Testdaten in diesen Dashboard-Tabellen.

create extension if not exists pgcrypto;

drop table if exists public.call_run_leads cascade;
drop table if exists public.call_runs cascade;
drop table if exists public.appointments cascade;
drop table if exists public.lead_events cascade;
drop table if exists public.export_logs cascade;
drop table if exists public.leads cascade;
drop table if exists public.staged_leads cascade;
drop table if exists public.import_batches cascade;
drop table if exists public.live_queue_leads cascade;
drop table if exists public.live_queues cascade;
drop table if exists public.dashboard_settings cascade;

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Dashboard Import',
  source text not null default 'app',
  row_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staged_leads (
  id text primary key,
  import_batch_id uuid references public.import_batches(id) on delete set null,
  external_row_number integer,
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

create table public.leads (
  id text primary key,
  import_batch_id uuid references public.import_batches(id) on delete set null,
  external_row_number integer,
  company text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  website text,
  location text not null,
  branch text not null,
  notes text,
  status text not null default 'wait' check (status in ('wait','calling','appointment','interest','callback','not_reached','not_responsible','no_interest','sales_done','sales_deleted')),
  plan_info text,
  plan_timestamp bigint not null default 0,
  action_ts bigint not null default 0,
  summary text,
  appointment_date text,
  appointment_context text,
  ansprechpartner_name text,
  ansprechpartner_phone text,
  ansprechpartner_role text,
  prev_status text check (prev_status is null or prev_status in ('wait','calling','appointment','interest','callback','not_reached','not_responsible','no_interest','sales_done','sales_deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.call_runs (
  id text primary key,
  branch text not null,
  total integer not null default 0,
  is_planned boolean not null default false,
  plan_date text,
  plan_from text,
  plan_to text,
  plan_timestamp bigint not null default 0,
  current_call_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.call_run_leads (
  id text primary key,
  call_run_id text not null references public.call_runs(id) on delete cascade,
  lead_id text not null references public.leads(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id text primary key,
  lead_id text references public.leads(id) on delete cascade,
  appointment_date text,
  context text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(id) on delete set null,
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table public.export_logs (
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

create trigger touch_import_batches_updated_at before update on public.import_batches for each row execute function public.touch_updated_at();
create trigger touch_staged_leads_updated_at before update on public.staged_leads for each row execute function public.touch_updated_at();
create trigger touch_leads_updated_at before update on public.leads for each row execute function public.touch_updated_at();
create trigger touch_call_runs_updated_at before update on public.call_runs for each row execute function public.touch_updated_at();
create trigger touch_appointments_updated_at before update on public.appointments for each row execute function public.touch_updated_at();

insert into public.import_batches (id, name, source, row_count)
values ('00000000-0000-0000-0000-000000000001', 'Dashboard Import', 'app', 0)
on conflict (id) do nothing;

alter table public.import_batches enable row level security;
alter table public.staged_leads enable row level security;
alter table public.leads enable row level security;
alter table public.call_runs enable row level security;
alter table public.call_run_leads enable row level security;
alter table public.appointments enable row level security;
alter table public.lead_events enable row level security;
alter table public.export_logs enable row level security;

create policy "public import batches" on public.import_batches for all using (true) with check (true);
create policy "public staged leads" on public.staged_leads for all using (true) with check (true);
create policy "public leads" on public.leads for all using (true) with check (true);
create policy "public call runs" on public.call_runs for all using (true) with check (true);
create policy "public call run leads" on public.call_run_leads for all using (true) with check (true);
create policy "public appointments" on public.appointments for all using (true) with check (true);
create policy "public lead events" on public.lead_events for all using (true) with check (true);
create policy "public export logs" on public.export_logs for all using (true) with check (true);
