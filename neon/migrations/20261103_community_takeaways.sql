-- Blocos editáveis "O que você vai encontrar?".
-- Preserva os dados existentes e publica os textos oficiais fornecidos pela cliente.
ALTER TABLE public.cf_site
  ADD COLUMN IF NOT EXISTS community_takeaways TEXT NOT NULL DEFAULT '';
UPDATE public.cf_site
SET community_takeaways=$bmcbenefits$
O jeito certo de aprender a nunca mais fugir das suas dores emocionais, encarando-as de frente
Desenvolver força para lidar com questões que ainda sente dor e insegurança
Clareza sobre tudo que acontece em sua vida, na prática
Ser sua companhia TERAPÊUTICA diária e em qualquer lugar
Te ensinar a fazer escolhas e tomar decisões com leveza e confiança.
$bmcbenefits$,
 updated_at=NOW()
WHERE id='main' AND (community_takeaways IS NULL OR btrim(community_takeaways)='');
