# 05 — Segurança, deploy e dados reais

## O que nunca vai para o GitHub

- `.env.local`, strings `DATABASE_URL`, chaves de upload S3 ou credenciais.
- Senhas e links de ativação de contas.
- Dados de interessados e observações administrativas.
- Prints de depoimentos sem conferência de consentimento e anonimização.

## Ambientes recomendados

| Ambiente | Banco | Deploy |
|---|---|---|
| Desenvolvimento | Branch Neon separada, dados fictícios | VS Code local |
| Preview | Banco de teste ou sem escrita em produção | Pull Request |
| Produção | Neon de produção com backups | Branch `main` -> Vercel |

A execução de migrations deve ser **planejada e revisada**, nunca automática contra produção sem validação prévia.

## Conferências antes de cada publicação

1. Código legível e revisado (`git diff`).
2. `npm run test` e `npm run build` concluídos.
3. Nenhuma informação confidencial incluída em commits.
4. APIs administrativas mantêm autenticação e auditoria.
5. UI desktop e mobile verificadas.
6. Contatos e dados pessoais acessíveis somente a perfis autorizados.
7. Plano de rollback disponível (deploy anterior na Vercel).

## O que é seguro mudar para estudar

Arquivos de documentação, tests, textos de exemplo e funções puras são bons pontos de partida. Mudanças em **auth**, banco Neon ou permissões devem ser revisadas com mais cuidado antes do deploy.
