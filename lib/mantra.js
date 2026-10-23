// Conteúdo da faixa abaixo do hero. Separar termos por vírgula,
// ponto e vírgula ou linha. Valor vazio oculta a faixa intencionalmente.
export const DEFAULT_MANTRA_WORDS = 'acolher, compreender, ressignificar, florescer';
export function parseMantraWords(value) {
 return String(value ?? '')
  .split(/[,;\n]+/)
  .map(word => word.replace(/\s+/g, ' ').trim().slice(0, 40))
  .filter(Boolean)
  .slice(0, 8);
}
