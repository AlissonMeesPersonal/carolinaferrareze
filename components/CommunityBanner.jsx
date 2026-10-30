'use client';

import { useState } from 'react';

/**
 * Banners da Comunidade BMC.
 *
 * Faça upload no GitHub dos JPEGs originais sem editar, reduzir ou converter:
 * - public/images/comunidade-bmc/banner-desktop.jpeg (1600 × 534)
 * - public/images/comunidade-bmc/banner-mobile.jpeg  (1254 × 1254)
 *
 * A tag <picture> seleciona apenas o tamanho adequado à tela. Usamos <img>
 * nativo: nada de recompressão pelo Next/Image ou corte via CSS.
 * Se os arquivos ainda não estiverem no repo, a foto antiga é o fallback.
 *
 * O painel administrativo ainda pode substituir o banner pelo Neon Storage;
 * quando há uma URL de CMS, ela tem prioridade sobre o arquivo no GitHub.
 */
export const COMMUNITY_DESKTOP_IMAGE = '/images/comunidade-bmc/banner-desktop.jpeg';
export const COMMUNITY_MOBILE_IMAGE = '/images/comunidade-bmc/banner-mobile.jpeg';
const FALLBACK_IMAGE = '/images/originais/mentorias.jpeg';

export default function CommunityBanner({ desktopUrl = '', mobileUrl = '' }) {
  const [failed, setFailed] = useState({ desktop: false, mobile: false });

  const desktopImage = failed.desktop
    ? FALLBACK_IMAGE
    : String(desktopUrl || '').trim() || COMMUNITY_DESKTOP_IMAGE;

  const mobileImage = failed.mobile
    ? desktopImage
    : String(mobileUrl || '').trim() || COMMUNITY_MOBILE_IMAGE;

  function handleImageError() {
    // A tag <source> é escolhida pelo navegador no celular; o erro chega ao <img>.
    const isMobile = window.matchMedia('(max-width: 760px)').matches;

    if (isMobile && !failed.mobile) {
      setFailed((previous) => ({ ...previous, mobile: true }));
    } else if (!failed.desktop) {
      setFailed((previous) => ({ ...previous, desktop: true }));
    }
  }

  return (
    <div className="community-visual" aria-label="Identidade visual da Comunidade BMC">
      <picture>
        <source media="(max-width: 760px)" srcSet={mobileImage} />
        <img
          src={desktopImage}
          alt="Carolina Ferrareze e a identidade visual da Comunidade Bota a Mão na Consciência"
          width="1600"
          height="534"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      </picture>
    </div>
  );
}
