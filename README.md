# Carolina Ferrareze — Landing Page + Painel

Site único e responsivo com duas jornadas: **atendimentos individuais** e **mentorias terapêuticas**, formulário de leads e painel administrativo em `/admin`.

## Stack

Next.js (App Router), React, Supabase Auth, Database e Storage. Deploy pela Vercel conectada ao GitHub (branch `main`).

## 1. Criar tabelas no Supabase

Projeto indicado: `efahamylmoueniflnvzl` (`https://efahamylmoueniflnvzl.supabase.co`).

1. Acesse o [SQL Editor do projeto](https://supabase.com/dashboard/project/efahamylmoueniflnvzl/sql).
2. Execute **apenas** o arquivo `supabase/schema.sql`, conferindo que o projeto ativo é `efahamylmoueniflnvzl`.
3. Ele cria **cf_site, cf_services, cf_testimonials, cf_faqs, cf_leads e cf_admins**, com RLS, políticas e bucket `cf-media`. Todas as tabelas têm prefixo `cf_` para não interferir em outros aplicativos.

**Atenção:** o projeto não estava acessível nas contas Supabase conectadas quando o código foi criado. O SQL foi salvo no GitHub, mas não aplicado automaticamente ao banco.

## 2. Administradora

1. No Supabase: Authentication > Users > Invite user (ou criar um usuário e enviar recuperação de senha). Use **o e-mail real da Carolina**, jamais adicione credenciais padrão ao código.
2. Copie o UUID do usuário criado.
3. No SQL Editor execute: `insert into public.cf_admins (user_id) values ('UUID_DA_USUARIA') on conflict do nothing;`
4. Acesse `/admin` e entre com esse e-mail e senha.

**Segurança:** não existe autoinscrição para administradores. Mesmo um usuário autenticado sem registro em `cf_admins` não pode consultar leads ou alterar conteúdo.

## 3. Variáveis de ambiente

Copie `.env.example` para `.env.local`, preenchendo os valores do **mesmo** projeto Supabase. Configure também as mesmas variáveis na Vercel para Production (e Preview se desejar):

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — chave pública/publishable do projeto (não é segredo).
- `SUPABASE_SERVICE_ROLE_KEY` — chave secreta **somente servidor**. Nunca use prefixo `NEXT_PUBLIC_`.
- `SITE_URL` — URL exata da produção, por exemplo `https://dominio.com.br`.
- `TURNSTILE_SECRET_KEY` — opcional; se configurada, configure também um componente Turnstile no formulário antes de ativá-la (não habilitar somente o secret, pois bloqueia envios).
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — reservada para integração posterior.

O formulário não grava dados até que o SQL seja aplicado e a chave de servidor configurada. Sem variáveis, a landing exibe texto de demonstração; não declara envios falsos.

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Para produção, conecte o repositório à Vercel (Framework: Next.js; Production branch: main), configure variáveis, e publique. Depois dessa **conexão**, novos commits em `main` disparam builds/deploys automaticamente. Apenas criar commits no GitHub **não configura** a integração Vercel.

## 5. Personalização da Carolina

Acesso `/admin`:
- Editar hero, títulos, descrição, fotos, apresentação e dados de contato.
- Criar, publicar, ocultar e editar atendimentos e mentorias.
- Organizar depoimentos autorizados e perguntas frequentes.
- Conferir leads, filtrar contatos e mudar status.
- Editar campos de SEO.
- Subir imagens JPG, PNG, WebP ou AVIF (até 5 MB) no bucket próprio.

O editor salva conteúdo no Supabase e **não precisa de novo commit** para atualizar o site.

## 6. Antes de divulgar

- Confirmar com Carolina fotos reais, currículo, termos dos serviços e descrições exatas das mentorias. Os textos iniciais são demonstrativos. Não publicar credenciais/alegações clínicas não verificadas.
- Completar a política de privacidade com controlador, contato, retenção e fornecedores; observar a LGPD.
- Implementar proteção anti-spam robusta com Turnstile e/ou rate limit persistente (a limitação em memória do servidor é apenas best effort), além de monitoramento de abusos.
- Validar na produção: autorização de admin, upload de mídia, envios e persistência dos leads, responsividade e acessibilidade.
- Não armazenar informações médicas ou relatos pessoais sensíveis no formulário público.
