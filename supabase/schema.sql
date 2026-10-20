-- Carolina Ferrareze | Execute SOMENTE no projeto efahamylmoueniflnvzl
-- Schema independente (prefixo cf_). RLS ativo em todas as tabelas.
create extension if not exists pgcrypto;

create table if not exists public.cf_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cf_admins enable row level security;
drop policy if exists "cf_admin_read_self" on public.cf_admins;
create policy "cf_admin_read_self" on public.cf_admins for select to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.cf_site (
  id text primary key default 'main' check (id = 'main'),
  brand text not null default 'Carolina Ferrareze',
  subtitle text not null default 'Autoconhecimento e desenvolvimento pessoal',
  hero_eyebrow text not null default 'UM ESPAÇO PARA SE ESCUTAR',
  hero_title text not null default 'Um novo olhar para a sua história começa aqui.',
  hero_description text not null default 'Um convite ao autoconhecimento, à escuta e à transformação da forma como você se relaciona com sua própria história.',
  hero_image_url text not null default '',
  about_image_url text not null default '',
  about_title text not null default 'Prazer, sou Carolina.',
  about_text text not null default 'Este espaço será dedicado à sua apresentação, trajetória, abordagem e formações. Conte sua história pelo painel administrativo.',
  journey_title text not null default 'Cada história merece um olhar único.',
  journey_text text not null default 'Conheça as possibilidades de atendimento individual e mentoria. Escolha o caminho que mais combina com seu momento.',
  whatsapp text not null default '',
  instagram text not null default 'https://www.instagram.com/',
  contact_email text not null default '',
  seo_title text not null default 'Carolina Ferrareze | Atendimentos e mentorias',
  seo_description text not null default 'Conheça os atendimentos e mentorias de Carolina Ferrareze e entre em contato.',
  footer_note text not null default 'Atendimentos e mentorias voltados ao autoconhecimento.',
  updated_at timestamptz not null default now()
);
alter table public.cf_site enable row level security;

create table if not exists public.cf_services (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('atendimento','mentoria')),
  title text not null,
  description text not null default '',
  details text not null default '',
  image_url text not null default '',
  label text not null default '',
  is_published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.cf_services enable row level security;
create index if not exists cf_services_order_idx on public.cf_services (category,position);

create table if not exists public.cf_testimonials (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  quote text not null,
  permission_confirmed boolean not null default false,
  is_published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.cf_testimonials enable row level security;

create table if not exists public.cf_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default false,
  position integer not null default 0
);
alter table public.cf_faqs enable row level security;

create table if not exists public.cf_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  whatsapp text not null check (char_length(whatsapp) between 8 and 22),
  interest text not null check (interest in ('atendimento','mentoria','informacoes')),
  consent boolean not null check (consent = true),
  consent_at timestamptz not null default now(),
  privacy_version text not null default '2026-10',
  source text not null default 'landing',
  status text not null default 'novo' check (status in ('novo','em_contato','agendado','concluido','descartado')),
  admin_notes text not null default '',
  created_at timestamptz not null default now()
);
alter table public.cf_leads enable row level security;
create index if not exists cf_leads_created_idx on public.cf_leads (created_at desc);
create index if not exists cf_leads_status_idx on public.cf_leads (status);

-- Leitura pública somente do conteúdo publicado; administração somente de usuários autorizados.
drop policy if exists "cf_site_public_read" on public.cf_site;
create policy "cf_site_public_read" on public.cf_site for select to anon, authenticated using (true);
drop policy if exists "cf_site_admin_update" on public.cf_site;
create policy "cf_site_admin_update" on public.cf_site for update to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

drop policy if exists "cf_services_public_read" on public.cf_services;
create policy "cf_services_public_read" on public.cf_services for select to anon, authenticated
  using (is_published or exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_services_admin_write" on public.cf_services;
create policy "cf_services_admin_write" on public.cf_services for all to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

drop policy if exists "cf_testimonials_public_read" on public.cf_testimonials;
create policy "cf_testimonials_public_read" on public.cf_testimonials for select to anon, authenticated
  using ((is_published and permission_confirmed) or exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_testimonials_admin_write" on public.cf_testimonials;
create policy "cf_testimonials_admin_write" on public.cf_testimonials for all to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

drop policy if exists "cf_faqs_public_read" on public.cf_faqs;
create policy "cf_faqs_public_read" on public.cf_faqs for select to anon, authenticated
  using (is_published or exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_faqs_admin_write" on public.cf_faqs;
create policy "cf_faqs_admin_write" on public.cf_faqs for all to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

drop policy if exists "cf_leads_admin_read" on public.cf_leads;
create policy "cf_leads_admin_read" on public.cf_leads for select to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_leads_admin_update" on public.cf_leads;
create policy "cf_leads_admin_update" on public.cf_leads for update to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_leads_admin_delete" on public.cf_leads;
create policy "cf_leads_admin_delete" on public.cf_leads for delete to authenticated
  using (exists (select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

revoke all on public.cf_leads from anon;
grant select, update, delete on public.cf_leads to authenticated;
grant select on public.cf_admins to authenticated;
grant select on public.cf_site, public.cf_services, public.cf_testimonials, public.cf_faqs to anon;
grant select, insert, update, delete on public.cf_site, public.cf_services, public.cf_testimonials, public.cf_faqs to authenticated;
grant all on public.cf_site, public.cf_services, public.cf_testimonials, public.cf_faqs, public.cf_leads to service_role;

insert into public.cf_site (id) values ('main') on conflict (id) do nothing;
insert into public.cf_services (category,title,description,details,label,is_published,position)
select 'atendimento','Constelação individual','Um espaço de escuta para olhar histórias e padrões pessoais.',
'Atendimento individual. Detalhes, duração e disponibilidade sujeitos à confirmação com Carolina.','Atendimento',true,1
where not exists (select 1 from public.cf_services where title='Constelação individual');
insert into public.cf_services (category,title,description,details,label,is_published,position)
select 'mentoria','Mentorias terapêuticas','Um percurso de acompanhamento e desenvolvimento pessoal.',
'Conteúdo, formato e condições editáveis pela Carolina no painel.','Mentoria',true,1
where not exists (select 1 from public.cf_services where title='Mentorias terapêuticas');

-- Biblioteca de imagens publicamente legíveis e graváveis somente por admin.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('cf-media','cf-media',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
drop policy if exists "cf_media_admin_select" on storage.objects;
create policy "cf_media_admin_select" on storage.objects for select to authenticated
 using (bucket_id='cf-media' and exists(select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_media_admin_insert" on storage.objects;
create policy "cf_media_admin_insert" on storage.objects for insert to authenticated
 with check (bucket_id='cf-media' and exists(select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_media_admin_update" on storage.objects;
create policy "cf_media_admin_update" on storage.objects for update to authenticated
 using (bucket_id='cf-media' and exists(select 1 from public.cf_admins a where a.user_id = (select auth.uid())))
 with check (bucket_id='cf-media' and exists(select 1 from public.cf_admins a where a.user_id = (select auth.uid())));
drop policy if exists "cf_media_admin_delete" on storage.objects;
create policy "cf_media_admin_delete" on storage.objects for delete to authenticated
 using (bucket_id='cf-media' and exists(select 1 from public.cf_admins a where a.user_id = (select auth.uid())));

-- Após criar a usuária no Supabase Auth, associe seu UUID pelo SQL Editor:
-- insert into public.cf_admins (user_id) values ('UUID_AUTH_DA_CAROLINA') on conflict do nothing;
