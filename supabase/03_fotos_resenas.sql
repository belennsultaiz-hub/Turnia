-- Fotos de servicios / portada y reseñas
alter table services add column if not exists image text;
alter table centers add column if not exists cover text;
alter table centers add column if not exists about text;

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers on delete cascade,
  name text not null,
  rating int not null check (rating between 1 and 5),
  body text,
  service text,
  approved boolean not null default false,   -- el centro la aprueba antes de mostrarla
  created_at timestamptz default now()
);
alter table reviews enable row level security;
create policy "mi centro" on reviews for all to authenticated
  using (center_id in (select mis_centros())) with check (center_id in (select mis_centros()));

-- Bucket público de fotos; cada centro sube solo en su carpeta (<center_id>/...)
insert into storage.buckets (id, name, public) values ('fotos','fotos', true) on conflict (id) do nothing;
create policy "fotos subir" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1]::uuid in (select mis_centros()));
create policy "fotos cambiar" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1]::uuid in (select mis_centros()));
create policy "fotos borrar" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1]::uuid in (select mis_centros()));
