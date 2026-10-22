'use client';
import { ArrowRight, ArrowUpRight, Heart, Leaf, Sparkles, Instagram, MessageCircle, Quote, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LeadForm from './LeadForm';
import { whatsappUrl } from '@/lib/config';
function EditorialPhoto({src,variant='hero',alt}) {
 if(src) return <img src={src} alt={alt} className="editorial-original" loading={variant==='hero'?'eager':'lazy'}/>;
 return <div role="img" aria-label={alt} className={'editorial-photo editorial-photo--'+variant}/>;
}
export default function Landing({site,services,testimonials,faqs}){
 const [mobile,setMobile]=useState(false);
 const atendimento=services.filter(s=>s.category==='atendimento');
 const mentorias=services.filter(s=>s.category==='mentoria');
 const wa=whatsappUrl(site.whatsapp);
 const close=()=>setMobile(false);
 return <div className="site-shell">
  <header className="topbar"><a className="brand" href="#inicio" onClick={close}><span className="brand-mark">C<span>F</span></span><span>{site.brand}<small>{site.subtitle}</small></span></a>
   <nav className={mobile?'nav open':'nav'} aria-label="Navegação principal"><a onClick={close} href="#sobre">Sobre mim</a><a onClick={close} href="#atendimentos">Atendimentos</a><a onClick={close} href="#mentorias">Mentorias</a>{faqs.length>0&&<a onClick={close} href="#duvidas">Dúvidas</a>}<a onClick={close} className="nav-contact" href="#contato">Vamos conversar <ArrowUpRight size={16}/></a></nav>
   <button className="nav-toggle" aria-label={mobile?'Fechar menu':'Abrir menu'} onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  </header>
  <main>
   <section id="inicio" className="hero"><div className="hero-content"><span className="eyebrow"><span className="eyebrow-dot"/> {site.hero_eyebrow}</span><h1>{site.hero_title}</h1><p className="hero-desc">{site.hero_description}</p><div className="hero-actions"><a className="btn btn-dark" href="#atendimentos">Conhecer atendimentos <ArrowUpRight size={18}/></a><a className="btn btn-ghost" href="#mentorias">Explorar mentorias <ArrowRight size={18}/></a></div><div className="hero-signature"><span className="line"/> Um convite para olhar para dentro.</div></div>
    <div className="hero-art"><EditorialPhoto src={site.hero_image_url} variant="hero" alt="Carolina Ferrareze sentada em seu consultório, com a marca ao fundo"/><div className="floating-note"><Sparkles size={18}/><span>Seu caminho é único.</span></div></div>
   </section>
   <section className="intro-band"><span>acolher</span><i/> <span>compreender</span><i/><span>ressignificar</span><i/><span>florescer</span></section>
   <section id="sobre" className="section about"><div className="about-visual"><EditorialPhoto src={site.about_image_url} variant="about" alt="Retrato profissional de Carolina Ferrareze sentada no sofá do consultório"/><div className="about-badge"><Heart size={17}/> Um olhar individual</div></div><div className="section-copy"><span className="eyebrow">01 · SOBRE MIM</span><h2>{site.about_title}</h2><div className="accent-line"/><p>{site.about_text}</p><a className="underlined-link" href="#contato">Entre em contato <ArrowUpRight size={18}/></a></div></section>
   <section className="section paths" id="atendimentos"><div className="section-heading centered"><span className="eyebrow">02 · ATENDIMENTOS</span><h2>Um espaço para<br/><em>se reconectar.</em></h2><p>Conheça os atendimentos individuais e encontre uma possibilidade de cuidado que faça sentido para você.</p></div>
    <div className="cards">{atendimento.map((item,index)=><article className="service-card" key={item.id}><div className="service-number">0{index+1} <Leaf size={19}/></div><span className="service-tag">{item.label||'ATENDIMENTO'}</span><h3>{item.title}</h3><p>{item.description}</p>{item.details&&<div className="service-details">{item.details}</div>}<a href="#contato" className="card-link">Tenho interesse <ArrowUpRight size={19}/></a></article>)}</div>
   </section>
   <section id="mentorias" className="mentoring"><div className="mentoring-decor"><EditorialPhoto variant="consultorio" alt="Carolina Ferrareze em pé no consultório, diante da identidade visual"/><span className="mentoring-photo-label">Cuidado com presença e propósito.</span></div><div className="mentoring-content"><span className="eyebrow">03 · MENTORIAS TERAPÊUTICAS</span><h2>{site.journey_title}</h2><p>{site.journey_text}</p>{mentorias.map(item=><div className="mentoring-item" key={item.id}><span><Sparkles size={19}/></span><div><h3>{item.title}</h3><p>{item.description}</p>{item.details&&<small>{item.details}</small>}</div></div>)}<a className="btn btn-light" href="#contato">Quero saber mais <ArrowUpRight size={17}/></a></div></section>
   <section className="editorial-story" aria-label="Uma mensagem da Carolina">
    <div className="story-text"><span className="eyebrow">UM CONVITE PARA VOCÊ</span><h2>O seu processo merece <em>ser vivido com presença.</em></h2><p>Não é sobre fazer tudo de uma vez. É sobre dar espaço para compreender sua história e descobrir novos caminhos.</p><a className="underlined-link" href="#contato">Conversar com a Carolina <ArrowUpRight size={17}/></a></div>
    <div className="story-portrait"><EditorialPhoto variant="perfil" alt="Retrato em perfil de Carolina Ferrareze com luz natural"/></div>
   </section>
   <section className="section process"><div className="section-heading centered"><span className="eyebrow">04 · COMO FUNCIONA</span><h2>O primeiro passo pode<br/><em>ser simples.</em></h2></div><div className="steps"><div><span>01</span><h3>Escolha seu caminho</h3><p>Explore as opções de atendimentos e mentorias.</p></div><div><span>02</span><h3>Entre em contato</h3><p>Preencha o formulário para receber informações.</p></div><div><span>03</span><h3>Converse com a Carolina</h3><p>Entenda disponibilidade, condições e próximos passos.</p></div></div></section>
   {testimonials.length>0&&<section className="section testimonials"><div className="section-heading centered"><span className="eyebrow">PALAVRAS QUE ACOLHEM</span><h2>Histórias compartilhadas.</h2></div><div className="testimonial-cards">{testimonials.map(t=><blockquote key={t.id}><Quote size={23}/><p>“{t.quote}”</p><cite>— {t.display_name}</cite></blockquote>)}</div></section>}
   {faqs.length>0&&<section id="duvidas" className="section faq"><div className="section-copy"><span className="eyebrow">05 · DÚVIDAS FREQUENTES</span><h2>Talvez você esteja se perguntando...</h2><p>Algumas respostas para ajudar no seu próximo passo.</p></div><div className="faq-list">{faqs.map(f=><details key={f.id}><summary>{f.question}<span>+</span></summary><p>{f.answer}</p></details>)}</div></section>}
   <section id="contato" className="contact-section"><div className="contact-copy"><span className="eyebrow">SEU PRÓXIMO PASSO</span><h2>Vamos começar<br/><em>uma conversa?</em></h2><p>Preencha o formulário e a Carolina poderá entrar em contato com você para conversar sobre o que procura.</p><div className="contact-side"><MessageCircle size={23}/><div><strong>Prefere o WhatsApp?</strong><a href={wa} target="_blank" rel="noreferrer">Iniciar uma conversa <ArrowUpRight size={16}/></a></div></div></div><div className="form-panel"><span className="eyebrow">FALE COMIGO</span><h3>Conte um pouco sobre seu interesse.</h3><LeadForm/></div></section>
  </main>
  <footer className="footer"><div><a className="brand footer-brand" href="#inicio"><span className="brand-mark">C<span>F</span></span><span>{site.brand}<small>{site.subtitle}</small></span></a><p>{site.footer_note}</p></div><div className="footer-social">{site.instagram&&<a href={site.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={20}/></a>}{site.whatsapp&&<a href={wa} aria-label="WhatsApp" target="_blank" rel="noreferrer"><MessageCircle size={20}/></a>}{site.contact_email&&<a href={'mailto:'+site.contact_email} aria-label="Email" style={{width:'auto',padding:'0 12px',fontSize:12}}>E-mail</a>}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.brand}. Todos os direitos reservados.</span><a href="/privacy">Privacidade</a></div></footer>
 </div>
}