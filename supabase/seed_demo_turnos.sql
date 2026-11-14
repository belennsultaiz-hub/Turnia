-- Turnos ficticios para que el panel de ejemplo se vea con movimiento
delete from appointments where center_id='00000000-0000-0000-0000-000000000001';
delete from clients where center_id='00000000-0000-0000-0000-000000000001';
insert into clients (center_id,name,phone,email,notes) values
 ('00000000-0000-0000-0000-000000000001','Lucía Fernández','1100000001',null,'Piel sensible. Prefiere turnos a la mañana.'),
 ('00000000-0000-0000-0000-000000000001','Martina Gómez','1100000002',null,null),
 ('00000000-0000-0000-0000-000000000001','Julieta Pérez','1100000003',null,'Alergia al látex.'),
 ('00000000-0000-0000-0000-000000000001','Agustina López','1100000004',null,null),
 ('00000000-0000-0000-0000-000000000001','Florencia Díaz','1100000005',null,'Viene cada 3 semanas a semipermanente.'),
 ('00000000-0000-0000-0000-000000000001','Carolina Ruiz','1100000006',null,null),
 ('00000000-0000-0000-0000-000000000001','Micaela Torres','1100000007',null,null),
 ('00000000-0000-0000-0000-000000000001','Rocío Álvarez','1100000008',null,null);

-- (día desde hoy, hora, clienta, servicio, profesional, estado)
with t(d,h,cli,serv,prof,est) as (values
 (-21,'10:00','Florencia Díaz','Esmaltado semipermanente manos','a3','asistio'),
 (-14,'11:00','Lucía Fernández','Limpieza facial profunda','a1','asistio'),
 (-7,'15:00','Julieta Pérez','Láser · axilas','a2','ausente'),
 (-3,'10:00','Florencia Díaz','Esmaltado semipermanente manos','a3','asistio'),
 (2,'09:00','Lucía Fernández','Dermaplaning','a1','confirmado'),
 (2,'11:00','Martina Gómez','Láser · piernas enteras','a2','reservado'),
 (2,'14:00','Agustina López','Uñas esculpidas','a3','confirmado'),
 (3,'10:00','Carolina Ruiz','Masaje descontracturante','a2','reservado'),
 (3,'12:00','Micaela Torres','Lifting de pestañas','a3','confirmado'),
 (3,'16:00','Julieta Pérez','Limpieza facial profunda','a1','reservado'),
 (4,'09:30','Rocío Álvarez','Láser · cuerpo completo','a2','confirmado'),
 (4,'15:00','Florencia Díaz','Kapping gel','a3','reservado'),
 (5,'11:00','Martina Gómez','Laminado de cejas','a1','reservado'),
 (5,'17:00','Agustina López','Drenaje linfático','a2','confirmado'),
 (6,'10:00','Carolina Ruiz','Peeling químico','a1','reservado'))
insert into appointments (center_id,professional_id,service_id,client_id,service_name,starts_at,ends_at,status,price,deposit,deposit_paid,source)
select '00000000-0000-0000-0000-000000000001', ('00000000-0000-0000-0000-0000000000'||t.prof)::uuid, s.id, c.id, s.name,
  ((now() at time zone 'America/Argentina/Buenos_Aires')::date + t.d + t.h::time) at time zone 'America/Argentina/Buenos_Aires',
  ((now() at time zone 'America/Argentina/Buenos_Aires')::date + t.d + t.h::time) at time zone 'America/Argentina/Buenos_Aires' + make_interval(mins => s.duration_min),
  t.est, s.price, s.deposit, t.est in ('confirmado','asistio'), 'online'
from t join services s on s.name=t.serv and s.center_id='00000000-0000-0000-0000-000000000001'
       join clients c on c.name=t.cli and c.center_id='00000000-0000-0000-0000-000000000001';
select count(*) turnos from appointments where center_id='00000000-0000-0000-0000-000000000001';
