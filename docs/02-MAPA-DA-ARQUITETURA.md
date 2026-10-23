# 02 — Mapa do projeto

```text
carolinaferrareze/
├── app/
│   ├── page.jsx                    Página inicial: busca dados e monta a landing
│   ├── globals.css                 Estilos do site público
│   ├── layout.jsx                  Layout e metadata do site
│   ├── admin/
│   │   ├── page.jsx                Orquestra estado e telas do painel
│   │   ├── admin.css               Estilos do painel
│   │   └── ativar/page.jsx         Ativação de conta administrativa
│   └── api/
│       ├── leads/route.js          Recebe formulário público
│       └── admin/
│           ├── data/route.js       CRUD de textos, serviços, depoimentos e leads
│           ├── session/route.js    Login, sessão e logout
│           ├── users/route.js      Contas e convites
│           ├── activate/route.js   Ativação por convite
│           └── media/route.js      Upload protegido de imagens
├── components/
│   ├── Landing.jsx                 Apresentação das seções públicas
│   ├── LeadForm.jsx                Formulário de interessados
│   └── admin/
│       ├── Field.jsx               Campos reutilizáveis de formulário
│       ├── MediaUploader.jsx       Envio de mídia autenticado
│       └── panels/
│           ├── LeadsPanel.jsx      Consulta, filtros e anotações de leads
│           └── AccessPanel.jsx     Contas autorizadas e auditoria
├── lib/
│   ├── config.js                   Textos padrão (quando o banco não está disponível)
│   ├── mantra.js                   Palavras editáveis da faixa do hero
│   ├── db.js                       Conexão com banco no servidor
│   ├── auth.js                     Hash de senha e sessões no servidor
│   └── admin/
│       ├── api-client.js           HTTP do painel, executado no navegador
│       └── leads.mjs               Filtro e exportação de contatos (funções puras)
├── neon/
│   ├── schema.sql                  Estrutura inicial do banco
│   └── migrations/                 Evolução incremental de tabelas
├── public/images/                  Fotografias e materiais da marca
├── tests/                          Testes unitários sem banco real
├── docs/                           Guias de estudo
└── .vscode/                        Configurações do editor
```

## Como os dados circulam

### Landing pública

```text
Navegador -> app/page.jsx (servidor)
          -> lib/db.js -> Neon PostgreSQL
          -> components/Landing.jsx
          -> componentes públicos e CSS
```

### Formulário de interessados

```text
LeadForm.jsx -> POST /api/leads -> validação / limite -> cf_leads no Neon
```

### Editor administrativo

```text
app/admin/page.jsx (React, estado)
   -> lib/admin/api-client.js
   -> /api/admin/data
   -> lib/auth.js (verificação da sessão)
   -> lib/db.js -> Neon
```

### Fotografias

```text
MediaUploader.jsx -> POST /api/admin/media (com sessão)
   -> Neon Object Storage
   -> URL da foto no PostgreSQL
   -> Landing lê a URL e exibe a foto
```

## Conceitos para aprender

- **Componente React**: função que devolve a interface (JSX).
- **Props**: valores passados de um componente pai para um filho.
- **Estado (`useState`)**: dados que alteram a interface.
- **Efeito (`useEffect`)**: sincronização com recursos externos.
- **API Route**: código de servidor que recebe requisições HTTP.
- **CRUD**: criar, ler, editar e excluir dados.
- **Middleware de autenticação**: valida a sessão antes do acesso aos dados.
- **Neon**: persiste dados estruturados e armazena imagens.
- **Vercel**: publica commits do GitHub.

**Regra importante:** o componente cliente não acessa `DATABASE_URL`, senhas nem chaves da S3. Esses valores ficam apenas no servidor.

Continue em [fluxos do sistema](./03-FLUXOS.md).
