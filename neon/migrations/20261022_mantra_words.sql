-- Editor do site > Palavras da faixa. Mantém as quatro expressões existentes.
ALTER TABLE public.cf_site
 ADD COLUMN IF NOT EXISTS mantra_words TEXT NOT NULL
 DEFAULT 'acolher, compreender, ressignificar, florescer';
