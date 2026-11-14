-- Fotos del ejemplo con dirección relativa (sirven en cualquier dominio)
update services set image = replace(image, 'https://turnia.decobazar.workers.dev', '') where image like 'https://turnia.decobazar.workers.dev/%';
update centers set cover = replace(cover, 'https://turnia.decobazar.workers.dev', '') where cover like 'https://turnia.decobazar.workers.dev/%';
