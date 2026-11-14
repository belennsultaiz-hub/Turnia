-- Centro de ejemplo para mostrar (datos ficticios)
insert into centers (id, slug, name, tagline, address, whatsapp, instagram, color, deposit_note)
values ('00000000-0000-0000-0000-000000000001','demo','Estética Aurora (ejemplo)',
 'Centro de estética de ejemplo para probar el sistema','Av. Siempreviva 123, CABA',
 '5491154229687','', '#b5838d',
 'La seña se descuenta del total del tratamiento. Si cancelás con 24 h de anticipación te la devolvemos.');

insert into professionals (id, center_id, name, role, sort) values
 ('00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-000000000001','Sofía','Cosmetóloga',1),
 ('00000000-0000-0000-0000-0000000000a2','00000000-0000-0000-0000-000000000001','Valentina','Depilación y masajes',2),
 ('00000000-0000-0000-0000-0000000000a3','00000000-0000-0000-0000-000000000001','Camila','Manos y pestañas',3);

insert into services (center_id, name, category, description, duration_min, price, deposit, sort) values
 ('00000000-0000-0000-0000-000000000001','Limpieza facial profunda','Faciales','Higiene, extracción y máscara según tu piel.',60,25000,5000,1),
 ('00000000-0000-0000-0000-000000000001','Dermaplaning','Faciales','Exfoliación que deja la piel lisa y luminosa.',45,30000,6000,2),
 ('00000000-0000-0000-0000-000000000001','Depilación láser · zona chica','Depilación','Axilas, bozo o cavado simple.',30,18000,4000,3),
 ('00000000-0000-0000-0000-000000000001','Depilación láser · cuerpo completo','Depilación',null,90,60000,10000,4),
 ('00000000-0000-0000-0000-000000000001','Masaje descontracturante','Corporales',null,60,28000,5000,5),
 ('00000000-0000-0000-0000-000000000001','Drenaje linfático','Corporales',null,60,26000,5000,6),
 ('00000000-0000-0000-0000-000000000001','Esmaltado semipermanente','Manos','Incluye limado y cutículas.',60,15000,3000,7),
 ('00000000-0000-0000-0000-000000000001','Lifting de pestañas','Mirada',null,60,22000,5000,8);

update professionals set services = (select array_agg(id) from services where category in ('Faciales')) where id='00000000-0000-0000-0000-0000000000a1';
update professionals set services = (select array_agg(id) from services where category in ('Depilación','Corporales')) where id='00000000-0000-0000-0000-0000000000a2';
update professionals set services = (select array_agg(id) from services where category in ('Manos','Mirada','Faciales')) where id='00000000-0000-0000-0000-0000000000a3';

insert into hours (center_id, professional_id, weekday, start_time, end_time)
select '00000000-0000-0000-0000-000000000001', p.id, d, '09:00', '18:00'
from professionals p, generate_series(1,5) d where p.center_id='00000000-0000-0000-0000-000000000001';
insert into hours (center_id, professional_id, weekday, start_time, end_time)
select '00000000-0000-0000-0000-000000000001', p.id, 6, '10:00', '14:00'
from professionals p where p.center_id='00000000-0000-0000-0000-000000000001';
