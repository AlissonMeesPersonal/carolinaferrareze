# Carolina Ferrareze — Landing Page + Neon

## Acesso administrativo individual — proprietário e suporte técnico

O painel oferece **duas contas independentes** no Neon, sem senhas fixas no GitHub:

- **Suporte técnico** — e-mail inicial `alissonmeespersonal@gmail.com`. Pode editar conteúdo, fotos e acompanhar leads durante o suporte. Seu perfil não aparece no site público, mas aparece na aba **Acessos e segurança**.
- **Proprietária** — e-mail da Carolina será cadastrado por convite quando estiver definido. Quando ativo, pode consultar auditoria e suspender suporte, revogando imediatamente as sessões da conta de suporte.

A ativação é feita por **convite de uso único com expiração de 48 horas**, gerado no banco. O destinatário escolhe senha pessoal (mínimo de 14 caracteres). A senha nunca deve ser enviada por mensagem ou commit. Cookies de sessão HttpOnly + Secure, bloqueio por tentativas e registros de ações no Neon.

A URL para a tela de entrada permanece `https://carolinaferrareze.vercel.app/admin`. A ativação usa `/admin/ativar?token=...` e, depois, o próprio login.

A primeira conta de suporte já consta na base, mas só permite entrada após completar a ativação. O suporte pode convidar a primeira proprietária pela aba de acessos; depois disso, somente a proprietária pode convidar outros usuários. Todos os perfis privilegiados continuam auditáveis e podem ser revistos pela responsável.


Landing responsiva com caminhos para atendimento individual e mentorias, formulário de interessados e painel administrativo em `/admin`.

## Estrutura
- Next.js 16 App Router conectado ao GitHub e publicado automaticamente na Vercel
- Neon PostgreSQL (driver `@neondatabase/serverless` com conexão **exclusiva do servidor**)
- Vercel (deploy automático a cada commit em `main`)
- Painel protegido por e-mail, hash de senha scrypt e cookie HttpOnly/secure; sessões revogáveis e gravadas no próprio Neon

## Iniciar no VS Code (desenvolvimento)

Comece em **[01 — Abrir no VS Code](./docs/01-COMECE-AQUI.md)**. A documentação percorre a arquitetura do site, formulários, autenticação, integração com Neon e exercícios.

```bash
git clone https://github.com/AlissonMeesPersonal/carolinaferrareze.git
cd carolinaferrareze
npm install
npm run dev
```

Para trabalhar com autenticação, banco e upload localmente, use uma **branch de desenvolvimento do Neon** e configure `.env.local` com variáveis privadas. Não use dados reais para exercícios.

## Documentação de estudo

- [01 — Configurar VS Code](./docs/01-COMECE-AQUI.md)
- [02 — Mapa da arquitetura](./docs/02-MAPA-DA-ARQUITETURA.md)
- [03 — Fluxos da aplicação](./docs/03-FLUXOS.md)
- [04 — Exercícios](./docs/04-EXERCICIOS.md)
- [05 — Segurança e deploy](./docs/05-SEGURANCA-E-DEPLOY.md)

## Neon e acesso administrativo

Este projeto usa **contas individuais em `cf_admin_users`** e convites de uso único: não depende de uma conta única por `ADMIN_EMAIL` nem de `ADMIN_PASSWORD_HASH` para entrar no painel. A string `DATABASE_URL` deve estar configurada apenas no servidor.

As tabelas iniciais estão em `neon/schema.sql`. Alterações incrementais ficam em `neon/migrations`, incluindo usuários, mídia e faixa de palavras. Em um ambiente novo, aplicar schema e migrations na ordem apropriada antes de testar; em produção, revisar cada migration antes de executar.

## Personalização e fotos pelo painel
A Carolina acessa `/admin` com sua conta individual ativada por convite. Os acessos são auditados e podem ser revogados.

