export const fallbackSite = {
  id: 'main', brand: 'Carolina Ferrareze',
  subtitle: 'Mentora e Terapeuta Sistêmica',
  hero_eyebrow: 'UM ESPAÇO PARA SE ESCUTAR',
  hero_title: 'Um novo olhar para a sua história começa aqui.',
  hero_description: 'Um convite ao autoconhecimento, à escuta e à transformação da forma como você se relaciona com sua própria história.',
  hero_image_url: '', about_image_url: '', about_title: 'Prazer, sou Carolina.',
  about_text: 'Sou Carolina Ferrareze, mentora e terapeuta sistêmica. Acredito no autoconhecimento como caminho para compreender padrões, fortalecer sua estrutura emocional e viver com mais presença. Este é um espaço de escuta e acolhimento.',
  journey_title: 'Cada história merece um olhar único.',
  journey_text: 'Conheça as possibilidades de atendimento individual e mentoria. Escolha o caminho que mais combina com seu momento.',
  whatsapp: '', instagram: '', contact_email: '',
  seo_title: 'Carolina Ferrareze | Atendimentos e mentorias',
  seo_description: 'Conheça os atendimentos e mentorias de Carolina Ferrareze e entre em contato.',
  footer_note: 'Atendimentos e mentorias voltados ao autoconhecimento.'
};
export const fallbackServices = [
  {id:'fallback-1',category:'atendimento',title:'Constelação individual',label:'Atendimento',description:'Um espaço de escuta para olhar histórias e padrões pessoais.',details:'Conheça mais e consulte a disponibilidade.',position:1,is_published:true},
  {id:'fallback-2',category:'mentoria',title:'Mentorias terapêuticas',label:'Mentoria',description:'Um percurso de acompanhamento e desenvolvimento pessoal.',details:'Conheça a proposta e converse sobre os próximos passos.',position:1,is_published:true}
];
export function whatsappUrl(number,message='Olá, Carolina! Gostaria de saber mais sobre seus atendimentos e mentorias.'){
 const digits=(number||'').replace(/\D/g,'');
 return digits?'https://wa.me/'+digits+'?text='+encodeURIComponent(message):'#contato';
}
