'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FilePenLine,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import AccessPanel from '@/components/admin/panels/AccessPanel';
import LeadsPanel from '@/components/admin/panels/LeadsPanel';
import Field from '@/components/admin/Field';
import MediaUploader from '@/components/admin/MediaUploader';
import { adminApi as api } from '@/lib/admin/api-client';
import { createLeadsCsv, filterLeads, formatLeadDate as when } from '@/lib/admin/leads.mjs';
import { fallbackSite } from '@/lib/config';
import { DEFAULT_MANTRA_WORDS, parseMantraWords } from '@/lib/mantra';
import './admin.css';

// Cada seção do menu abre uma área de gestão sem recarregar a página.
const sections = [
  ['dashboard', 'Visão geral'],
  ['site', 'Editor do site'],
  ['atendimento', 'Atendimentos'],
  ['mentoria', 'Mentorias'],
  ['testimonials', 'Depoimentos'],
  ['gallery', 'Fotos de depoimentos'],
  ['faqs', 'Perguntas frequentes'],
  ['leads', 'Contatos recebidos'],
  ['acessos', 'Acessos e segurança'],
];

const navIcons = {
  dashboard: LayoutDashboard,
  site: FilePenLine,
  atendimento: HeartHandshake,
  mentoria: Sparkles,
  testimonials: MessageSquareQuote,
  gallery: Images,
  faqs: CircleHelp,
  leads: Users,
  acessos: ShieldCheck,
};

const navDescriptions = {
  dashboard: 'O que está acontecendo no seu site',
  site: 'Textos, fotos e identidade visual',
  atendimento: 'Serviços e modalidades disponíveis',
  mentoria: 'Acompanhamentos e programas',
  testimonials: 'Relatos escritos de clientes',
  gallery: 'Imagens e prints autorizados',
  faqs: 'Respostas para as dúvidas comuns',
  leads: 'Pessoas interessadas nos serviços',
  acessos: 'Pessoas com permissão de acesso',
};

const labels = {
  novo: 'Novo',
  em_contato: 'Em contato',
  agendado: 'Agendado',
  concluido: 'Concluído',
  descartado: 'Descartado',
};

const kinds = {
  atendimento: 'Atendimento',
  mentoria: 'Mentoria',
  informacoes: 'Informações',
};

