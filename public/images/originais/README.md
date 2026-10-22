# Fotografias originais da Carolina Ferrareze

As quatro imagens JPEG foram recebidas e vinculadas à landing page, em qualidade original: os arquivos não são recomprimidos nem redimensionados no repositório.

| Arquivo | Dimensão | Seção |
|---|---:|---|
| `hero.jpeg` | 1066 × 1600 px | Hero (Carolina na poltrona) |
| `sobre.jpeg` | 1066 × 1600 px | Sobre mim |
| `mentorias.jpeg` | 1600 × 1066 px | Mentorias (imagem horizontal completa) |
| `perfil.jpeg` | 1066 × 1600 px | Seção editorial |

A página utiliza diretamente os arquivos individuais de `public/images/originais/`; não existem mais sprites nem imagens de 360 px. O navegador dimensiona a exibição via CSS, preservando a proporção da foto. Fotos de retrato usam `object-fit:cover` (podendo haver corte visual nas bordas em telas diferentes). A foto horizontal de mentorias usa `object-fit:contain` para aparecer inteira.

O painel administrativo permite sobrescrever as fotos de Hero e Sobre por URL, sem alterar o GitHub. Para atualizar qualquer fotografia original, substitua o arquivo de mesmo nome nesta pasta e publique um commit.
