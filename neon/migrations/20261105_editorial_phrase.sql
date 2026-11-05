-- Mensagem de encerramento editável na landing da Carolina.
ALTER TABLE public.cf_site
ADD COLUMN IF NOT EXISTS closing_phrase TEXT NOT NULL DEFAULT 'Seus sonhos merecem sua disciplina';
