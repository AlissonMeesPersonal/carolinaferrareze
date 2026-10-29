-- Hero: três botões editáveis; o checkout Hotmart só é ativado ao informar URL.
-- Não altera textos nem imagens já cadastrados pela Carolina.
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS hero_cta_individual_label TEXT NOT NULL DEFAULT 'Acompanhamento Individual',
 ADD COLUMN IF NOT EXISTS hero_cta_constelacao_label TEXT NOT NULL DEFAULT 'Quero Constelar',
 ADD COLUMN IF NOT EXISTS hero_cta_bmc_label TEXT NOT NULL DEFAULT 'Comunidade BMC',
 ADD COLUMN IF NOT EXISTS bmc_hotmart_url TEXT NOT NULL DEFAULT '';
