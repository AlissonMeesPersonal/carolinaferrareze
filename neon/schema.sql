-- Landing Carolina Ferrareze • Neon Postgres
-- Execute apenas no banco escolhido, com o SQL Editor do Neon.
-- Todas as tabelas têm prefixo cf_ e NÃO expõem uma API pública de banco.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.cf_site (
 id TEXT PRIMARY KEY DEFAULT 'main' CHECK (id='main'),
 brand TEXT NOT NULL DEFAULT 'Carolina Ferrareze',
 subtitle TEXT NOT NULL DEFAULT 'Autoconhecimento e desenvolvimento pessoal',
 hero_eyebrow TEXT NOT NULL DEFAULT 'UM ESPAÇO PARA SE ESCUTAR',
 hero_title TEXT NOT NULL DEFAULT 'Um novo olhar para a sua história começa aqui.',
 hero_description TEXT NOT NULL DEFAULT 'Um convite ao autoconhecimento, à escuta e ao desenvolvimento pessoal.',
 hero_image_url TEXT NOT NULL DEFAULT '',
 about_image_url TEXT NOT NULL DEFAULT '',
 about_title TEXT NOT NULL DEFAULT 'Prazer, sou Carolina.',
 about_text TEXT NOT NULL DEFAULT 'Adicione aqui sua apresentação e suas formações pelo painel.',
 journey_title TEXT NOT NULL DEFAULT 'Cada história merece um olhar único.',
 journey_text TEXT NOT NULL DEFAULT 'Conheça as possibilidades de atendimento individual e mentoria.',
 whatsapp TEXT NOT NULL DEFAULT '',
 instagram TEXT NOT NULL DEFAULT '',
 contact_email TEXT NOT NULL DEFAULT '',
 seo_title TEXT NOT NULL DEFAULT 'Carolina Ferrareze | Atendimentos e mentorias',
 seo_description TEXT NOT NULL DEFAULT 'Atendimentos e mentorias de Carolina Ferrareze.',
 footer_note TEXT NOT NULL DEFAULT 'Atendimentos e mentorias voltados ao autoconhecimento.',
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cf_services (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 category TEXT NOT NULL CHECK (category IN ('atendimento','mentoria')),
 title TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 details TEXT NOT NULL DEFAULT '',
 image_url TEXT NOT NULL DEFAULT '',
 label TEXT NOT NULL DEFAULT '',
 is_published BOOLEAN NOT NULL DEFAULT FALSE,
 position INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cf_services_position ON public.cf_services(category,position);
CREATE TABLE IF NOT EXISTS public.cf_testimonials (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 display_name TEXT NOT NULL,
 quote TEXT NOT NULL,
 permission_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
 is_published BOOLEAN NOT NULL DEFAULT FALSE,
 position INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cf_faqs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 question TEXT NOT NULL,
 answer TEXT NOT NULL,
 is_published BOOLEAN NOT NULL DEFAULT FALSE,
 position INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS public.cf_leads (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
 whatsapp TEXT NOT NULL CHECK (char_length(whatsapp) BETWEEN 10 AND 22),
 interest TEXT NOT NULL CHECK (interest IN ('atendimento','mentoria','informacoes')),
 consent BOOLEAN NOT NULL CHECK (consent IS TRUE),
 consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 privacy_version TEXT NOT NULL DEFAULT '2026-10',
 source TEXT NOT NULL DEFAULT 'landing',
 status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_contato','agendado','concluido','descartado')),
 admin_notes TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cf_leads_created ON public.cf_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS cf_leads_status ON public.cf_leads(status);
CREATE TABLE IF NOT EXISTS public.cf_admin_sessions (
 token_hash TEXT PRIMARY KEY,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS cf_admin_sessions_expiry ON public.cf_admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS public.cf_request_limits (
 bucket TEXT NOT NULL,
 window_start TIMESTAMPTZ NOT NULL,
 hits INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY (bucket,window_start)
);

INSERT INTO public.cf_site(id) VALUES('main') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.cf_services(category,title,description,details,label,is_published,position)
SELECT 'atendimento','Constelação individual','Um espaço de escuta para olhar histórias e padrões pessoais.',
'Confirme condições e formato com a Carolina.','Atendimento',TRUE,1
WHERE NOT EXISTS (SELECT 1 FROM public.cf_services WHERE category='atendimento');
INSERT INTO public.cf_services(category,title,description,details,label,is_published,position)
SELECT 'mentoria','Mentorias terapêuticas','Um percurso de acompanhamento e desenvolvimento pessoal.',
'Detalhes editáveis no painel.','Mentoria',TRUE,1
WHERE NOT EXISTS (SELECT 1 FROM public.cf_services WHERE category='mentoria');

-- A aplicação deve usar DATABASE_URL apenas em rotas do SERVIDOR.
-- Use um usuário de banco restrito, se possível; nunca exponha DATABASE_URL no navegador.

-- Migration 2026-10-22: editor de Acompanhamento Terapêutico
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS accompaniment_title text NOT NULL DEFAULT 'Acompanhamento Terapêutico',
 ADD COLUMN IF NOT EXISTS accompaniment_intro text NOT NULL DEFAULT 'Para quem deseja desbloquear travas emocionais e desenvolver uma mentalidade mais forte, compreendendo melhor a vida que quer viver e os caminhos para os próprios objetivos.',
 ADD COLUMN IF NOT EXISTS accompaniment_goal text NOT NULL DEFAULT 'O propósito é fortalecer sua estrutura emocional e encontrar mais tranquilidade para lidar com a vida, mesmo quando as circunstâncias ainda não estão como você gostaria.',
 ADD COLUMN IF NOT EXISTS accompaniment_topics text NOT NULL DEFAULT E'Mundo interno|Olhar para suas sombras, a maneira como você vê o mundo, autoestima e merecimento.\\nDesbloqueio emocional|Reconhecer feridas, traumas e bloqueios que podem estar limitando sua prosperidade.\\nMentalidade|Desenvolver recursos para lidar com situações e cultivar mais paz mental.',
 ADD COLUMN IF NOT EXISTS accompaniment_format text NOT NULL DEFAULT E'Frequência mensal ou quinzenal.\\nSessões de uma hora.\\nAtendimento online via Zoom ou WhatsApp.',
 ADD COLUMN IF NOT EXISTS accompaniment_packages text NOT NULL DEFAULT E'Pacote de 3 sessões\\nPacote de 6 sessões';
