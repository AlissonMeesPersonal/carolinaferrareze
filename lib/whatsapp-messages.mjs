/** Contextos usados pelos botões públicos. Mude os assuntos aqui para futuras campanhas. */
export const WHATSAPP_MESSAGES = Object.freeze({
  general: 'Olá, Carolina! Visitei seu site e gostaria de conversar sobre seus atendimentos.',
  individual: 'Olá, Carolina! Tenho interesse no Acompanhamento Terapêutico Individual. Gostaria de saber como funciona e agendar uma sessão.',
  constelacao: 'Olá, Carolina! Tenho interesse em uma sessão de constelação. Gostaria de saber como funciona e quais horários estão disponíveis.',
  community: 'Olá, Carolina! Gostaria de saber mais sobre a Comunidade Bota a Mão na Consciência.',
  about: 'Olá, Carolina! Li sua apresentação no site e gostaria de conversar sobre seu trabalho.',
  booking: 'Quero agendar minha sessão.',
  editorial: 'Olá, Carolina! Li sua mensagem no site e gostaria de conversar sobre meu momento.',
  contact: 'Olá, Carolina! Gostaria de entrar em contato e conhecer seus atendimentos.',
});
const cleanSubject = value => String(value ?? '').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim().slice(0,110);
export function serviceWhatsAppMessage(title){
  const subject=cleanSubject(title);
  return subject
    ? `Olá, Carolina! Tenho interesse no atendimento "${subject}". Gostaria de saber como funciona e qual a disponibilidade.`
    : WHATSAPP_MESSAGES.individual;
}
export function packageWhatsAppMessage(plan){
  const subject=cleanSubject(plan);
  return subject
    ? `Olá, Carolina! Tenho interesse no ${subject} do Acompanhamento Terapêutico Individual. Gostaria de consultar o investimento e como agendar.`
    : WHATSAPP_MESSAGES.individual;
}
