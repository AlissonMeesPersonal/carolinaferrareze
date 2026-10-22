-- CMS: imagens das seções e galeria de relatos editáveis pelo painel
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS mentoring_image_url TEXT NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS editorial_image_url TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS public.cf_gallery_media (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 url TEXT NOT NULL,
 caption TEXT NOT NULL DEFAULT '',
 alt_text TEXT NOT NULL DEFAULT '',
 position INTEGER NOT NULL DEFAULT 0,
 consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
 is_published BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
