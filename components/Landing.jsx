'use client';
import { ArrowRight, ArrowUpRight, Heart, Leaf, Sparkles, Instagram, MessageCircle, Quote, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LeadForm from './LeadForm';
import { whatsappUrl } from '@/lib/config';
// Fotografia original, sem compactacao, colagem ou recorte de arquivo.
// O painel pode substituir as URLs do hero e da apresentacao.
const DEFAULT_PHOTOS = {
 hero: { src: '/images/originais/hero.jpeg', width: 1066, height: 1600 },
 about: { src: '/images/originais/sobre.jpeg', width: 1066, height: 1600 },
 consultorio: { src: '/images/originais/mentorias.jpeg', width: 1600, height: 1066 },
 perfil: { src: '/images/originais/perfil.jpeg', width: 1066, height: 1600 },
};
function EditorialPhoto({src,variant='hero',alt}) {
 const photo=DEFAULT_PHOTOS[variant] || DEFAULT_PHOTOS.hero;
 const actualSrc=(typeof src==='string' && src.trim()) ? src.trim() : photo.src;
 return <img
  className={'editorial-original editorial-original--'+variant}
  src={actualSrc}
  width={photo.width}
  height={photo.height}
  alt={alt}
  loading={variant==='hero'?'eager':'lazy'}
  decoding="async"
  fetchPriority={variant==='hero'?'high':'auto'}
 />;
}
export default function Landing({site,services,testimonials,faqs}){
 const [mobile,setMobile]=useState(false);
 const atendimento=services.filter(s=>s.category==='atendimento');
 const mentorias=services.filter(s=>s.category==='mentoria');
 const wa=whatsappUrl(site.whatsapp);
 const topicEntries=(site.accompaniment_topics||'').split('\n').map(line=>line.trim()).filter(Boolean).map(line=>{const [name,...desc]=line.split('|');return {name,description:desc.join('|')}});
 const formatEntries=(site.accompaniment_format||'').split('\n').map(line=>line.trim()).filter(Boolean);
 const packageEntries=(site.accompaniment_packages||'').split('\n').map(line=>line.trim()).filter(Boolean);
 const close=()=>setMobile(false);
 return <div className="site-shell">
  <header className="topbar"><a className="brand" href="#inicio" onClick={close}><span className="brand-mark">C<span>F</span></span><span>{site.brand}<small>{site.subtitle}</small></span></a>
   <nav className={mobile?'nav open':'nav'} aria-label="Navegação principal"><a onClick={close} href="#sobre">Sobre mim</a><a onClick={close} href="#atendimentos">Atendimentos</a><a onClick={close} href="#acompanhamento">Acompanhamento</a><a onClick={close} href="#mentorias">Mentorias</a><a onClick={close} href="#depoimentos">Depoimentos</a>{faqs.length>0&&<a onClick={close} href="#duvidas">Dúvidas</a>}<a onClick={close} className="nav-contact" href="#contato">Vamos conversar <ArrowUpRight size={16}/></a></nav>
   <button className="nav-toggle" aria-label={mobile?'Fechar menu':'Abrir menu'} onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  </header>
  <main>
   <section id="inicio" className="hero"><div className="hero-content"><span className="eyebrow"><span className="eyebrow-dot"/> {site.hero_eyebrow}</span><h1>{site.hero_title}</h1><p className="hero-desc">{site.hero_description}</p><div className="hero-actions"><a className="btn btn-dark" href="#acompanhamento">Conhecer o acompanhamento <ArrowUpRight size={18}/></a><a className="btn btn-ghost" href="#mentorias">Explorar mentorias <ArrowRight size={18}/></a></div><div className="hero-signature"><span className="line"/> Um convite para olhar para dentro.</div></div>
    <div className="hero-art"><EditorialPhoto src={site.hero_image_url} variant="hero" alt="Carolina Ferrareze sentada em seu consultório, com a marca ao fundo"/><div className="floating-note"><Sparkles size={18}/><span>Seu caminho é único.</span></div></div>
   </section>
   <section className="intro-band"><span>acolher</span><i/> <span>compreender</span><i/><span>ressignificar</span><i/><span>florescer</span></section>
   <section id="sobre" className="section about"><div className="about-visual"><EditorialPhoto src={site.about_image_url} variant="about" alt="Retrato profissional de Carolina Ferrareze sentada no sofá do consultório"/><div className="about-badge"><Heart size={17}/> Um olhar individual</div></div><div className="section-copy"><span className="eyebrow">01 · SOBRE MIM</span><h2>{site.about_title}</h2><div className="accent-line"/><p>{site.about_text}</p><a className="underlined-link" href="#contato">Entre em contato <ArrowUpRight size={18}/></a></div></section>
   <section className="section paths" id="atendimentos"><div className="section-heading centered"><span className="eyebrow">02 · ATENDIMENTOS</span><h2>Um espaço para<br/><em>se reconectar.</em></h2><p>Conheça os atendimentos individuais e encontre uma possibilidade de cuidado que faça sentido para você.</p></div>
    <div className="cards">{atendimento.map((item,index)=><article className="service-card" key={item.id}><div className="service-number">0{index+1} <Leaf size={19}/></div><span className="service-tag">{item.label||'ATENDIMENTO'}</span><h3>{item.title}</h3><p>{item.description}</p>{item.details&&<div className="service-details">{item.details}</div>}<a href="#contato" className="card-link">Tenho interesse <ArrowUpRight size={19}/></a></article>)}</div>
   </section>
   <section className="accompaniment-section" id="acompanhamento">
    <div className="accompaniment-intro">
     <span className="eyebrow">ACOMPANHAMENTO TERAPÊUTICO</span>
     <h2>{site.accompaniment_title||'Acompanhamento Terapêutico'}</h2>
     <p>{site.accompaniment_intro}</p>
     <p>{site.accompaniment_goal}</p>
     <a className="btn btn-dark" href="#contato">Quero entender como funciona <ArrowUpRight size={17}/></a>
    </div>
    <div className="accompaniment-detail">
     <h3>O que abordaremos?</h3>
     <div className="topic-list">{topicEntries.map((topic,i)=><article className="topic-item" key={i}>
       <span className="topic-number">0{i+1}</span><div><h4>{topic.name}</h4><p>{topic.description}</p></div>
     </article>)}</div>
     <div className="accompaniment-format">
      <h3>Como funcionam as sessões?</h3>
      <ul>{formatEntries.map((entry,i)=><li key={i}>{entry}</li>)}</ul>
     </div>
    </div>
   </section>
   <section className="accompaniment-options" aria-label="Opções do acompanhamento">
    <div><span className="eyebrow">ESCOLHA SEU PROCESSO</span><h2>Um acompanhamento no seu ritmo.</h2><p>Você pode conhecer as opções de acompanhamento e conversar diretamente com a Carolina para saber sobre o investimento.</p></div>
    <div className="accompaniment-plans">{packageEntries.map((plan,i)=><div className="accompaniment-plan" key={i}><span>0{i+1}</span><h3>{plan}</h3><a href="#contato">Consultar investimento <ArrowUpRight size={18}/></a></div>)}</div>
   </section>
   <section id="mentorias" className="mentoring"><div className="mentoring-decor"><EditorialPhoto variant="consultorio" alt="Carolina Ferrareze em pé no consultório, diante da identidade visual"/><span className="mentoring-photo-label">Cuidado com presença e propósito.</span></div><div className="mentoring-content"><span className="eyebrow">03 · MENTORIAS TERAPÊUTICAS</span><h2>{site.journey_title}</h2><p>{site.journey_text}</p>{mentorias.map(item=><div className="mentoring-item" key={item.id}><span><Sparkles size={19}/></span><div><h3>{item.title}</h3><p>{item.description}</p>{item.details&&<small>{item.details}</small>}</div></div>)}<a className="btn btn-light" href="#contato">Quero saber mais <ArrowUpRight size={17}/></a></div></section>
   <section className="editorial-story" aria-label="Uma mensagem da Carolina">
    <div className="story-text"><span className="eyebrow">UM CONVITE PARA VOCÊ</span><h2>O seu processo merece <em>ser vivido com presença.</em></h2><p>Não é sobre fazer tudo de uma vez. É sobre dar espaço para compreender sua história e descobrir novos caminhos.</p><a className="underlined-link" href="#contato">Conversar com a Carolina <ArrowUpRight size={17}/></a></div>
    <div className="story-portrait"><EditorialPhoto variant="perfil" alt="Retrato em perfil de Carolina Ferrareze com luz natural"/></div>
   </section>
   <section className="section process"><div className="section-heading centered"><span className="eyebrow">04 · COMO FUNCIONA</span><h2>O primeiro passo pode<br/><em>ser simples.</em></h2></div><div className="steps"><div><span>01</span><h3>Escolha seu caminho</h3><p>Explore as opções de atendimentos e mentorias.</p></div><div><span>02</span><h3>Entre em contato</h3><p>Preencha o formulário para receber informações.</p></div><div><span>03</span><h3>Converse com a Carolina</h3><p>Entenda disponibilidade, condições e próximos passos.</p></div></div></section>
   <section id="depoimentos" className="testimonials-showcase">
     <div className="section-heading centered"><span className="eyebrow">EXPERIÊNCIAS COMPARTILHADAS</span><h2>Palavras de quem <em>viveu esse processo.</em></h2><p>Trechos de mensagens compartilhadas por pessoas atendidas, com a identidade preservada. Cada experiência é única.</p></div>
     <div className="testimonials-gallery" aria-label="Depoimentos recebidos">
      {[
       ['relato-1.svg','Percebo outra visão de mundo e de mim mesma'],
       ['relato-2.svg','Muita diferença em tão pouco tempo'],
       ['relato-3.svg','Minha energia mudou nos últimos dias'],
       ['relato-4.svg','Foi algo muito além e mais profundo'],
       ['relato-5.svg','A experiência trouxe uma sensação de leveza']
      ].map(([file,alt],i)=><a key={file} className="testimonial-image-card" href={'/images/depoimentos/'+file} target="_blank" rel="noreferrer" aria-label={'Abrir depoimento '+(i+1)+': '+alt}>
       <img src={'/images/depoimentos/'+file} loading="lazy" alt={'Trecho de depoimento: '+alt} width="760" height="560"/>
       <span>Ver depoimento completo <ArrowUpRight size={15}/></span>
      </a>)}
     </div>
     <p className="testimonial-disclaimer">Mensagens compartilhadas para ilustrar experiências pessoais. Os resultados não são garantidos e variam de pessoa para pessoa.</p>
   </section>
   {testimonials.length>0&&<section className="section testimonials"><div className="section-heading centered"><span className="eyebrow">PALAVRAS QUE ACOLHEM</span><h2>Histórias compartilhadas.</h2></div><div className="testimonial-cards">{testimonials.map(t=><blockquote key={t.id}><Quote size={23}/><p>“{t.quote}”</p><cite>— {t.display_name}</cite></blockquote>)}</div></section>}
   {faqs.length>0&&<section id="duvidas" className="section faq"><div className="section-copy"><span className="eyebrow">05 · DÚVIDAS FREQUENTES</span><h2>Talvez você esteja se perguntando...</h2><p>Algumas respostas para ajudar no seu próximo passo.</p></div><div className="faq-list">{faqs.map(f=><details key={f.id}><summary>{f.question}<span>+</span></summary><p>{f.answer}</p></details>)}</div></section>}
   <section id="contato" className="contact-section"><div className="contact-copy"><span className="eyebrow">SEU PRÓXIMO PASSO</span><h2>Vamos começar<br/><em>uma conversa?</em></h2><p>Preencha o formulário e a Carolina poderá entrar em contato com você para conversar sobre o que procura.</p><div className="contact-side"><MessageCircle size={23}/><div><strong>Prefere o WhatsApp?</strong><a href={wa} target="_blank" rel="noreferrer">Iniciar uma conversa <ArrowUpRight size={16}/></a></div></div></div><div className="form-panel"><span className="eyebrow">FALE COMIGO</span><h3>Conte um pouco sobre seu interesse.</h3><LeadForm/></div></section>
  </main>
  <footer className="footer"><div><a className="brand footer-brand" href="#inicio"><span className="brand-mark">C<span>F</span></span><span>{site.brand}<small>{site.subtitle}</small></span></a><p>{site.footer_note}</p></div><div className="footer-social">{site.instagram&&<a href={site.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={20}/></a>}{site.whatsapp&&<a href={wa} aria-label="WhatsApp" target="_blank" rel="noreferrer"><MessageCircle size={20}/></a>}{site.contact_email&&<a href={'mailto:'+site.contact_email} aria-label="Email" style={{width:'auto',padding:'0 12px',fontSize:12}}>E-mail</a>}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.brand}. Todos os direitos reservados.</span><a href="/privacy">Privacidade</a></div></footer>
 </div>
}