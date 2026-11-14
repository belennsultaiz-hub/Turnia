-- Evita dos turnos superpuestos para la misma profesional
create extension if not exists btree_gist;
alter table appointments add constraint sin_superponer
  exclude using gist (professional_id with =, tstzrange(starts_at, ends_at) with &&)
  where (status <> 'cancelado');
