-- Textos con más onda y reseñas de ejemplo (centro ficticio)
update centers set
  tagline = 'Tu momento de mimarte ✨ Uñas, depilación definitiva, faciales y pestañas en Palermo.',
  about = 'Somos un espacio pensado para que salgas sintiéndote linda y relajada. Trabajamos con productos de primera, aparatología certificada y muchísimo amor por los detalles.',
  instagram = 'esteticaaurora', color = '#c98ba0'
where id = '00000000-0000-0000-0000-000000000001';

update services s set description = v.d from (values
 ('Esmaltado semipermanente manos','Manos impecables por 3 semanas 💅 Limado, cutículas y el color que más te guste.'),
 ('Kapping gel','Uñas fuertes que crecen sin quebrarse. Ideal si las tuyas son finitas.'),
 ('Uñas esculpidas','El largo y la forma que soñaste: almendra, coffin o cuadradas, con diseño incluido.'),
 ('Belleza de pies con semipermanente','Pies suaves y listos para sandalias. Exfoliación, hidratación y esmaltado.'),
 ('Retiro de semipermanente o esculpidas','Retiro cuidadoso para que tu uña natural quede sana.'),
 ('Láser · axilas','Chau rasuradora. Sesión rápida y casi sin dolor con láser diodo.'),
 ('Láser · bozo y mentón','Piel lisa en la cara, sin irritación ni pelitos que vuelven.'),
 ('Láser · cavado completo','Olvidate de la cera para siempre. Sesión cómoda y discreta.'),
 ('Láser · piernas enteras','Piernas suaves todo el año, sin pelitos encarnados.'),
 ('Láser · cuerpo completo','El combo total: piernas, cavado, axilas, brazos y rostro en una sola sesión.'),
 ('Limpieza facial profunda','Tu piel respira de nuevo 🌿 Higiene, extracción, máscara y masajito final.'),
 ('Dermaplaning','Efecto glow inmediato: sacamos células muertas y pelusa para una piel de porcelana.'),
 ('Peeling químico','Renovación profunda para manchas, marcas de acné y textura.'),
 ('Perfilado de cejas','Cejas prolijas que enmarcan tu mirada, respetando tu forma natural.'),
 ('Laminado de cejas','Cejas peinadas, prolijas y con volumen por 6 semanas.'),
 ('Lifting de pestañas','Pestañas curvas y oscuras sin rímel ni extensiones 👁️ Incluye tinte.'),
 ('Masaje descontracturante','Una hora para soltar tensiones de cuello y espalda. Salís nueva.'),
 ('Drenaje linfático','Desinflama, reduce retención y deja las piernas livianas.')
) v(n,d) where s.name = v.n and s.center_id = '00000000-0000-0000-0000-000000000001';

delete from reviews where center_id = '00000000-0000-0000-0000-000000000001';
insert into reviews (center_id, name, rating, body, service, approved, created_at) values
 ('00000000-0000-0000-0000-000000000001','Lucía F.',5,'Me hice la limpieza facial con Sofía y mi piel quedó increíble. Súper atenta y el lugar es hermoso.','Limpieza facial profunda',true, now() - interval '3 days'),
 ('00000000-0000-0000-0000-000000000001','Florencia D.',5,'Hace meses que me hago el semi con Camila y me dura perfecto. Reservar online es comodísimo.','Esmaltado semipermanente manos',true, now() - interval '8 days'),
 ('00000000-0000-0000-0000-000000000001','Rocío Á.',5,'Llevo 4 sesiones de láser y ya casi no tengo pelitos. Valentina te explica todo y no duele nada.','Láser · cuerpo completo',true, now() - interval '12 days'),
 ('00000000-0000-0000-0000-000000000001','Micaela T.',4,'El lifting de pestañas me encantó, se nota un montón. Volvería sin dudar.','Lifting de pestañas',true, now() - interval '20 days'),
 ('00000000-0000-0000-0000-000000000001','Agustina L.',5,'Las esculpidas quedaron divinas y me duraron un mes entero. ¡Las recomiendo!','Uñas esculpidas',true, now() - interval '27 days');
