# 04 — Exercícios progressivos

Estude em **branches de teste**, sem alterar dados reais da Carolina.

| Nível | Exercício | Onde começar |
|---|---|---|
| Iniciante | Alterar o rótulo de um botão | `components/Landing.jsx` |
| Iniciante | Identificar de onde vem o texto do hero | `lib/config.js` e `app/page.jsx` |
| Iniciante | Criar um campo reutilizável em um formulário fictício | `components/admin/Field.jsx` |
| Intermediário | Adicionar busca por tipo de atendimento | `lib/admin/leads.mjs` |
| Intermediário | Criar teste para CSV com aspas e caracteres especiais | `tests/leads.test.mjs` |
| Intermediário | Entender um botão de salvar e a resposta da API | `app/admin/page.jsx` |
| Avançado | Desenhar uma nova tabela em uma branch isolada do Neon | `neon/migrations` |
| Avançado | Projetar o upload com progresso e limites | `components/admin/MediaUploader.jsx` |

## Checklist de cada exercício

- [ ] Sei explicar quais arquivos foram alterados.
- [ ] Testei o cenário feliz e pelo menos um erro.
- [ ] Executei `npm run test`.
- [ ] Executei `npm run build`.
- [ ] Revisei `git diff`.
- [ ] Não adicionei segredos, dados de interessados ou prints privados no GitHub.

### Sugestão de revisão semanal

Escolha **um módulo por vez**. Leia o arquivo, desenhe o fluxo, escreva um teste, altere uma pequena regra e compare o resultado. Evite refatorar toda a aplicação de uma vez.
