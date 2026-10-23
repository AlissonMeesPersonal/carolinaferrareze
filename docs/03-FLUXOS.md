# 03 — Ler os principais fluxos no VS Code

## Fluxo 1: alteração de texto no painel
1. `app/admin/page.jsx`: `changeSite` atualiza um estado React.
2. O botão **Salvar alterações** chama `saveSite()`.
3. `lib/admin/api-client.js` envia `PUT /api/admin/data`.
4. `app/api/admin/data/route.js` valida a sessão e os campos permitidos.
5. `lib/db.js` envia dados ao Neon.
6. `app/page.jsx` consulta a nova versão no banco no próximo carregamento.

**Experimento:** altere o texto padrão em uma branch local e compare com o valor real salvo no banco; eles têm papéis diferentes.

## Fluxo 2: contato do formulário
1. O visitante digita nome, telefone e interesse em `components/LeadForm.jsx`.
2. A requisição chega em `app/api/leads/route.js`.
3. O servidor valida, aplica limites e salva em `cf_leads`.
4. O admin recebe os dados por `GET /api/admin/data`.
5. O filtro é processado em `lib/admin/leads.mjs`; a tela visual está em `components/admin/panels/LeadsPanel.jsx`.
6. O CSV é montado por `createLeadsCsv` usando os mesmos contatos filtrados.

**Experimento:** execute `npm run test` e acrescente um teste de contato sem WhatsApp.

## Fluxo 3: upload de fotografia
1. `components/admin/MediaUploader.jsx` envia `FormData`.
2. `app/api/admin/media/route.js` valida sessão, tamanho e formato.
3. A imagem é armazenada no Neon Object Storage.
4. O painel recebe uma URL e guarda a referência no conteúdo.
5. A landing apresenta a imagem pela URL.

**Experimento:** observe a aba Network do navegador e identifique `POST /api/admin/media`; nunca exiba credenciais no console.

## Fluxo 4: login administrativo
1. `/admin` verifica o estado da sessão.
2. `/api/admin/session` consulta registros autorizados.
3. `lib/auth.js` aplica verificação segura da sessão.
4. As operações administrativas validam autenticação e origem.
5. O encerramento de suporte revoga sessões, mantendo trilha de auditoria.

**Experimento:** leia `lib/auth.js` e explique por que o banco é consultado para conferir sessões.

Próximo: [exercícios](./04-EXERCICIOS.md).

## Fluxo 5: acessos administrativos
1. `app/admin/page.jsx` controla a aba e carrega dados administrativos.
2. `components/admin/panels/AccessPanel.jsx` apresenta usuários e convites.
3. `app/api/admin/users/route.js` aplica as permissões reais no servidor.
4. `lib/auth.js` valida sessões e `cf_admin_audit` preserva o histórico.

**Importante:** esconder um botão no React não substitui verificar autorização na API.
