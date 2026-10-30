-- Controle opcional do formulário de contato pelo editor.
-- Desativado inicialmente para priorizar WhatsApp; não apaga contatos existentes.
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS form_enabled BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE public.cf_site SET form_enabled = FALSE, updated_at = now() WHERE id = 'main';
