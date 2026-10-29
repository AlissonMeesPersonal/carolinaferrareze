/**
 * Botões principais da landing da Carolina.
 * Os textos são editáveis no Neon. A venda externa só pode apontar para Hotmart.
 * URL vazia => a opção fica desativada, nunca redireciona para um checkout inventado.
 */
export const DEFAULT_HERO_CTA_LABELS = Object.freeze({
 individual: 'Acompanhamento Individual',
 constelacao: 'Quero Constelar',
 bmc: 'Comunidade BMC',
});

export function heroCtaLabel(value, fallback) {
 const name = String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 65);
 return name || fallback;
}

export function safeHotmartUrl(value) {
 const raw = String(value ?? '').trim();
 if (!raw) return '';
 try {
  const url = new URL(raw);
  const host = url.hostname.toLowerCase();
  const officialHosts = ['hotmart.com', 'hotmart.com.br', 'hotm.art', 'hotmart.host'];
  const approvedHost = officialHosts.some(root => host === root || host.endsWith('.' + root));
  if (url.protocol !== 'https:' || !approvedHost || url.username || url.password || url.port) return '';
  return url.toString();
 } catch {
  return '';
 }
}
