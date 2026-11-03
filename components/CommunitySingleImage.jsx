'use client';
import { useState } from 'react';

// Esta é a imagem original enviada pela cliente. Coloque o PNG sem
// reexportar nem comprimir em public/images/comunidade-bmc/aulas-preview.png.
// Não usamos next/image para impedir mudanças automáticas no arquivo.
const PREVIEW_PATH='/images/comunidade-bmc/aulas-preview.png';

export default function CommunitySingleImage(){
  const [missing,setMissing]=useState(false);
  // Não mostrar ícone de imagem quebrada antes de a foto ser publicada no GitHub.
  if(missing)return null;
  return (
    <section id="aulas-comunidade" className="bmc-single-image-section"
      aria-label="Prévia visual das aulas da Comunidade Bota a Mão na Consciência">
      <img className="bmc-single-image"
        src={PREVIEW_PATH}
        width="1774" height="887"
        alt="Três celulares mostrando a Comunidade Bota a Mão na Consciência e os temas das aulas"
        loading="lazy"
        decoding="async"
        onError={()=>setMissing(true)}
      />
    </section>
  );
}
