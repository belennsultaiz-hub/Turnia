-- Página de prueba para Glow Alisados (Banfield), armada con la info pública de su Instagram para mostrársela.
insert into centers (id, slug, name, tagline, about, address, whatsapp, instagram, color, logo, cover, slot_min, min_notice_h, max_days, deposit_note)
values ('00000000-0000-0000-0000-0000000000b1', 'glow', 'Glow Alisados',
 '✨ Expertas en alisados · Resultados reales, sin frizz · Banfield',
 'Estudio capilar en Banfield. Te asesoramos con honestidad para elegir el tratamiento ideal para tu cabello y te enseñamos a cuidarlo después. Los precios pueden tener adicionales según largo o cantidad: la profesional te confirma el presupuesto antes de empezar.',
 'Villa Barceló 387, esq. Cap. Rojas, Banfield', 'https://wa.me/message/Z6I2ROMN3DS2H1', 'glowcentrodebelleza.ok', '#e2739a',
 '/glow/logo.jpg', '/glow/portada.jpg', 60, 12, 45,
 'Los turnos se reservan con una seña de $10.000 (transferencia o efectivo en el local). Cancelando con 24 h de anticipación conservás la seña; si no, se pierde. Venís con el cabello lavado solo con shampoo neutro y sin planchar.')
on conflict (slug) do nothing;

delete from services where center_id = '00000000-0000-0000-0000-0000000000b1';
insert into services (center_id, category, name, description, duration_min, price, deposit, sort, image) values
 ('00000000-0000-0000-0000-0000000000b1','Alisados','Alisado Power','Ideal para rulos o rizos muy definidos desde la raíz. Dura 3 a 6 meses. Incluye lavado detox, nanotecnología + Photon Lizze.',180,75000,10000,1,'/glow/alisado-power.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Alisados','Alisado Premium','Para cabellos gruesos, con ondas marcadas, procesados por color o voluminosos. Dura 3 a 6 meses.',180,75000,10000,2,'/glow/alisado-premium.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Alisados','Alisado Golden','Para cabellos finos, con ondas suaves, mucho frizz o procesados. Dura 3 a 6 meses.',180,75000,10000,3,'/glow/alisado-golden.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Alisados','Retoque de alisado + Keractiva','Mantenimiento dentro de los 3 meses: alisa el crecimiento nuevo (hasta 3 cm) y vuelve a sellar el largo.',150,55000,10000,4,'/glow/retoque.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Alisado sin formol','Alisado Free sin formol','Progresivo, ideal para embarazadas, alérgicas y niñas mayores de 13. No apto para decolorados. Avisá con tiempo: hay pocos turnos.',210,120000,10000,10,'/glow/free-sin-formol.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Alisado sin formol','Retoque de alisado Free sin formol',null,180,80000,10000,11,'/glow/retoque-free.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Tratamientos','Keractiva (anti volumen y frizz)','No alisa: baja el volumen, da brillo extremo y deja el pelo más prolijo. Dura 30 a 40 días.',120,50000,10000,20,'/glow/keractiva.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Tratamientos','Laminado nutritivo (anti frizz)','Nutrición e hidratación progresiva para cabellos saturados por color o decolorados. Incluye fototerapia capilar.',90,50000,10000,21,'/glow/laminado-nutritivo.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Tratamientos','Laminado Plex','Reconstructivo para rubios castigados o muy maltratados. Incluye plancha en frío infrared + corte o split.',120,50000,10000,22,'/glow/laminado-plex.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Tratamientos','Bomba nutritiva Glow (express)','Brillo y suavidad en una sesión: hidratación de argán, gorro térmico, ozonoterapia y corte bordado.',60,35000,10000,23,'/glow/bomba-nutritiva.jpg'),
 ('00000000-0000-0000-0000-0000000000b1','Kids / Teens','Laminado Gummy','Para nenas de 4 a 14 años, sin formol: controla el frizz y el volumen sin alisar. De regalo, corte de puntas o flequillo.',90,50000,10000,30,null),
 ('00000000-0000-0000-0000-0000000000b1','Maquillaje y peinado','Maquillaje y peinado','Maquillaje profesional y peinado personalizado para tu ocasión especial. Grupos de 3 o más: vamos a domicilio.',120,120000,10000,40,'/glow/maquillaje-peinado.jpg');

delete from professionals where center_id = '00000000-0000-0000-0000-0000000000b1';
insert into professionals (id, center_id, name, role, sort) values
 ('00000000-0000-0000-0000-0000000000b2','00000000-0000-0000-0000-0000000000b1','Equipo Glow','Alisados y tratamientos',1);
delete from hours where center_id = '00000000-0000-0000-0000-0000000000b1';
insert into hours (center_id, professional_id, weekday, start_time, end_time)
select '00000000-0000-0000-0000-0000000000b1','00000000-0000-0000-0000-0000000000b2', d, '09:00','19:00' from generate_series(1,6) d;

delete from reviews where center_id = '00000000-0000-0000-0000-0000000000b1';
insert into reviews (center_id, name, rating, body, approved, created_at) values
 ('00000000-0000-0000-0000-0000000000b1','Tamara S.',5,'Excelente trabajo, me atiendo desde 2021 con las chicas, siempre amorosas, y por sobre todo cuidando siempre mi cabello. Siempre glow 💜',true, now()-interval '150 days'),
 ('00000000-0000-0000-0000-0000000000b1','Tania Magali O.',5,'Las chicas fueron súper honestas conmigo y me dijeron que no me convenía el alisado, así que empezamos a nutrir el pelo. Desde hace casi 1 año tengo un pelazo increíble.',true, now()-interval '151 days'),
 ('00000000-0000-0000-0000-0000000000b1','Agustina G.',5,'Excelente atención de todas las chicas, me súper guiaron con el cuidado de mi pelo. Me quedó precioso, muy lacio y sano 💗',true, now()-interval '152 days'),
 ('00000000-0000-0000-0000-0000000000b1','María Eugenia H.',5,'Hermoso lugar, me dejaron el pelo divino, de otro mundo. Muy recomendable.',true, now()-interval '153 days'),
 ('00000000-0000-0000-0000-0000000000b1','Martu G.',5,'Un 10/10, re amorosas y el pelo quedó hermoso. Las recomiendo a todas mis amigas y todas vuelven felices.',true, now()-interval '154 days'),
 ('00000000-0000-0000-0000-0000000000b1','Daiana D.',5,'Las descubrí hace muy poquito, fui una vez y no las cambio más!!! Son amorosas y súper profesionales.',true, now()-interval '155 days'),
 ('00000000-0000-0000-0000-0000000000b1','Barbara Ailin J.',5,'Las mejores. Me hice varios alisados en muchos lugares y nunca me quedó el pelo como ellas lo dejaron. Con un brillo hermoso y súper suave.',true, now()-interval '156 days');
select count(*) from services where center_id='00000000-0000-0000-0000-0000000000b1';
