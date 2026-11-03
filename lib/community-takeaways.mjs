// Textos oficiais fornecidos pela Carolina para a Comunidade BMC.
export const DEFAULT_COMMUNITY_TAKEAWAYS = [
  "O jeito certo de aprender a nunca mais fugir das suas dores emocionais, encarando-as de frente",
  "Desenvolver força para lidar com questões que ainda sente dor e insegurança",
  "Clareza sobre tudo que acontece em sua vida, na prática",
  "Ser sua companhia TERAPÊUTICA diária e em qualquer lugar",
  "Te ensinar a fazer escolhas e tomar decisões com leveza e confiança."
];

export function parseCommunityTakeaways(value) {
  const source=typeof value==='string'&&value.trim()
    ? value
    : DEFAULT_COMMUNITY_TAKEAWAYS.join('\n');
  return source
    .split(/\r?\n/)
    .map(text=>text.trim())
    .filter(Boolean)
    .slice(0,5);
}
