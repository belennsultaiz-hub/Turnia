alter table centers add column if not exists preview boolean default false; update centers set preview = true where slug = 'glow';