- **Editor do site**: edita textos, informações de contato, capa, apresentação, fotos de mentorias e seção editorial. Fotos JPEG, PNG, WebP ou AVIF são enviadas diretamente pelo painel (até 8 MB cada, sem recompressão automática). Após o upload, clique em **Salvar site** para publicar.
- **Atendimentos e mentorias**: editar descrições, ordem, publicação e imagem de cada serviço.
- **Fotos de depoimentos**: criar nova imagem, escrever legenda, confirmar consentimento da pessoa retratada ou que escreveu a mensagem e publicar/ocultar.
- **Contatos recebidos**: somente contas autenticadas podem consultar nome, WhatsApp, interesse, data, status e anotações internas. Há busca, filtro de situação e exportação CSV.
- **Depoimentos e FAQ**: publicar, editar e remover textos.

## Armazenamento de mídia Neon
Bucket `carolina-midias` criado no Neon Object Storage na branch principal em modo `public_read`. O navegador **não recebe as credenciais**; `POST /api/admin/media` valida login, origem, tamanho e assinatura real do arquivo antes de gravar no bucket. As URLs dos arquivos são armazenadas no PostgreSQL e servidas publicamente.

Variáveis apenas de servidor na Vercel Production:
- `DATABASE_URL`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — segredos do Neon Storage
- `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `NEON_MEDIA_BUCKET`

**O armazenamento já foi provisionado.** Para entrar no painel, cada usuário deve possuir uma conta individual ativa na tabela `cf_admin_users` e senha definida pelo convite. Não criar credenciais padrão nem colocá-las no GitHub.

Observação: o bucket é público apenas para leitura de imagens publicadas. **Não envie imagens com dados pessoais sensíveis**; para prints de depoimentos, oculte nomes, números de telefone e outras informações identificáveis antes de enviar. Confirme autorização antes de ativar a publicação. O conteúdo estático original em `public/images/originais` continua no GitHub sem alteração.

## Segurança
- `DATABASE_URL` e chaves do Storage são somente do servidor, sem prefixo `NEXT_PUBLIC_`.
- O navegador nunca recebe SQL, conexão ao banco ou dados de leads de usuários não autorizados.
- Operações administrativas exigem cookie de sessão validado no banco; mutações também verificam origem HTTP.
- O login e o formulário possuem limite de requisições persistente no banco.
- Site continua com conteúdo de demonstração até o Neon ser configurado (o formulário retorna erro de indisponibilidade se faltar o banco).
- A política de privacidade precisa ser complementada com informações reais antes de divulgação.

## Antes de divulgar
Confirme conteúdos e imagens autorizados da Carolina. Faça testes completos na produção, revise logs e retenção LGPD e habilite proteção anti-bots adequada ao volume de acessos. A edição de conteúdo via painel ocorre diretamente no Neon, sem necessidade de novos commits ou deploys.

## Encerramento do suporte técnico
Na aba **Acessos e segurança**, o suporte pode clicar em **Encerrar meu acesso**, revogando todas as sessões e inutilizando convites pendentes. A conta deixa de aparecer na relação de **acessos ativos**, mas o histórico administrativo é mantido para transparência e prestação de contas.

A proprietária pode desativar uma conta de suporte ativa. Não existe conta escondida nem privilégio permanente contra a vontade da proprietária. Reativação após encerramento exige novo processo administrativo autorizado, não apenas alterar o sinalizador `active`.

## Nome e domínio oficial

- **Nome oficial**: Carolina Ferrareze.
- **Projeto Vercel**: `carolinaferrareze`.
- **Domínio principal**: https://carolinaferrareze.vercel.app.
- **Domínio anterior**: `carolineferrareze.vercel.app`, mantido como redirecionamento permanente para o novo endereço.
- **Metadata canônica**: apontando para o domínio correto, evitando endereços duplicados nos buscadores.

O repositório já usa o nome correto `carolinaferrareze`.
