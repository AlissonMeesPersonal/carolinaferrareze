import { DEFAULT_MANTRA_WORDS } from '@/lib/mantra';
import { DEFAULT_HERO_CTA_LABELS } from '@/lib/hero-ctas.mjs';
export const fallbackSite = {
  id: 'main', brand: 'Carolina Ferrareze',
  subtitle: 'Mentora e Terapeuta Sistêmica',
  hero_eyebrow: 'UM ESPAÇO PARA SE ESCUTAR',
  hero_cta_individual_label: DEFAULT_HERO_CTA_LABELS.individual,
  hero_cta_constelacao_label: DEFAULT_HERO_CTA_LABELS.constelacao,
  hero_cta_bmc_label: DEFAULT_HERO_CTA_LABELS.bmc,
  bmc_hotmart_url: '',
  mantra_words: DEFAULT_MANTRA_WORDS,
  hero_title: 'Um novo olhar para a sua história começa aqui.',
  hero_description: 'Um convite ao autoconhecimento, à escuta e à transformação da forma como você se relaciona com sua própria história.',
  hero_image_url: '', about_image_url: '', about_title: 'Prazer, sou Carolina.',
  about_text: 'Sou Carolina Ferrareze, mentora e terapeuta sistêmica. Acredito no autoconhecimento como caminho para compreender padrões, fortalecer sua estrutura emocional e viver com mais presença. Este é um espaço de escuta e acolhimento.',
  journey_title: 'Comunidade Bota a Mão na Consciência',
  journey_text: 'Uma comunidade para pessoas que não se contentam em viver no automático e buscam profundidade no autoconhecimento. Pessoas que querem compreender seus movimentos emocionais, questionar padrões e assumir a responsabilidade pela própria vida.\n\nAqui você encontra um grupo de pessoas com esse mesmo propósito, além de vídeos novos toda semana, reflexões, exercícios, meditações e encontros que provocam novas percepções sobre si mesmo e sobre a forma como você se relaciona com o mundo.',
  community_features: 'Vídeos novos toda semana\nReflexões\nExercícios\nMeditações\nEncontros',
  community_tagline: 'Um espaço sem meias palavras, para quem quer ir além do superficial e construir uma vida com mais consciência, paz e alegria.',
  community_cta_label: 'Conhecer a comunidade',
  community_logo_url: '',
  community_desktop_image_url: '',
  community_mobile_image_url: '',
  accompaniment_title: 'Acompanhamento Terapêutico',
  accompaniment_intro: 'Para quem deseja desbloquear travas emocionais e desenvolver uma mentalidade mais forte, compreendendo melhor a vida que quer viver e os caminhos para os próprios objetivos.',
  accompaniment_goal: 'O propósito é fortalecer sua estrutura emocional e encontrar mais tranquilidade para lidar com a vida, mesmo quando as circunstâncias ainda não estão como você gostaria.',
  accompaniment_topics: 'Mundo interno|Olhar para suas sombras, a maneira como você vê o mundo, autoestima e merecimento.\nDesbloqueio emocional|Reconhecer feridas, traumas e bloqueios que podem estar limitando sua prosperidade.\nMentalidade|Desenvolver recursos para lidar com situações e cultivar mais paz mental.',
  accompaniment_format: 'Frequência mensal ou quinzenal.\nSessões de uma hora.\nAtendimento online via Zoom ou WhatsApp.',
  accompaniment_packages: 'Pacote de 3 sessões\nPacote de 6 sessões',
  mentoring_image_url: '', editorial_image_url: '',
  form_enabled: false,
  whatsapp: '', instagram: '', contact_email: '',
  seo_title: 'Carolina Ferrareze | Acompanhamento e Comunidade BMC',
  seo_description: 'Conheça o acompanhamento terapêutico e a Comunidade Bota a Mão na Consciência de Carolina Ferrareze.',
  footer_note: 'Atendimentos e mentorias voltados ao autoconhecimento.'
};
export const fallbackServices = [
  {id:'fallback-1',category:'atendimento',title:'Constelação individual',label:'Atendimento',description:'Um espaço de escuta para olhar histórias e padrões pessoais.',details:'Conheça mais e consulte a disponibilidade.',position:1,is_published:true},
  {id:'fallback-2',category:'mentoria',title:'Mentorias terapêuticas',label:'Mentoria',description:'Um percurso de acompanhamento e desenvolvimento pessoal.',details:'Conheça a proposta e converse sobre os próximos passos.',position:1,is_published:true}
];
export function whatsappUrl(number,message='Olá, Carolina! Gostaria de saber mais sobre seus atendimentos.'){
 // BR: aceite número com DDD (10/11 dígitos) ou o formato completo 55 + DDD + número.
 // Evita links wa.me sem código de país após edição no painel.
 let digits=String(number||'').replace(/\D/g,'');
 if(digits.length===10||digits.length===11)digits='55'+digits;
 if(!/^55\d{10,11}$/.test(digits))return '#contato';
 return 'https://wa.me/'+digits+'?text='+encodeURIComponent(message);
}
