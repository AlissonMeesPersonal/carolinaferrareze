# Prévia de aulas — carrossel da Comunidade BMC

A seção é renderizada após a Comunidade BMC, antes da seção editorial.

- `components/CommunityPhonesCarousel.jsx`: três iPhones estilizados em CSS, com botões anterior/próximo, indicadores, teclado e deslize no mobile.
- `lib/community-lessons.mjs`: títulos das aulas apresentados pela Carolina e organização das telas.
- `app/globals.css`: aparência e responsividade do carrossel.

O carrossel é uma **visualização ilustrativa** da comunidade; não apresenta aulas reais para reprodução nem faz download. Usa a imagem existente em `/images/originais/hero.jpeg` nas miniaturas. Nenhuma imagem de celular gerada externamente precisa ser carregada, evitando baixa resolução por aumento de escala.

Para alterar títulos das aulas, edite `lib/community-lessons.mjs`. Futuramente, a prévia pode ser substituída por capturas reais da plataforma sem alterar a estrutura da landing. O checkout Hotmart e demais botões seguem como antes.
