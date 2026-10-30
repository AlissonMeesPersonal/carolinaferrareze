-- Seção 03: Comunidade Bota a Mão na Consciência.
-- A mudança preserva os registros históricos de cf_services.
ALTER TABLE public.cf_site
ADD COLUMN IF NOT EXISTS community_features TEXT NOT NULL DEFAULT 'Vídeos novos toda semana\nReflexões\nExercícios\nMeditações\nEncontros',
ADD COLUMN IF NOT EXISTS community_tagline TEXT NOT NULL DEFAULT 'Um espaço sem meias palavras, para quem quer ir além do superficial e construir uma vida com mais consciência, paz e alegria.',
ADD COLUMN IF NOT EXISTS community_cta_label TEXT NOT NULL DEFAULT 'Conhecer a comunidade',
ADD COLUMN IF NOT EXISTS community_logo_url TEXT NOT NULL DEFAULT '';
