# Fotografias oficiais da Carolina

O site utiliza exclusivamente as quatro fotografias fornecidas pela Carolina na conversa, processadas em um sprite AVIF em `public/images/carolina-editorial.avif` (duas colunas × duas linhas).

Posições das imagens:
- canto superior esquerdo: Carolina sentada na poltrona com a marca — hero;
- canto superior direito: Carolina sentada no sofá — Sobre;
- canto inferior esquerdo: Carolina em pé no consultório — mentorias;
- canto inferior direito: Carolina de perfil — seção editorial.

As regras CSS ficam em `app/globals.css` e são compatíveis com o mobile.
As imagens definidas manualmente em `hero_image_url` ou `about_image_url` no painel têm prioridade.

**Nota de qualidade:** o sprite é uma versão otimizada para teste. A troca por imagens individuais AVIF/WebP maiores, com arquivos originais, é recomendada para exibição em telas de alta densidade.
