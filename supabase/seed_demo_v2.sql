-- Centro de ejemplo más completo (datos ficticios, para mostrar)
delete from services where center_id='00000000-0000-0000-0000-000000000001';
update centers set name='Estética Aurora', tagline='Uñas, depilación definitiva, faciales y más. Reservá tu turno online.',
  address='Palermo, CABA' where id='00000000-0000-0000-0000-000000000001';

insert into services (center_id, category, name, description, duration_min, price, deposit, sort) values
 ('00000000-0000-0000-0000-000000000001','Uñas','Esmaltado semipermanente manos','Incluye limado, cutículas y esmaltado a elección.',60,15000,3000,1),
 ('00000000-0000-0000-0000-000000000001','Uñas','Kapping gel','Capa de gel sobre la uña natural para que crezca más fuerte.',75,19000,4000,2),
 ('00000000-0000-0000-0000-000000000001','Uñas','Uñas esculpidas','Extensión en gel o acrílico, forma y largo a elección.',120,28000,6000,3),
 ('00000000-0000-0000-0000-000000000001','Uñas','Belleza de pies con semipermanente',null,60,17000,3000,4),
 ('00000000-0000-0000-0000-000000000001','Uñas','Retiro de semipermanente o esculpidas',null,30,6000,0,5),
 ('00000000-0000-0000-0000-000000000001','Depilación definitiva','Láser · axilas',null,20,12000,3000,10),
 ('00000000-0000-0000-0000-000000000001','Depilación definitiva','Láser · bozo y mentón',null,20,11000,3000,11),
 ('00000000-0000-0000-0000-000000000001','Depilación definitiva','Láser · cavado completo',null,30,18000,4000,12),
 ('00000000-0000-0000-0000-000000000001','Depilación definitiva','Láser · piernas enteras',null,45,32000,6000,13),
 ('00000000-0000-0000-0000-000000000001','Depilación definitiva','Láser · cuerpo completo','Piernas, cavado, axilas, brazos y rostro.',90,60000,10000,14),
 ('00000000-0000-0000-0000-000000000001','Faciales','Limpieza facial profunda','Higiene, extracción y máscara según tu tipo de piel.',60,25000,5000,20),
 ('00000000-0000-0000-0000-000000000001','Faciales','Dermaplaning','Exfoliación que deja la piel lisa y luminosa.',45,30000,6000,21),
 ('00000000-0000-0000-0000-000000000001','Faciales','Peeling químico',null,45,32000,6000,22),
 ('00000000-0000-0000-0000-000000000001','Cejas y pestañas','Perfilado de cejas',null,30,9000,0,30),
 ('00000000-0000-0000-0000-000000000001','Cejas y pestañas','Laminado de cejas',null,45,16000,3000,31),
 ('00000000-0000-0000-0000-000000000001','Cejas y pestañas','Lifting de pestañas','Incluye tinte.',60,22000,5000,32),
 ('00000000-0000-0000-0000-000000000001','Corporales','Masaje descontracturante',null,60,28000,5000,40),
 ('00000000-0000-0000-0000-000000000001','Corporales','Drenaje linfático',null,60,26000,5000,41);

update professionals set name='Sofía', role='Cosmetóloga',
  services=(select array_agg(id) from services where center_id='00000000-0000-0000-0000-000000000001' and category in ('Faciales','Cejas y pestañas'))
  where id='00000000-0000-0000-0000-0000000000a1';
update professionals set name='Valentina', role='Depilación y corporales',
  services=(select array_agg(id) from services where center_id='00000000-0000-0000-0000-000000000001' and category in ('Depilación definitiva','Corporales'))
  where id='00000000-0000-0000-0000-0000000000a2';
update professionals set name='Camila', role='Manicura',
  services=(select array_agg(id) from services where center_id='00000000-0000-0000-0000-000000000001' and category in ('Uñas','Cejas y pestañas'))
  where id='00000000-0000-0000-0000-0000000000a3';
select category, count(*) from services group by 1 order by 1;
