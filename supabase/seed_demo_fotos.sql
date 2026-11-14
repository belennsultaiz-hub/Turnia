-- Fotos del centro de ejemplo (Pexels, licencia libre; guardadas en public/demo/)
update centers set cover = '/demo/portada.jpg'
 where id = '00000000-0000-0000-0000-000000000001';
update services s set image = '/demo/' || v.f || '.jpg' from (values
 ('Esmaltado semipermanente manos','semi-manos'),('Kapping gel','kapping'),('Uñas esculpidas','esculpidas'),
 ('Belleza de pies con semipermanente','pies'),('Retiro de semipermanente o esculpidas','retiro'),
 ('Láser · axilas','laser-axilas'),('Láser · bozo y mentón','laser-bozo'),('Láser · cavado completo','laser-cavado'),
 ('Láser · piernas enteras','laser-piernas'),('Láser · cuerpo completo','laser-cuerpo'),
 ('Limpieza facial profunda','limpieza-facial'),('Dermaplaning','dermaplaning'),('Peeling químico','peeling'),
 ('Perfilado de cejas','perfilado-cejas'),('Laminado de cejas','laminado-cejas'),('Lifting de pestañas','lifting-pestanas'),
 ('Masaje descontracturante','masaje'),('Drenaje linfático','drenaje')
) v(n,f) where s.name = v.n and s.center_id = '00000000-0000-0000-0000-000000000001';
select count(*) con_foto from services where image is not null;
