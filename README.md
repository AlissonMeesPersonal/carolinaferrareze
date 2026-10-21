# Carolina Ferrareze — Landing Page + Neon

Landing responsiva com caminhos para atendimento individual e mentorias, formulário de interessados e painel administrativo em `/admin`.

## Estrutura
- Next.js 16 App Router no GitHub `AlissonMeesPersonal/carolineferrareze`
- Neon PostgreSQL (driver `@neondatabase/serverless` com conexão **exclusiva do servidor**)
- Vercel (deploy automático a cada commit em `main`)
- Painel protegido por e-mail, hash de senha scrypt e cookie HttpOnly/secure; sessões revogáveis e gravadas no próprio Neon

## Ativar Neon
1. Acesse [console.neon.tech](https://console.neon.tech) e crie ou escolha um projeto, banco e branch. Prefira região próxima da Vercel. Banco dedicado recomendado.
2. Em **Connect**, copie a string PostgreSQL **pooled**. Adicione em Vercel > Project > Settings > Environment Variables como `DATABASE_URL`, com tipo **Sensitive/Encrypted** e destino Production (e Preview caso haja banco de teste).
3. No Neon SQL Editor execute `neon/schema.sql`; confirme a existência das tabelas `cf_site`, `cf_services`, `cf_faqs`, `cf_testimonials`, `cf_leads`, `cf_admin_sessions` e `cf_request_limits`.
4. Configurar `ADMIN_EMAIL` com o e-mail autorizado da Carolina; gerar hash da senha localmente rodando `npm run hash-password` e inserir seu resultado em `ADMIN_PASSWORD_HASH` na Vercel (nunca enviar a senha ou connection string para o chat ou GitHub).
5. Execute Redeploy na Vercel **após** configurar as variáveis para que o novo deploy use a conexão.
6. Abra `/admin` e teste login, conteúdo e envio do formulário.

## Separação de responsabilidades
O Neon armazena **dados estruturados**, incluindo URLs de imagens, mas não recebe upload de arquivos neste projeto. Neste estágio a Carolina pode editar URLs de fotos hospedadas em um serviço externo confiável ou caminhos estáticos versionados no GitHub (pasta `public`). Upload pelo painel poderá ser integrado posteriormente a Vercel Blob, Cloudinary ou Object Storage, mediante escolha do fornecedor.

## Segurança
- `DATABASE_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` são somente do servidor, sem prefixo `NEXT_PUBLIC_`.
- O navegador nunca recebe SQL, conexão ao banco ou dados de leads de usuários não autorizados.
- Operações administrativas exigem cookie de sessão validado no banco; mutações também verificam origem HTTP.
- O login e o formulário possuem limite de requisições persistente no banco.
- Site continua com conteúdo de demonstração até o Neon ser configurado (o formulário retorna erro de indisponibilidade se faltar o banco).
- A política de privacidade precisa ser complementada com informações reais antes de divulgação.

## Antes de divulgar
Confirme conteúdos e imagens autorizados da Carolina. Faça testes completos na produção, revise logs e retenção LGPD e habilite proteção anti-bots adequada ao volume de acessos. A edição de conteúdo via painel ocorre diretamente no Neon, sem necessidade de novos commits ou deploys.
