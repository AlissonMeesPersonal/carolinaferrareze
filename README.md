# Carolina Ferrareze — Landing Page + Neon

## Acesso administrativo individual — proprietário e suporte técnico

O painel oferece **duas contas independentes** no Neon, sem senhas fixas no GitHub:

- **Suporte técnico** — e-mail inicial `alissonyagomees@gmail.com`. Pode editar conteúdo, fotos e acompanhar leads durante o suporte. Seu perfil não aparece no site público, mas aparece na aba **Acessos e segurança**.
- **Proprietária** — e-mail da Carolina será cadastrado por convite quando estiver definido. Quando ativo, pode consultar auditoria e suspender suporte, revogando imediatamente as sessões da conta de suporte.

A ativação é feita por **convite de uso único com expiração de 48 horas**, gerado no banco. O destinatário escolhe senha pessoal (mínimo de 14 caracteres). A senha nunca deve ser enviada por mensagem ou commit. Cookies de sessão HttpOnly + Secure, bloqueio por tentativas e registros de ações no Neon.

A URL para a tela de entrada permanece `https://carolineferrareze.vercel.app/admin`. A ativação usa `/admin/ativar?token=...` e, depois, o próprio login.

A primeira conta de suporte já consta na base, mas só permite entrada após completar a ativação. O suporte pode convidar a primeira proprietária pela aba de acessos; depois disso, somente a proprietária pode convidar outros usuários. Todos os perfis privilegiados continuam auditáveis e podem ser revistos pela responsável.


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

## Personalização e fotos pelo painel
A Carolina acessa `/admin` depois da configuração das credenciais `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`.

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
- `ADMIN_EMAIL` — e-mail real da Carolina
- `ADMIN_PASSWORD_HASH` — hash scrypt derivado por `npm run hash-password`

**O armazenamento já foi provisionado.** O login continuará desabilitado até `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` serem definidos na Vercel. Não criar credenciais padrão nem colocá-las no GitHub.

Observação: o bucket é público apenas para leitura de imagens publicadas. **Não envie imagens com dados pessoais sensíveis**; para prints de depoimentos, oculte nomes, números de telefone e outras informações identificáveis antes de enviar. Confirme autorização antes de ativar a publicação. O conteúdo estático original em `public/images/originais` continua no GitHub sem alteração.

## Segurança
- `DATABASE_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` são somente do servidor, sem prefixo `NEXT_PUBLIC_`.
- O navegador nunca recebe SQL, conexão ao banco ou dados de leads de usuários não autorizados.
- Operações administrativas exigem cookie de sessão validado no banco; mutações também verificam origem HTTP.
- O login e o formulário possuem limite de requisições persistente no banco.
- Site continua com conteúdo de demonstração até o Neon ser configurado (o formulário retorna erro de indisponibilidade se faltar o banco).
- A política de privacidade precisa ser complementada com informações reais antes de divulgação.

## Antes de divulgar
Confirme conteúdos e imagens autorizados da Carolina. Faça testes completos na produção, revise logs e retenção LGPD e habilite proteção anti-bots adequada ao volume de acessos. A edição de conteúdo via painel ocorre diretamente no Neon, sem necessidade de novos commits ou deploys.
