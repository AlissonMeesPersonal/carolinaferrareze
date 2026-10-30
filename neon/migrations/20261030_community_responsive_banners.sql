-- Banners responsivos para a Comunidade BMC.
-- A URL antiga de mentoria é preservada como fallback; nenhuma imagem existente é apagada.
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS community_desktop_image_url TEXT NOT NULL DEFAULT '',
 ADD COLUMN IF NOT EXISTS community_mobile_image_url TEXT NOT NULL DEFAULT '';
