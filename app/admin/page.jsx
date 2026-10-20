'use client';
import './admin.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { browserDb, configured, fallbackSite } from '@/lib/config';
import { ArrowUpRight, Save, Plus, LogOut, ImageUp, RefreshCw, Trash2 } from 'lucide-react';

const sections=[
 ['dashboard','Visão geral'],['site','Editor do site'],['atendimento','Atendimentos'],
 ['mentoria','Mentorias'],['testimonials','Depoimentos'],['faqs','Perguntas frequentes'],['leads','Contatos recebidos']
];
const statuses={novo:'Novo',em_contato:'Em contato',agendado:'Agendado',concluido:'Concluído',descartado:'Descartado'};
const kindLabel={atendimento:'Atendimento',mentoria:'Mentoria',informacoes:'Informações'};
const date=(value)=>value?new Date(value).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):'—';

function Field({label,value,onChange,textarea=false,type='text',placeholder='',wide=false}){
 return <label className={'admin-field '+(wide?'wide':'')}>{label}{textarea?<textarea value={value??''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>:<input type={type} value={value??''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}</label>
}
function Upload({db,onUploaded,current}){
 const [working,setWorking]=useState(false),[error,setError]=useState('');
 async function upload(e){
  const file=e.target.files?.[0];if(!file)return;
  setError('');if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)||file.size>5*1024*1024){setError('Use JPG, PNG, WebP ou AVIF com até 5 MB.');return}
  setWorking(true);
  const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':file.type==='image/avif'?'avif':'webp';
  const path='assets/'+crypto.randomUUID()+'.'+ext;
  const {error:err}=await db.storage.from('cf-media').upload(path,file,{contentType:file.type,upsert:false});
  if(err)setError(err.message);
  else{const {data}=db.storage.from('cf-media').getPublicUrl(path);onUploaded(data.publicUrl)}
  setWorking(false);
 }
 return <div className="admin-image-tools">{current&&<img alt="Prévia" className="admin-preview" src={current}/>}<label className="admin-mini"><ImageUp size={15}/> {working?'Enviando...':'Enviar imagem'}<input disabled={working} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload}/></label>{error&&<span className="admin-error">{error}</span>}</div>
}
export default function Admin(){
 const db=useMemo(()=>browserDb(),[]);
 const [role,setRole]=useState('loading'),[login,setLogin]=useState(''),[password,setPassword]=useState('');
 const [authError,setAuthError]=useState(''),[busy,setBusy]=useState(false),[tab,setTab]=useState('dashboard');
 const [site,setSite]=useState(fallbackSite),[services,setServices]=useState([]),[testimonials,setTestimonials]=useState([]),[faqs,setFaqs]=useState([]),[leads,setLeads]=useState([]);
 const [message,setMessage]=useState(''),[loading,setLoading]=useState(false),[query,setQuery]=useState('');
 const notify=(err,success)=>setMessage(err?'Erro: '+(err.message||String(err)):success||'Alterações salvas com sucesso.');
 const loadData=useCallback(async()=>{
  if(!db)return;
  setLoading(true);
  try{
   const [a,b,c,d,e]=await Promise.all([
    db.from('cf_site').select('*').eq('id','main').maybeSingle(),
    db.from('cf_services').select('*').order('position'),
    db.from('cf_testimonials').select('*').order('position'),
    db.from('cf_faqs').select('*').order('position'),
    db.from('cf_leads').select('*').order('created_at',{ascending:false})
   ]);
   const err=[a,b,c,d,e].find(x=>x.error)?.error;
   if(err)notify(err);
   else {setSite(a.data||fallbackSite);setServices(b.data||[]);setTestimonials(c.data||[]);setFaqs(d.data||[]);setLeads(e.data||[])}
  }finally{setLoading(false)}
 },[db]);

 useEffect(()=>{
  if(!db){setRole('unconfigured');return}
  let active=true;
  async function inspect(user){
   if(!user){if(active)setRole('guest');return}
   const {data,error}=await db.from('cf_admins').select('user_id').eq('user_id',user.id).maybeSingle();
   if(!active)return;
   if(error||!data){setRole('denied');return}
   setRole('admin');await loadData();
  }
  db.auth.getUser().then(({data})=>inspect(data?.user)).catch(()=>{if(active)setRole('guest')});
  const {data:listener}=db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT')setTimeout(()=>inspect(session?.user),0)});
  return ()=>{active=false;listener.subscription.unsubscribe()};
 },[db,loadData]);

 async function signIn(e){
  e.preventDefault();setBusy(true);setAuthError('');
  const {error}=await db.auth.signInWithPassword({email:login,password});
  if(error)setAuthError('Não foi possível entrar. Verifique as credenciais.');
  setBusy(false);
 }
 async function signOut(){await db.auth.signOut();setRole('guest');setMessage('')}
 function changeSite(field,value){setSite(s=>({...s,[field]:value}))}
 async function saveSite(){
  setBusy(true);setMessage('');
  const {id,updated_at,...payload}=site;
  const {error}=await db.from('cf_site').update({...payload,updated_at:new Date().toISOString()}).eq('id','main');
  notify(error);setBusy(false);if(!error)loadData();
 }
 function updateLocal(setter,id,key,value){setter(items=>items.map(item=>item.id===id?{...item,[key]:value}:item))}
 function newItem(which){
  const id='new-'+crypto.randomUUID();
  if(which==='cf_services')setServices(p=>[...p,{id,category:tab,title:'',description:'',details:'',image_url:'',label:'',position:p.filter(x=>x.category===tab).length+1,is_published:false}]);
  if(which==='cf_testimonials')setTestimonials(p=>[...p,{id,display_name:'',quote:'',permission_confirmed:false,is_published:false,position:p.length+1}]);
  if(which==='cf_faqs')setFaqs(p=>[...p,{id,question:'',answer:'',is_published:false,position:p.length+1}]);
 }
 async function saveItem(table,item){
  setBusy(true);setMessage('');
  const {id,created_at,...rest}=item;
  const payload={...rest,position:Number(rest.position)||0};
  const operation=String(id).startsWith('new-')?db.from(table).insert(payload):db.from(table).update(payload).eq('id',id);
  const {error}=await operation;notify(error);setBusy(false);
  if(!error)await loadData();
 }
 async function removeItem(table,id){
  if(String(id).startsWith('new-')){
   if(table==='cf_services')setServices(a=>a.filter(x=>x.id!==id));
   if(table==='cf_testimonials')setTestimonials(a=>a.filter(x=>x.id!==id));
   if(table==='cf_faqs')setFaqs(a=>a.filter(x=>x.id!==id));
   return;
  }
  if(!window.confirm('Excluir este item definitivamente?'))return;
  setBusy(true);
  const {error}=await db.from(table).delete().eq('id',id);
  notify(error,error?'':'Item excluído.');setBusy(false);if(!error)loadData();
 }
 async function updateLead(id,field,value){
  const {error}=await db.from('cf_leads').update({[field]:value}).eq('id',id);
  if(error)notify(error);
  else setLeads(p=>p.map(x=>x.id===id?{...x,[field]:value}:x));
 }
 if(role==='loading')return <div className="admin-body"><div className="admin-login"><p>Carregando painel...</p></div></div>;
 if(role!=='admin')return <main className="admin-body"><div className="admin-login"><a className="admin-back" href="/">← Voltar para o site</a><h1>Espaço Carolina</h1><p>Entre com o acesso administrativo autorizado.</p>
  {role==='unconfigured'?<p className="admin-alert admin-error">Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY na Vercel.</p>:
   <>{role==='denied'?<><p className="admin-alert admin-error">Sua conta não tem acesso ao painel. O administrador deve vincular o usuário à tabela cf_admins.</p><button className="admin-btn secondary" onClick={signOut}>Sair da conta</button></>:
   <form onSubmit={signIn}><Field type="email" label="E-mail" value={login} onChange={setLogin}/><Field type="password" label="Senha" value={password} onChange={setPassword}/><button className="admin-btn" type="submit" disabled={busy}>Entrar no painel</button>{authError&&<p className="admin-alert admin-error">{authError}</p>}</form>}</>}
  <p className="admin-note">O cadastro de administradores é feito somente pelo proprietário no Supabase Auth e na tabela cf_admins. Não há cadastro público.</p></div></main>;

 return <div className="admin-body">
  <header className="admin-header"><div><strong>Carolina Ferrareze</strong><small>PAINEL ADMINISTRATIVO</small></div><div className="admin-header-right"><a href="/" target="_blank" rel="noreferrer">Ver site <ArrowUpRight size={13}/></a><button className="admin-btn secondary" onClick={signOut}><LogOut size={13}/> Sair</button></div></header>
  <div className="admin-layout"><nav className="admin-sidebar" aria-label="Painel">{sections.map(([id,title])=><button key={id} className={tab===id?'active':''} onClick={()=>{setTab(id);setMessage('')}}>{title}</button>)}</nav>
  <main className="admin-main"><div className="admin-title"><h1>{sections.find(x=>x[0]===tab)?.[1]}</h1><p>Edite as informações e acompanhe as solicitações com segurança.</p></div>
  {message&&<div role="status" className={'admin-alert '+(message.startsWith('Erro')?'admin-error':'')}>{message}</div>}
  {tab==='dashboard'&&<><div className="admin-stats"><div className="admin-stat"><span>Contatos recebidos</span><strong>{leads.length}</strong></div><div className="admin-stat"><span>Aguardando retorno</span><strong>{leads.filter(l=>l.status==='novo').length}</strong></div><div className="admin-stat"><span>Agendados</span><strong>{leads.filter(l=>l.status==='agendado').length}</strong></div></div><div className="admin-panel"><h2>Últimos interessados</h2>{leads.length?leads.slice(0,6).map(l=><p key={l.id} className="admin-mini"><strong>{l.full_name}</strong> · {kindLabel[l.interest]} · {date(l.created_at)}</p>):<p className="admin-empty">Ainda não há contatos recebidos.</p>}<button className="admin-btn secondary" onClick={()=>setTab('leads')}>Ver todos os contatos</button></div></>}
  {tab==='site'&&<><section className="admin-panel"><h2>Identidade e apresentação</h2><div className="admin-grid"><Field label="Nome no site" value={site.brand} onChange={v=>changeSite('brand',v)}/><Field label="Subtítulo da marca" value={site.subtitle} onChange={v=>changeSite('subtitle',v)}/><Field label="Selo acima do título" value={site.hero_eyebrow} onChange={v=>changeSite('hero_eyebrow',v)} wide/><Field label="Título principal (hero)" value={site.hero_title} onChange={v=>changeSite('hero_title',v)} wide/><Field label="Descrição do hero" value={site.hero_description} onChange={v=>changeSite('hero_description',v)} textarea wide/><Field label="Imagem principal — URL" value={site.hero_image_url} onChange={v=>changeSite('hero_image_url',v)} wide/><div className="wide"><Upload db={db} current={site.hero_image_url} onUploaded={v=>changeSite('hero_image_url',v)}/></div></div></section>
   <section className="admin-panel"><h2>Sobre mim</h2><div className="admin-grid"><Field label="Título da apresentação" value={site.about_title} onChange={v=>changeSite('about_title',v)} wide/><Field label="Minha história e formações" value={site.about_text} onChange={v=>changeSite('about_text',v)} textarea wide/><Field label="Imagem de apresentação — URL" value={site.about_image_url} onChange={v=>changeSite('about_image_url',v)} wide/><div className="wide"><Upload db={db} current={site.about_image_url} onUploaded={v=>changeSite('about_image_url',v)}/></div></div></section>
   <section className="admin-panel"><h2>Mentorias e contato</h2><div className="admin-grid"><Field label="Título da jornada" value={site.journey_title} onChange={v=>changeSite('journey_title',v)} wide/><Field label="Introdução às mentorias" value={site.journey_text} onChange={v=>changeSite('journey_text',v)} textarea wide/><Field label="WhatsApp com DDI e DDD (ex.: 5551999999999)" value={site.whatsapp} onChange={v=>changeSite('whatsapp',v)}/><Field label="Link do Instagram" value={site.instagram} onChange={v=>changeSite('instagram',v)}/><Field label="E-mail profissional" value={site.contact_email} onChange={v=>changeSite('contact_email',v)}/><Field label="Rodapé" value={site.footer_note} onChange={v=>changeSite('footer_note',v)}/></div></section>
   <section className="admin-panel"><h2>Busca e SEO</h2><div className="admin-grid"><Field label="Título exibido nas buscas" value={site.seo_title} onChange={v=>changeSite('seo_title',v)} wide/><Field label="Descrição SEO" value={site.seo_description} onChange={v=>changeSite('seo_description',v)} textarea wide/></div></section>
   <button className="admin-btn" disabled={busy} onClick={saveSite}><Save size={15}/> Salvar alterações</button></>}
  {(tab==='atendimento'||tab==='mentoria')&&<div className="admin-panel"><div className="admin-heading-row"><h2>{tab==='atendimento'?'Seus atendimentos':'Suas mentorias'}</h2><button className="admin-btn" onClick={()=>newItem('cf_services')}><Plus size={14}/> Adicionar</button></div><p className="admin-note">Desative “Publicado” para ocultar itens no site sem excluí-los.</p>
   {services.filter(s=>s.category===tab).map(s=><div className="admin-card" key={s.id}><div className="admin-card-head"><h3>{s.title||'Novo item'}</h3><button className="admin-btn danger" onClick={()=>removeItem('cf_services',s.id)}><Trash2 size={14}/> Excluir</button></div><div className="admin-grid"><Field label="Nome" value={s.title} onChange={v=>updateLocal(setServices,s.id,'title',v)}/><Field label="Etiqueta" value={s.label} onChange={v=>updateLocal(setServices,s.id,'label',v)}/><Field label="Descrição" value={s.description} onChange={v=>updateLocal(setServices,s.id,'description',v)} textarea wide/><Field label="Detalhes" value={s.details} onChange={v=>updateLocal(setServices,s.id,'details',v)} textarea wide/><Field label="Ordem" type="number" value={s.position} onChange={v=>updateLocal(setServices,s.id,'position',v)}/><label className="admin-check"><input type="checkbox" checked={!!s.is_published} onChange={e=>updateLocal(setServices,s.id,'is_published',e.target.checked)}/> Publicado</label></div><div className="admin-toolbar"><button className="admin-btn" disabled={busy||!s.title.trim()} onClick={()=>saveItem('cf_services',s)}><Save size={14}/> Salvar item</button></div></div>)}
   {!services.some(s=>s.category===tab)&&<p className="admin-empty">Nenhum item cadastrado.</p>}</div>}
  {tab==='testimonials'&&<div className="admin-panel"><div className="admin-heading-row"><h2>Depoimentos</h2><button className="admin-btn" onClick={()=>newItem('cf_testimonials')}><Plus size={14}/> Adicionar</button></div><p className="admin-note">Publique somente depoimentos reais, mediante autorização do autor.</p>
   {testimonials.map(t=><div className="admin-card" key={t.id}><div className="admin-grid"><Field label="Nome público" value={t.display_name} onChange={v=>updateLocal(setTestimonials,t.id,'display_name',v)}/><Field label="Posição" type="number" value={t.position} onChange={v=>updateLocal(setTestimonials,t.id,'position',v)}/><Field label="Depoimento" value={t.quote} onChange={v=>updateLocal(setTestimonials,t.id,'quote',v)} textarea wide/><label className="admin-check"><input type="checkbox" checked={!!t.permission_confirmed} onChange={e=>updateLocal(setTestimonials,t.id,'permission_confirmed',e.target.checked)}/> Tenho autorização de divulgação</label><label className="admin-check"><input type="checkbox" checked={!!t.is_published} onChange={e=>updateLocal(setTestimonials,t.id,'is_published',e.target.checked)}/> Publicado</label></div><div className="admin-toolbar"><button className="admin-btn" disabled={busy||!t.display_name.trim()||!t.quote.trim()} onClick={()=>saveItem('cf_testimonials',t)}><Save size={14}/> Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('cf_testimonials',t.id)}><Trash2 size={14}/> Excluir</button></div></div>)}</div>}
  {tab==='faqs'&&<div className="admin-panel"><div className="admin-heading-row"><h2>Perguntas e respostas</h2><button className="admin-btn" onClick={()=>newItem('cf_faqs')}><Plus size={14}/> Adicionar</button></div>{faqs.map(f=><div className="admin-card" key={f.id}><div className="admin-grid"><Field label="Pergunta" value={f.question} onChange={v=>updateLocal(setFaqs,f.id,'question',v)} wide/><Field label="Resposta" value={f.answer} onChange={v=>updateLocal(setFaqs,f.id,'answer',v)} textarea wide/><Field label="Ordem" type="number" value={f.position} onChange={v=>updateLocal(setFaqs,f.id,'position',v)}/><label className="admin-check"><input type="checkbox" checked={!!f.is_published} onChange={e=>updateLocal(setFaqs,f.id,'is_published',e.target.checked)}/> Publicado</label></div><div className="admin-toolbar"><button className="admin-btn" disabled={busy||!f.question.trim()||!f.answer.trim()} onClick={()=>saveItem('cf_faqs',f)}><Save size={14}/> Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('cf_faqs',f.id)}><Trash2 size={14}/> Excluir</button></div></div>)}</div>}
  {tab==='leads'&&<section className="admin-panel"><div className="admin-heading-row"><h2>Interessados <span className="admin-count">{leads.length}</span></h2><button onClick={loadData} disabled={loading} className="admin-btn secondary"><RefreshCw size={14}/> Atualizar</button></div><div className="admin-toolbar"><input className="admin-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar nome, WhatsApp ou interesse..."/></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Contato</th><th>Interesse</th><th>Recebido em</th><th>Situação</th><th>Conversar</th></tr></thead><tbody>{leads.filter(l=>[l.full_name,l.whatsapp,kindLabel[l.interest]].join(' ').toLowerCase().includes(query.toLowerCase())).map(l=><tr key={l.id}><td><strong>{l.full_name}</strong><small>{l.whatsapp}</small></td><td>{kindLabel[l.interest]}</td><td>{date(l.created_at)}</td><td><select value={l.status} aria-label={'Status de '+l.full_name} onChange={e=>updateLead(l.id,'status',e.target.value)}>{Object.entries(statuses).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></td><td><a target="_blank" rel="noreferrer" href={'https://wa.me/'+l.whatsapp.replace(/\D/g,'')}>WhatsApp ↗</a></td></tr>)}</tbody></table>{leads.length===0&&<p className="admin-empty">Nenhum interessado ainda.</p>}</div></section>}
 </main></div></div>;
}
