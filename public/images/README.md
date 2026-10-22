# Fotografias oficiais de Carolina Ferrareze

As quatro fotografias enviadas pelo responsável foram incorporadas ao repositório e são exibidas exclusivamente como conteúdo visual do site.

| Arquivo | Utilização |
|---|---|
| `carolina-hero.webp` | Hero: Carolina sentada na poltrona com a marca ao fundo |
| `carolina-sobre.webp` | Sobre: Carolina sentada no sofá |
| `carolina-mentorias.webp` | Mentorias: Carolina em pé no consultório |
| `carolina-perfil.webp` | Editorial: retrato lateral com iluminação natural |

`carolina-editorial.avif` é a montagem otimizada de origem utilizada para gerar os quatro cortes. O fluxo `.github/workflows/carolina-photos.yml` mantém os cortes versionados. O CSS `app/globals.css` prioriza arquivos WebP individuais para manter as proporções naturais e usa o AVIF como reserva enquanto novos recortes são gerados.

As imagens foram reduzidas para um primeiro teste web. Para produção definitiva em telas de alta densidade, recomenda-se substituir os arquivos WebP por versões individuais exportadas diretamente das imagens originais em resolução superior.

O painel administrativo permite substituir hero e foto Sobre por URLs específicas sem alterar o código.
