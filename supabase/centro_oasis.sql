-- Página de prueba para Oasis Estética (Quilmes), armada con lo que mandaron por WhatsApp. Sin precios: dicen "Consultá precio".
insert into centers (id, slug, name, tagline, about, address, whatsapp, instagram, color, logo, cover, slot_min, min_notice_h, max_days, preview)
values ('00000000-0000-0000-0000-0000000000c1', 'oasis', 'Oasis Estética',
 '🌿 Belleza, bienestar y cuidado · Quilmes',
 'Estamos para ayudarte a encontrar el tratamiento ideal para vos. Faciales, corporales con aparatología, masajes y depilación definitiva en un solo lugar.',
 'General Paz 420, Quilmes', '5491167566341', 'oasisesteticaquilmes', '#9c8466',
 '/oasis/logo.jpg', '/oasis/portada.jpg', 30, 4, 45, true)
on conflict (slug) do nothing;

delete from services where center_id = '00000000-0000-0000-0000-0000000000c1';
insert into services (center_id, category, name, description, duration_min, price, deposit, sort, image) values
 ('00000000-0000-0000-0000-0000000000c1','Faciales','Tratamientos faciales','Tratamientos personalizados según tu tipo de piel para que luzca sana y luminosa ✨',60,0,0,1,'/oasis/faciales.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Faciales','Limpieza facial','Higiene profunda, extracción e hidratación. Tu piel respira de nuevo 🌿',60,0,0,2,'/oasis/limpieza-facial.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Faciales','Plasma rico en plaquetas','Estimula la regeneración natural de la piel: más firmeza, luminosidad y textura pareja.',60,0,0,3,'/oasis/plasma.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Faciales','HIFU','Ultrasonido focalizado para tensar y lograr un efecto lifting sin cirugía ⚡',60,0,0,4,'/oasis/hifu.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Corporales','Liposonix','Ultrasonido que trabaja la grasa localizada para modelar tu figura 🔥',60,0,0,10,'/oasis/liposonix.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Corporales','Vela Slim','Reduce centímetros y mejora la celulitis con tecnología de última generación 💫',45,0,0,11,'/oasis/vela-slim.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Corporales','BodyBup','Tonifica y levanta glúteos con estimulación muscular ✨',45,0,0,12,null),
 ('00000000-0000-0000-0000-0000000000c1','Corporales','Tratamientos corporales con aparatología','Te armamos un plan combinando equipos según tu objetivo 🌸',60,0,0,13,'/oasis/aparatologia.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Masajes','Masajes descontracturantes','Una hora para soltar tensiones de cuello y espalda 💆‍♀️',60,0,0,20,'/oasis/masajes-descontracturantes.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Masajes','Masajes reductores','Activan la circulación y ayudan a modelar la figura 🌸',60,0,0,21,'/oasis/masajes-reductores.jpg'),
 ('00000000-0000-0000-0000-0000000000c1','Depilación','Depilación definitiva','Piel suave todo el año, sin pelitos ni irritación ⚡',30,0,0,30,'/oasis/depilacion.jpg');

delete from professionals where center_id = '00000000-0000-0000-0000-0000000000c1';
insert into professionals (id, center_id, name, role, sort) values
 ('00000000-0000-0000-0000-0000000000c2','00000000-0000-0000-0000-0000000000c1','Equipo Oasis','Estética facial y corporal',1);
delete from hours where center_id = '00000000-0000-0000-0000-0000000000c1';
insert into hours (center_id, professional_id, weekday, start_time, end_time)
select '00000000-0000-0000-0000-0000000000c1','00000000-0000-0000-0000-0000000000c2', d, '09:00','19:00' from generate_series(1,6) d;
select count(*) from services where center_id='00000000-0000-0000-0000-0000000000c1';
