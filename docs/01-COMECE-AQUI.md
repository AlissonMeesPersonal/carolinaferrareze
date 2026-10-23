# 01 — Abrir e estudar o projeto no VS Code

Projeto: **Carolina Ferrareze**, Next.js (App Router), React, Neon PostgreSQL, Neon Object Storage, GitHub e Vercel.

## 1. Pré-requisitos

Instale:
- Git;
- Node.js LTS compatível com Next.js 16 (veja a versão mínima na documentação do Next.js);
- Visual Studio Code;
- extensões sugeridas pelo próprio workspace.

No terminal do VS Code (Windows / PowerShell):

```powershell
git clone https://github.com/AlissonMeesPersonal/carolinaferrareze.git
cd carolinaferrareze
code .
npm install
npm run dev
```

Abra **http://localhost:3000** para ver a landing.

### Sem conectar o Neon

A landing pode usar conteúdo demonstrativo (`fallbackSite`), mas as telas de contatos e o login administrativo não funcionarão sem um banco autorizado.

> Não baixe a conexão do banco de produção para um projeto de estudo, pois ela pode expor dados dos interessados. Para testes completos, crie uma branch de desenvolvimento no Neon, aplique as migrations necessárias e use apenas dados fictícios.

Se tiver uma branch de desenvolvimento isolada:

```powershell
Copy-Item .env.example .env.local
```

Preencha as variáveis **somente no seu computador**. Nunca publique `.env.local` no GitHub. Reinicie `npm run dev` após editar variáveis.

## 2. Comandos úteis

```bash
npm run dev       # desenvolvimento local (Next.js)
npm run build     # verifica se o aplicativo compila
npm run start     # executa build de produção
npm run test      # testes unitários das regras de negócio
npm run format    # formata arquivos com Prettier
npm run lint      # analisa padrões de código com ESLint
git status        # verifica mudanças locais
git diff          # compara alterações
```

O comando `format` modifica arquivos: execute `git diff` antes de enviar para `main`.

## 3. Seu primeiro estudo prático (30 minutos)

1. Abra `app/page.jsx` e encontre onde a landing busca as informações.
2. Abra `components/Landing.jsx` e localize como textos e fotos são renderizados.
3. Abra `app/admin/page.jsx` e acompanhe a troca de abas (`tab`).
4. Abra `components/admin/Field.jsx`: entenda `props`, `value` e `onChange`.
5. Abra `lib/admin/api-client.js`: veja como uma requisição HTTP envia dados.
6. Abra `lib/admin/leads.mjs` e rode `npm run test` para observar regras verificáveis.
7. Use o depurador do VS Code (F5) com um breakpoint em `filterLeads` ou em um evento do admin.

Próximo: [mapa de pastas](./02-MAPA-DA-ARQUITETURA.md).

## 4. Fluxo recomendado de trabalho

```bash
git checkout -b estudo/melhorias-admin
# faça uma pequena alteração
npm run test
npm run build
git add .
git commit -m "refactor: descreva a alteração"
git push -u origin estudo/melhorias-admin
```

Abra um Pull Request para revisar as diferenças antes de levar para `main`. Cada commit em `main` pode gerar um novo deploy na Vercel; **não use o banco de produção para exercícios**.