export default function Admin(){
 // Sessão do usuário autenticado.
 const [role, setRole] = useState('loading');
 const [login, setLogin] = useState('');
 const [password, setPassword] = useState('');
 const [authError, setAuthError] = useState('');
 const [viewer, setViewer] = useState(null);

 // Navegação e retorno visual das operações.
 const [tab, setTab] = useState('dashboard');
 const [navOpen, setNavOpen] = useState(false);
 const [busy, setBusy] = useState(false);
 const [message, setMessage] = useState('');

 // Conteúdo editável do site.
 const [site, setSite] = useState(fallbackSite);
 const [services, setServices] = useState([]);
 const [testimonials, setTestimonials] = useState([]);
 const [faqs, setFaqs] = useState([]);
 const [gallery, setGallery] = useState([]);

 // Contatos, filtros e usuários administrativos.
 const [leads, setLeads] = useState([]);
 const [query, setQuery] = useState('');
 const [leadStatusFilter, setLeadStatusFilter] = useState('todos');
 const [accounts, setAccounts] = useState([]);
 const [audit, setAudit] = useState([]);
 const [newEmail, setNewEmail] = useState('');
 const [newRole, setNewRole] = useState('owner');
 const [inviteUrl, setInviteUrl] = useState('');
 const refresh=useCallback(async()=>{
  const data=await api('/api/admin/data');
  setSite(data.site||fallbackSite);setServices(data.services||[]);setTestimonials(data.testimonials||[]);setFaqs(data.faqs||[]);setGallery(data.gallery||[]);setLeads(data.leads||[]);
 },[]);
 const refreshAccess=useCallback(async()=>{
  const data=await api('/api/admin/users');
  setAccounts(data.users||[]);setAudit(data.audit||[]);
 },[]);
 useEffect(()=>{
  let active=true;
  api('/api/admin/session').then(async data=>{
   if(!active)return;
   setRole(data.configured?(data.authenticated?'admin':'guest'):'unconfigured');setViewer(data.user||null);
   if(data.authenticated){try{await refresh()}catch(e){if(active)setMessage('Erro: '+e.message)}}
  }).catch(()=>{if(active){setRole('guest');setAuthError('Não foi possível verificar a sessão. Tente novamente.')}});
  return ()=>{active=false};
 },[refresh]);
 useEffect(() => {
  if (tab !== 'acessos' || role !== 'admin') return;

  let active = true;
  async function loadAccounts() {
   try {
    const data = await api('/api/admin/users');
    if (!active) return;
    setAccounts(data.users ?? []);
    setAudit(data.audit ?? []);
   } catch (error) {
    if (active) setMessage('Erro: ' + error.message);
   }
  }

  void loadAccounts();
  return () => { active = false; };
 }, [tab, role]);
 useEffect(()=>{
  if(!navOpen)return;
  const onKey=e=>{if(e.key==='Escape')setNavOpen(false)};
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[navOpen]);
 const chooseTab=(next)=>{
  setTab(next);setMessage('');setNavOpen(false);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 async function run(action, successMessage = 'Alterações salvas com sucesso.') {
  setBusy(true);
  setMessage('');

  try {
   await action();
   setMessage(successMessage);
  } catch (error) {
   setMessage('Erro: ' + (error instanceof Error ? error.message : 'Falha inesperada.'));
  } finally {
   setBusy(false);
  }
 }
 async function signIn(event) {
  event.preventDefault();
  setBusy(true);
  setAuthError('');
  try {
   const result = await api('/api/admin/session', 'POST', { email: login, password });
   setPassword('');
   setViewer(result.user || null);
   setRole('admin');
   // A falha ao carregar conteúdo não equivale a uma falha na senha.
   try {
    await refresh();
   } catch (error) {
    setMessage('Erro ao carregar os dados: ' + error.message);
   }
  } catch (error) {
   setAuthError(error.message);
  } finally {
   setBusy(false);
  }
 }

 async function signOut() {
  if(busy) return;
  setBusy(true);
  setMessage('');
  try {
   await api('/api/admin/session', 'DELETE');
   setRole('guest');
   setViewer(null);
   setPassword('');
   setAuthError('');
   setInviteUrl('');
   setTab('dashboard');
   setNavOpen(false);
   // Limpa da memória os dados pessoais recebidos das APIs.
   setSite(fallbackSite);
   setServices([]);
   setTestimonials([]);
   setFaqs([]);
   setGallery([]);
   setLeads([]);
   setAccounts([]);
   setAudit([]);
  } catch(error) {
   setMessage('Erro ao sair: ' + error.message);
  } finally {
   setBusy(false);
  }
 }
 const changeSite = (name, value) => setSite((current) => ({ ...current, [name]: value }));

 // Mapa explícito: muito mais fácil de seguir no depurador do VS Code.
 const collectionSetters = {
  services: setServices,
  testimonials: setTestimonials,
  faqs: setFaqs,
  gallery: setGallery,
 };
 const updateListItem = (collection, id, field, value) => {
  const setter = collectionSetters[collection];
  setter?.((items) => items.map((item) =>
   item.id === id ? { ...item, [field]: value } : item
  ));
 };
 async function saveSite() {
  await run(async () => {
   const response = await api('/api/admin/data', 'PUT', { type: 'site', item: site });
   if (response?.item) setSite(response.item);
  }, 'Site atualizado com sucesso.');
 }
 function addItem(type){
  const id='draft_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2);
  if(type==='services')setServices(p=>[...p,{id,category:tab,title:'',description:'',details:'',image_url:'',label:'',is_published:false,position:p.filter(x=>x.category===tab).length+1}]);
  if(type==='testimonials')setTestimonials(p=>[...p,{id,display_name:'',quote:'',permission_confirmed:false,is_published:false,position:p.length+1}]);
  if(type==='faqs')setFaqs(p=>[...p,{id,question:'',answer:'',is_published:false,position:p.length+1}]);
  if(type==='gallery')setGallery(p=>[...p,{id,url:'',caption:'',alt_text:'',consent_confirmed:false,is_published:false,position:p.length+1}]);
 }
 async function saveItem(type, item) {
  await run(async () => {
   const isDraft = item.id.startsWith('draft_');
   const response = await api('/api/admin/data', isDraft ? 'POST' : 'PUT', {
    type,
    item,
    id: item.id,
   });

   // Atualiza apenas o item salvo: evita perder rascunhos de outros formulários.
   if (response?.item) {
    collectionSetters[type]?.((items) =>
     items.map((current) =>
      current.id === item.id ? response.item : current
     )
    );
   }
  }, 'Item salvo com sucesso.');
 }
 async function removeItem(type, item) {
  if (!window.confirm('Deseja realmente excluir este item?')) return;
  const removeFromList = () => collectionSetters[type]?.(
   (items) => items.filter((current) => current.id !== item.id)
  );
  if (item.id.startsWith('draft_')) {
   removeFromList();
   return;
  }
  await run(async () => {
   await api('/api/admin/data?type=' + type + '&id=' + encodeURIComponent(item.id), 'DELETE');
   removeFromList();
  }, 'Item excluído com sucesso.');
 }
 async function updateLead(id,status){
  try{await api('/api/admin/data','PUT',{type:'leads',id,status});setLeads(rows=>rows.map(x=>x.id===id?{...x,status}:x))}
  catch(e){setMessage('Erro: '+e.message)}
 }

 async function saveLeadNote(id,notes){
  try{
   await api('/api/admin/data','PUT',{type:'leads',id,item:{admin_notes:notes}});
   setMessage('Observação salva com sucesso.');
  }catch(e){setMessage('Erro: '+e.message);}
 }
 function exportLeads() {
  // Exporta exatamente os mesmos contatos que o filtro exibe.
  const csv = createLeadsCsv(filteredLeads, labels, kinds);
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = 'carolina-contatos-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
 }

 async function inviteAccount(e){
  e.preventDefault();setBusy(true);setMessage('');setInviteUrl('');
  try{
   const result=await api('/api/admin/users','POST',{email:newEmail.trim().toLowerCase(),role:newRole});
   setInviteUrl(result.inviteUrl);setNewEmail('');
   setMessage('Convite gerado. Compartilhe o link de forma privada com a pessoa.');
   await refreshAccess();
  }catch(err){setMessage('Erro: '+err.message)}
  finally{setBusy(false)}
 }
 async function toggleSupport(user){
  if(!window.confirm('Desativar o acesso de suporte de '+user.email+' e encerrar todas as sessões?'))return;
  try{
   await api('/api/admin/users','PATCH',{id:user.id,active:false});
   setMessage('Acesso revogado. O usuário foi retirado da lista de acessos ativos; a auditoria foi preservada.');
   await refreshAccess();
  }catch(err){setMessage('Erro: '+err.message)}
 }
 async function selfEndSupport(){
  if(viewer?.role!=='support')return;
  if(!window.confirm('Encerrar permanentemente seu acesso de suporte? Você perderá o acesso imediatamente, inclusive em outros dispositivos.'))return;
  setBusy(true);setMessage('');
  try{
   await api('/api/admin/users','DELETE');
   setRole('guest');setViewer(null);setPassword('');setTab('dashboard');
  }catch(err){setMessage('Erro: '+err.message)}
  finally{setBusy(false)}
 }

 // Valores derivados do estado, reutilizados no painel e na exportação CSV.
 const filteredLeads = filterLeads(leads, query, leadStatusFilter, kinds);
 const newLeadsCount = leads.filter((lead) => lead.status === 'novo').length;
 const scheduledLeadsCount = leads.filter((lead) => lead.status === 'agendado').length;

 if(role==='loading')return <main className="admin-body admin-auth-screen"><div className="admin-login"><div className="admin-auth-monogram">CF</div><p>Carregando seu espaço...</p></div></main>;
 if(role!=='admin')return <main className="admin-body admin-auth-screen"><div className="admin-login"><div className="admin-auth-monogram">CF</div><Link className="admin-back" href="/">← Voltar ao site</Link><h1>Espaço Carolina</h1><p>Painel exclusivo para editar a página e acompanhar interessados.</p>
 {role==='unconfigured'?<p className="admin-alert admin-error">Configure o banco Neon e as variáveis de acesso no servidor da Vercel para ativar este painel.</p>:<form onSubmit={signIn}>
 <Field label="E-mail administrativo" type="email" value={login} onChange={setLogin}/>
 <Field label="Senha" type="password" value={password} onChange={setPassword}/>
 <button className="admin-btn" type="submit" disabled={busy}>Entrar no painel</button>
 {authError&&<p role="alert" className="admin-alert admin-error">{authError}</p>}</form>}
 <p className="admin-note">O acesso é restrito à responsável. Não existe cadastro público.</p></div></main>;
 const editor=[
  ['Identidade visual',[['brand','Nome da marca'],['subtitle','Subtítulo da marca'],['hero_eyebrow','Texto acima do título'],['hero_title','Título principal (hero)'],['hero_description','Descrição do hero'],['hero_image_url','URL da foto principal']]],
  ['Palavras da faixa',[['mantra_words','Palavras exibidas abaixo da foto principal']]],
  ['Sobre mim',[['about_title','Título de apresentação'],['about_text','Sua trajetória e formações'],['about_image_url','URL da sua foto']]],
  ['Fotos das seções',[['mentoring_image_url','Imagem da seção mentorias'],['editorial_image_url','Foto da seção editorial']]],
  ['Acompanhamento terapêutico',[['accompaniment_title','Título da seção'],['accompaniment_intro','Apresentação do acompanhamento'],['accompaniment_goal','Objetivo e benefícios propostos'],['accompaniment_topics','Temas: um por linha, no formato Nome|Descrição'],['accompaniment_format','Formato: uma informação por linha'],['accompaniment_packages','Pacotes: um por linha, sem preços']]],
  ['Mentorias e contato',[['journey_title','Título da jornada'],['journey_text','Texto introdutório'],['whatsapp','Número WhatsApp com 55 e DDD'],['instagram','Link do Instagram'],['contact_email','E-mail'],['footer_note','Texto do rodapé']]],
  ['SEO',[['seo_title','Título das buscas'],['seo_description','Descrição das buscas']]]
 ];
 const mantraPreview=parseMantraWords(site.mantra_words ?? DEFAULT_MANTRA_WORDS);
 const type=(tab==='atendimento'||tab==='mentoria')?'services':tab;
 const changeLocal = (id, field, value) => updateListItem(type, id, field, value);
 return <div className="admin-body">
 <header className="admin-header">
  <div className="admin-header-brand">
   <button className="admin-menu-toggle" type="button" aria-label={navOpen?'Fechar menu':'Abrir menu'} aria-expanded={navOpen} aria-controls="admin-main-navigation" onClick={()=>setNavOpen(v=>!v)}>
    {navOpen?<X size={22}/>:<Menu size={22}/>}
   </button>
   <span className="admin-brand-mark" aria-hidden="true">CF</span>
   <div className="admin-brand-copy"><strong>Carolina Ferrareze</strong><small>Painel de gestão <span className="admin-brand-separator">/</span> {viewer?.role==='owner'?'Proprietária':'Suporte técnico'}</small></div>
  </div>
  <div className="admin-header-right">
   <div className="admin-header-account"><span className="admin-account-dot"/><span>{viewer?.email}</span></div>
   <Link className="admin-btn secondary admin-view-site" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={17}/><span>Ver site</span></Link>
   <button type="button" className="admin-btn admin-signout" onClick={signOut} disabled={busy} aria-label="Sair da administração" title="Sair"><LogOut size={17}/><span>Sair</span></button>
  </div>
 </header>
 {navOpen&&<button type="button" className="admin-nav-backdrop" aria-label="Fechar menu de navegação" onClick={()=>setNavOpen(false)}/>}
 <div className="admin-layout">
  <nav id="admin-main-navigation" className={'admin-sidebar'+(navOpen?' is-open':'')} aria-label="Navegação administrativa">
   <div className="admin-sidebar-caption">ÁREA DE TRABALHO</div>
   <div className="admin-nav-list">
    {sections.map(([id,label],i)=>{
      const Icon=navIcons[id];
      return <button type="button" className={'admin-nav-item'+(tab===id?' active':'')} aria-current={tab===id?'page':undefined} key={id} onClick={()=>chooseTab(id)}>
       <Icon size={18} strokeWidth={1.9}/>
       <span>{label}</span>
       {id==='leads'&&newLeadsCount>0&&<span className="admin-nav-count">{newLeadsCount}</span>}
       {tab===id&&<ChevronRight size={15} className="admin-nav-chevron"/>}
      </button>;
    })}
   </div>
   <div className="admin-sidebar-footer"><span className="admin-sidebar-avatar" aria-hidden="true">{viewer?.role==='owner'?'CF':'ST'}</span><div><strong>{viewer?.role==='owner'?'Carolina · Proprietária':'Suporte técnico'}</strong><span>Ambiente administrativo</span></div></div>
  </nav>
  <main className="admin-main" id="admin-content">
   <div className="admin-title">
    <div className="admin-title-copy">
     <span className="admin-eyebrow">ESPAÇO CAROLINA <span aria-hidden="true">/</span> PAINEL</span>
     <h1>{sections.find(x=>x[0]===tab)?.[1]}</h1>
     <p>{navDescriptions[tab]}</p>
    </div>
    <Link className="admin-title-link" href="/" target="_blank" rel="noopener noreferrer">Visualizar página <ArrowUpRight size={17}/></Link>
   </div>
 {message&&<p role="status" className={'admin-alert '+(message.startsWith('Erro')?'admin-error':'')}>{message}</p>}
 {tab==='dashboard'&&<>
 <div className="admin-stats">
  <div className="admin-stat"><div className="admin-stat-header"><span>Contatos recebidos</span><Users size={20}/></div><strong>{leads.length}</strong><small>Pessoas que preencheram o formulário</small></div>
  <div className="admin-stat"><div className="admin-stat-header"><span>Novos contatos</span><MessageSquareQuote size={20}/></div><strong>{newLeadsCount}</strong><small>Interesses que aguardam retorno</small></div>
  <div className="admin-stat"><div className="admin-stat-header"><span>Agendamentos</span><HeartHandshake size={20}/></div><strong>{scheduledLeadsCount}</strong><small>Contatos com atendimento agendado</small></div>
 </div>
 <div className="admin-panel"><h2>Últimos contatos</h2>{leads.length?leads.slice(0,5).map(l=><p className="admin-mini" key={l.id}><strong>{l.full_name}</strong> · {kinds[l.interest]} · {when(l.created_at)}</p>):<p className="admin-empty">Nenhum contato recebido até agora.</p>}
 <button className="admin-btn secondary" onClick={()=>chooseTab('leads')}>Ver interessados</button></div></>}
 {tab==='site'&&<>{editor.map(([heading,fields])=><section className="admin-panel" key={heading}><h2>{heading}</h2><div className="admin-grid">{fields.map(([key,label])=>{
  const wide=['mantra_words','hero_title','hero_description','about_text','journey_text','seo_description','hero_image_url','about_image_url','mentoring_image_url','editorial_image_url','accompaniment_intro','accompaniment_goal','accompaniment_topics','accompaniment_format','accompaniment_packages'].includes(key);
  const textarea=['hero_description','about_text','journey_text','seo_description','accompaniment_intro','accompaniment_goal','accompaniment_topics','accompaniment_format','accompaniment_packages'].includes(key);
  return <div className={wide?'wide':''} key={key}>
   {key.endsWith('_image_url')?
    <><div className="admin-field-label">{label}</div>
      <MediaUploader label={label} url={site[key]} onUploaded={url=>changeSite(key,url)}/>
      <details className="admin-advanced-url"><summary>Endereço da imagem <span>(avançado)</span></summary><Field label="URL da fotografia" value={site[key]} onChange={value=>changeSite(key,value)}/></details>
    </>
    :<>
      <Field label={label} value={site[key]} onChange={value=>changeSite(key,value)} textarea={textarea}/>
      {key==='mantra_words'&&<div className="admin-mantra-editor">
        <p>Separe as palavras por vírgulas (ou ponto e vírgula). Você pode usar até 8 expressões; deixe o campo vazio para ocultar a faixa. Clique em <strong>Salvar alterações</strong> para publicar.</p>
        <div className="admin-mantra-preview" aria-label="Prévia da faixa de palavras">
          {mantraPreview.length?mantraPreview.map((word,index)=><span className="admin-mantra-term" key={index}>
            <span>{word}</span>
            {index<mantraPreview.length-1&&<i aria-hidden="true"/>}
          </span>):<span className="admin-mantra-empty">A faixa ficará oculta quando você salvar.</span>}
        </div>
      </div>}
    </>}
  </div>;
 })}</div></section>)}
 <div className="admin-sticky-save">
  <div className="admin-save-explainer"><Save size={19}/><div><strong>Publicar alterações</strong><small>Edite os campos acima e salve para atualizar a página da Carolina.</small></div></div>
  <button type="button" className="admin-btn" disabled={busy} onClick={saveSite}><Save size={17}/>{busy?'Salvando...':'Salvar alterações'}</button>
 </div></>}
 {(tab==='atendimento'||tab==='mentoria')&&<section className="admin-panel"><div className="admin-heading-row"><h2>{tab==='atendimento'?'Atendimentos':'Mentorias'}</h2><button className="admin-btn" onClick={()=>addItem('services')}><Plus size={15}/> Adicionar</button></div>
 {services.filter(x=>x.category===tab).map(item=><div key={item.id} className="admin-card"><div className="admin-card-head"><h3>{item.title||'Novo serviço'}</h3><button className="admin-btn danger" onClick={()=>removeItem('services',item)}><Trash2 size={14}/> Excluir</button></div>
 <div className="admin-grid"><Field label="Nome" value={item.title} onChange={v=>changeLocal(item.id,'title',v)}/><Field label="Etiqueta" value={item.label} onChange={v=>changeLocal(item.id,'label',v)}/><Field label="Descrição" wide textarea value={item.description} onChange={v=>changeLocal(item.id,'description',v)}/><Field label="Detalhes" wide textarea value={item.details} onChange={v=>changeLocal(item.id,'details',v)}/><div className="wide"><div className="admin-field-label">Imagem do serviço</div><MediaUploader url={item.image_url} label={'Imagem de '+item.title} onUploaded={v=>changeLocal(item.id,'image_url',v)}/><details className="admin-advanced-url"><summary>Endereço da imagem <span>(avançado)</span></summary><Field label="URL da imagem" value={item.image_url} onChange={v=>changeLocal(item.id,'image_url',v)}/></details></div>
 <Field label="Posição" type="number" value={item.position} onChange={v=>changeLocal(item.id,'position',v)}/><label className="admin-check"><input type="checkbox" checked={item.is_published} onChange={e=>changeLocal(item.id,'is_published',e.target.checked)}/>Publicado</label></div>
 <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.title?.trim()} onClick={()=>saveItem('services',item)}><Save size={14}/> Salvar</button></div></div>)}
 {!services.some(x=>x.category===tab)&&<p className="admin-empty">Nenhum serviço cadastrado.</p>}</section>}
 {tab==='testimonials'&&<section className="admin-panel"><div className="admin-heading-row"><h2>Depoimentos</h2><button className="admin-btn" onClick={()=>addItem('testimonials')}><Plus size={14}/> Adicionar</button></div>
 <p className="admin-note">Publique apenas depoimentos verdadeiros e autorizados.</p>
 {testimonials.map(item=><div className="admin-card" key={item.id}><div className="admin-grid">
 <Field label="Nome público" value={item.display_name} onChange={v=>changeLocal(item.id,'display_name',v)}/>
 <Field label="Posição" type="number" value={item.position} onChange={v=>changeLocal(item.id,'position',v)}/>
 <Field label="Depoimento" wide textarea value={item.quote} onChange={v=>changeLocal(item.id,'quote',v)}/>
 <label className="admin-check"><input type="checkbox" checked={item.permission_confirmed} onChange={e=>changeLocal(item.id,'permission_confirmed',e.target.checked)}/>Autorização confirmada</label>
 <label className="admin-check"><input type="checkbox" checked={item.is_published} onChange={e=>changeLocal(item.id,'is_published',e.target.checked)}/>Publicado</label></div>
 <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.quote?.trim()||!item.display_name?.trim()} onClick={()=>saveItem('testimonials',item)}>Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('testimonials',item)}>Excluir</button></div></div>)}</section>}
 {tab==='gallery'&&<section className="admin-panel">
  <div className="admin-heading-row"><h2>Imagens dos depoimentos</h2><button className="admin-btn" onClick={()=>addItem('gallery')}><Plus size={14}/> Adicionar imagem</button></div>
  <p className="admin-note">Envie os prints ou imagens, ocultando nomes, números e qualquer dado pessoal. Cada imagem só será publicada se houver autorização de divulgação confirmada. Os cinco cartões de demonstração serão substituídos pelas imagens autorizadas publicadas aqui.</p>
  {gallery.map(item=><div className="admin-card" key={item.id}>
   <div className="admin-card-head"><div><span className="admin-card-overline">DEPOIMENTO VISUAL</span><h3>{item.caption||'Novo depoimento visual'}</h3></div><button type="button" className="admin-btn danger" onClick={()=>removeItem('gallery',item)}><Trash2 size={16}/> Excluir</button></div>
   <div className="admin-grid">
    <div className="wide"><MediaUploader url={item.url} label="Print do depoimento" onUploaded={v=>changeLocal(item.id,'url',v)}/><details className="admin-advanced-url"><summary>Endereço do arquivo <span>(avançado)</span></summary><Field label="URL da imagem" value={item.url} onChange={v=>changeLocal(item.id,'url',v)}/></details></div>
    <Field label="Legenda" value={item.caption} onChange={v=>changeLocal(item.id,'caption',v)}/>
    <Field label="Texto alternativo da imagem" value={item.alt_text} onChange={v=>changeLocal(item.id,'alt_text',v)}/>
    <Field label="Posição" type="number" value={item.position} onChange={v=>changeLocal(item.id,'position',v)}/>
    <label className="admin-check"><input type="checkbox" checked={!!item.consent_confirmed} onChange={e=>changeLocal(item.id,'consent_confirmed',e.target.checked)}/> Tenho autorização para divulgar este relato</label>
    <label className="admin-check"><input type="checkbox" checked={!!item.is_published} onChange={e=>changeLocal(item.id,'is_published',e.target.checked)}/> Publicado</label>
   </div>
   <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.url||!item.consent_confirmed} onClick={()=>saveItem('gallery',item)}><Save size={14}/> Salvar imagem</button></div>
  </div>)}
  {gallery.length===0&&<p className="admin-empty">Nenhuma imagem cadastrada. Clique em Adicionar imagem para começar.</p>}
 </section>}
 {tab==='faqs'&&<section className="admin-panel"><div className="admin-heading-row"><h2>Dúvidas frequentes</h2><button className="admin-btn" onClick={()=>addItem('faqs')}><Plus size={14}/> Adicionar</button></div>
 {faqs.map(item=><div className="admin-card" key={item.id}><div className="admin-grid">
 <Field label="Pergunta" wide value={item.question} onChange={v=>changeLocal(item.id,'question',v)}/>
 <Field label="Resposta" wide textarea value={item.answer} onChange={v=>changeLocal(item.id,'answer',v)}/>
 <Field label="Posição" type="number" value={item.position} onChange={v=>changeLocal(item.id,'position',v)}/>
 <label className="admin-check"><input type="checkbox" checked={item.is_published} onChange={e=>changeLocal(item.id,'is_published',e.target.checked)}/>Publicado</label></div>
 <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.question?.trim()||!item.answer?.trim()} onClick={()=>saveItem('faqs',item)}>Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('faqs',item)}>Excluir</button></div></div>)}</section>}
 {tab==='acessos'&&<AccessPanel
  viewer={viewer}
  accounts={accounts}
  audit={audit}
  busy={busy}
  when={when}
  newEmail={newEmail}
  setNewEmail={setNewEmail}
  newRole={newRole}
  setNewRole={setNewRole}
  inviteUrl={inviteUrl}
  onInviteAccount={inviteAccount}
  onToggleSupport={toggleSupport}
  onSelfEndSupport={selfEndSupport}
 />}
 {tab==='leads'&&<LeadsPanel
  leads={leads}
  filteredLeads={filteredLeads}
  query={query}
  setQuery={setQuery}
  leadStatusFilter={leadStatusFilter}
  setLeadStatusFilter={setLeadStatusFilter}
  labels={labels}
  kinds={kinds}
  when={when}
  busy={busy}
  onRefresh={()=>run(refresh,'Dados atualizados com sucesso.')}
  onExport={exportLeads}
  onUpdateStatus={updateLead}
  onUpdateNote={(id,value)=>setLeads(rows=>rows.map(contact=>contact.id===id?{...contact,admin_notes:value}:contact))}
  onSaveNote={saveLeadNote}
 />}

 </main></div></div>;
}
