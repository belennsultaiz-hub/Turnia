-- Turnia: sistema de turnos para centros de estética (multi-centro)
create extension if not exists pgcrypto;

create table centers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  address text,
  whatsapp text,
  instagram text,
  email text,
  color text default '#b5838d',
  logo text,
  slot_min int not null default 30,          -- cada cuánto se ofrecen horarios
  min_notice_h int not null default 2,       -- anticipación mínima para reservar
  max_days int not null default 30,          -- hasta cuántos días adelante
  deposit_note text,                         -- texto sobre la seña
  plan text default 'prueba',
  active boolean not null default true,
  created_at timestamptz default now()
);

create table center_users (
  center_id uuid references centers on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null default 'duena',
  primary key (center_id, user_id)
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  name text not null,
  role text,
  photo text,
  services uuid[],                            -- null = hace todos
  active boolean not null default true,
  sort int default 0
);

create table services (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  name text not null,
  description text,
  category text,
  duration_min int not null default 60,
  price numeric not null default 0,
  deposit numeric not null default 0,         -- seña (editable por el centro)
  active boolean not null default true,
  sort int default 0
);

create table hours (                          -- horario de atención semanal
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  professional_id uuid not null references professionals on delete cascade,
  weekday int not null check (weekday between 0 and 6), -- 0 domingo
  start_time time not null,
  end_time time not null
);

create table blocks (                         -- horarios bloqueados
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  professional_id uuid references professionals on delete cascade, -- null = todo el centro
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz default now(),
  unique (center_id, phone)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  professional_id uuid not null references professionals on delete cascade,
  service_id uuid references services on delete set null,
  client_id uuid references clients on delete set null,
  service_name text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'reservado'
    check (status in ('reservado','confirmado','cancelado','asistio','ausente')),
  price numeric default 0,
  deposit numeric default 0,
  deposit_paid boolean default false,
  notes text,
  source text default 'online',
  token text unique default encode(gen_random_bytes(12),'hex'),
  created_at timestamptz default now()
);
create index on appointments (center_id, starts_at);
create index on appointments (professional_id, starts_at);

-- Seguridad: cada centro ve solo lo suyo
create or replace function mis_centros() returns setof uuid
language sql stable security definer set search_path = public as
$$ select center_id from center_users where user_id = auth.uid() $$;

alter table centers enable row level security;
alter table center_users enable row level security;
alter table professionals enable row level security;
alter table services enable row level security;
alter table hours enable row level security;
alter table blocks enable row level security;
alter table clients enable row level security;
alter table appointments enable row level security;

create policy "mi centro" on centers for all to authenticated
  using (id in (select mis_centros())) with check (id in (select mis_centros()));
create policy "mis membresias" on center_users for select to authenticated
  using (user_id = auth.uid());
do $$ declare t text; begin
  foreach t in array array['professionals','services','hours','blocks','clients','appointments'] loop
    execute format('create policy "mi centro" on %I for all to authenticated
      using (center_id in (select mis_centros())) with check (center_id in (select mis_centros()))', t);
  end loop;
end $$;
