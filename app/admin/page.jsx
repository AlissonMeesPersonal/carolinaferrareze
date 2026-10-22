'use client';
import './admin.css';
import { useState,useEffect,useCallback } from 'react';
import { fallbackSite } from '@/lib/config';
import MediaUploader from '@/components/admin/MediaUploader';
import { ArrowUpRight,Save,Plus,LogOut,RefreshCw,Trash2 } from 'lucide-react';

const sections=[['dashboard','Visão geral'],['site','Editor do site'],['atendimento','Atendimentos'],['mentoria','Mentorias'],['testimonials','Depoimentos'],['gallery','Fotos de depoimentos'],['faqs','Perguntas frequentes'],['leads','Contatos recebidos']];
const labels={novo:'Novo',em_contato:'Em contato',agendado:'Agendado',concluido:'Concluído',descartado:'Descartado'};
const kinds={atendimento:'Atendimento',mentoria:'Mentoria',informacoes:'Informações'};
const when=(s)=>s?new Date(s).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):'—';
async function api(path,method='GET',data){
 const r=await fetch(path,{method,credentials:'same-origin',cache:'no-store',headers:{...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});
 let result;try{result=await r.json()}catch{result={error:'Resposta inválida do servidor.'}}
 if(!r.ok)throw new Error(result.error||'Não foi possível completar a ação.');
 return result;
}
function Field({label,value,onChange,textarea=false,type='text',wide=false,placeholder=''}) {
 return <label className={'admin-field '+(wide?'wide':'')}>{label}
 {textarea?<textarea value={value??''} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>:<input type={type} value={value??''} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>}</label>;
}
export default function Admin(){
 const [role,setRole]=useState('loading'),[login,setLogin]=useState(''),[password,setPassword]=useState(''),[tab,setTab]=useState('dashboard');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[authError,setAuthError]=useState('');
 const [site,setSite]=useState(fallbackSite),[services,setServices]=useState([]),[testimonials,setTestimonials]=useState([]),[faqs,setFaqs]=useState([]),[gallery,setGallery]=useState([]),[leads,setLeads]=useState([]),[query,setQuery]=useState(''),[leadStatusFilter,setLeadStatusFilter]=useState('todos');
 const refresh=useCallback(async()=>{
  const data=await api('/api/admin/data');
  setSite(data.site||fallbackSite);setServices(data.services||[]);setTestimonials(data.testimonials||[]);setFaqs(data.faqs||[]);setGallery(data.gallery||[]);setLeads(data.leads||[]);
 },[]);
 useEffect(()=>{
  let active=true;
  api('/api/admin/session').then(async data=>{
   if(!active)return;
   setRole(data.configured?(data.authenticated?'admin':'guest'):'unconfigured');
   if(data.authenticated){try{await refresh()}catch(e){if(active)setMessage('Erro: '+e.message)}}
  }).catch(()=>{if(active)setRole('unconfigured')});
  return ()=>{active=false};
 },[refresh]);
 const run=async(fn)=>{
  setBusy(true);setMessage('');
  try{await fn();setMessage('Alterações salvas com sucesso.')}catch(e){setMessage('Erro: '+e.message)}
  finally{setBusy(false)}
 };
 async function signIn(e){
  e.preventDefault();setBusy(true);setAuthError('');
  try{await api('/api/admin/session','POST',{email:login,password});setPassword('');setRole('admin');await refresh()}
  catch(e){setAuthError(e.message)}
  finally{setBusy(false)}
 }
 async function signOut(){
  await api('/api/admin/session','DELETE');setRole('guest');setMessage('');setPassword('');
 }
 const changeSite=(name,value)=>setSite(s=>({...s,[name]:value}));
 const edit=(setter,id,key,value)=>setter(rows=>rows.map(x=>x.id===id?{...x,[key]:value}:x));
 async function saveSite(){
  await run(async()=>{await api('/api/admin/data','PUT',{type:'site',item:site});await refresh()});
 }
 function addItem(type){
  const id='draft_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2);
  if(type==='services')setServices(p=>[...p,{id,category:tab,title:'',description:'',details:'',image_url:'',label:'',is_published:false,position:p.filter(x=>x.category===tab).length+1}]);
  if(type==='testimonials')setTestimonials(p=>[...p,{id,display_name:'',quote:'',permission_confirmed:false,is_published:false,position:p.length+1}]);
  if(type==='faqs')setFaqs(p=>[...p,{id,question:'',answer:'',is_published:false,position:p.length+1}]);
  if(type==='gallery')setGallery(p=>[...p,{id,url:'',caption:'',alt_text:'',consent_confirmed:false,is_published:false,position:p.length+1}]);
 }
 async function saveItem(type,item){
  await run(async()=>{const fresh=item.id.startsWith('draft_');await api('/api/admin/data',fresh?'POST':'PUT',{type,item,id:item.id});await refresh()});
 }
 async function removeItem(type,item){
  if(!window.confirm('Deseja realmente excluir este item?'))return;
  if(item.id.startsWith('draft_')){
   if(type==='services')setServices(p=>p.filter(x=>x.id!==item.id));
   if(type==='testimonials')setTestimonials(p=>p.filter(x=>x.id!==item.id));
   if(type==='faqs')setFaqs(p=>p.filter(x=>x.id!==item.id));
   if(type==='gallery')setGallery(p=>p.filter(x=>x.id!==item.id));
   return;
  }
  await run(async()=>{await api('/api/admin/data?type='+type+'&id='+encodeURIComponent(item.id),'DELETE');await refresh()});
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
 function exportLeads(){
  const columns=['Data','Nome','WhatsApp','Interesse','Status','Observações'];
  const filtered=leads.filter(l=>{
   const text=[l.full_name,l.whatsapp,kinds[l.interest]].join(' ').toLowerCase();
   return text.includes(query.toLowerCase())&&(leadStatusFilter==='todos'||l.status===leadStatusFilter);
  });
  const escapeCSV=(value)=>'"'+String(value??'').replace(/^[=+@-]/,'\'').replace(/"/g,'""')+'"';
  const rows=[columns,...filtered.map(l=>[when(l.created_at),l.full_name,l.whatsapp,kinds[l.interest],labels[l.status],l.admin_notes||''])];
  const csv='\uFEFF'+rows.map(r=>r.map(escapeCSV).join(';')).join('\r\n');
  const objectUrl=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=objectUrl;link.download='carolina-contatos-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),1500);
 }
 if(role==='loading')return <main className="admin-body"><div className="admin-login">Carregando painel...</div></main>;
 if(role!=='admin')return <main className="admin-body"><div className="admin-login"><a className="admin-back" href="/">← Voltar ao site</a><h1>Espaço Carolina</h1><p>Painel exclusivo para editar a página e acompanhar interessados.</p>
 {role==='unconfigured'?<p className="admin-alert admin-error">Configure o banco Neon e as variáveis de acesso no servidor da Vercel para ativar este painel.</p>:<form onSubmit={signIn}>
 <Field label="E-mail administrativo" type="email" value={login} onChange={setLogin}/>
 <Field label="Senha" type="password" value={password} onChange={setPassword}/>
 <button className="admin-btn" type="submit" disabled={busy}>Entrar no painel</button>
 {authError&&<p role="alert" className="admin-alert admin-error">{authError}</p>}</form>}
 <p className="admin-note">O acesso é restrito à responsável. Não existe cadastro público.</p></div></main>;
 const editor=[
  ['Identidade visual',[['brand','Nome da marca'],['subtitle','Subtítulo da marca'],['hero_eyebrow','Texto acima do título'],['hero_title','Título principal (hero)'],['hero_description','Descrição do hero'],['hero_image_url','URL da foto principal']]],
  ['Sobre mim',[['about_title','Título de apresentação'],['about_text','Sua trajetória e formações'],['about_image_url','URL da sua foto']]],
  ['Fotos das seções',[['mentoring_image_url','Imagem da seção mentorias'],['editorial_image_url','Foto da seção editorial']]],
  ['Acompanhamento terapêutico',[['accompaniment_title','Título da seção'],['accompaniment_intro','Apresentação do acompanhamento'],['accompaniment_goal','Objetivo e benefícios propostos'],['accompaniment_topics','Temas: um por linha, no formato Nome|Descrição'],['accompaniment_format','Formato: uma informação por linha'],['accompaniment_packages','Pacotes: um por linha, sem preços']]],
  ['Mentorias e contato',[['journey_title','Título da jornada'],['journey_text','Texto introdutório'],['whatsapp','Número WhatsApp com 55 e DDD'],['instagram','Link do Instagram'],['contact_email','E-mail'],['footer_note','Texto do rodapé']]],
  ['SEO',[['seo_title','Título das buscas'],['seo_description','Descrição das buscas']]]
 ];
 const type=(tab==='atendimento'||tab==='mentoria')?'services':tab;
 const local={services,setServices,testimonials,setTestimonials,faqs,setFaqs,gallery,setGallery};
 const changeLocal=(id,key,value)=>edit(local['set'+type[0].toUpperCase()+type.slice(1)],id,key,value);
 return <div className="admin-body">
 <header className="admin-header"><div><strong>Carolina Ferrareze</strong><small>PAINEL ADMINISTRATIVO · NEON</small></div><div className="admin-header-right"><a href="/" target="_blank" rel="noreferrer">Ver site <ArrowUpRight size={14}/></a><button className="admin-btn secondary" onClick={signOut}><LogOut size={14}/> Sair</button></div></header>
 <div className="admin-layout">
 <nav className="admin-sidebar" aria-label="Navegação administrativa">{sections.map(([id,label])=><button className={tab===id?'active':''} key={id} onClick={()=>{setTab(id);setMessage('')}}>{label}</button>)}</nav>
 <main className="admin-main">
 <div className="admin-title"><h1>{sections.find(x=>x[0]===tab)?.[1]}</h1><p>Alterações são salvas no Neon e aparecem no site automaticamente.</p></div>
 {message&&<p role="status" className={'admin-alert '+(message.startsWith('Erro')?'admin-error':'')}>{message}</p>}
 {tab==='dashboard'&&<>
 <div className="admin-stats"><div className="admin-stat"><span>Contatos recebidos</span><strong>{leads.length}</strong></div><div className="admin-stat"><span>Novos contatos</span><strong>{leads.filter(x=>x.status==='novo').length}</strong></div><div className="admin-stat"><span>Agendamentos</span><strong>{leads.filter(x=>x.status==='agendado').length}</strong></div></div>
 <div className="admin-panel"><h2>Últimos contatos</h2>{leads.length?leads.slice(0,5).map(l=><p className="admin-mini" key={l.id}><strong>{l.full_name}</strong> · {kinds[l.interest]} · {when(l.created_at)}</p>):<p className="admin-empty">Nenhum contato recebido até agora.</p>}
 <button className="admin-btn secondary" onClick={()=>setTab('leads')}>Ver interessados</button></div></>}
 {tab==='site'&&<>{editor.map(([heading,fields])=><section className="admin-panel" key={heading}><h2>{heading}</h2><div className="admin-grid">{fields.map(([key,label])=>{
  const wide=['hero_title','hero_description','about_text','journey_text','seo_description','hero_image_url','about_image_url','mentoring_image_url','editorial_image_url','accompaniment_intro','accompaniment_goal','accompaniment_topics','accompaniment_format','accompaniment_packages'].includes(key);
  const textarea=['hero_description','about_text','journey_text','seo_description','accompaniment_intro','accompaniment_goal','accompaniment_topics','accompaniment_format','accompaniment_packages'].includes(key);
  return <div className={wide?'wide':''} key={key}>
   <Field label={label} value={site[key]} onChange={value=>changeSite(key,value)} textarea={textarea}/>
   {key.endsWith('_image_url')&&<MediaUploader label={label} url={site[key]} onUploaded={url=>changeSite(key,url)}/>}
  </div>;
 })}</div></section>)}
 <p className="admin-note">Escolha as fotos acima pelo computador ou celular e clique em Salvar site para publicá-las. A imagem original será guardada no Neon Storage, sem novo deploy.</p>
 <button className="admin-btn" disabled={busy} onClick={saveSite}><Save size={15}/> Salvar site</button></>}
 {(tab==='atendimento'||tab==='mentoria')&&<section className="admin-panel"><div className="admin-heading-row"><h2>{tab==='atendimento'?'Atendimentos':'Mentorias'}</h2><button className="admin-btn" onClick={()=>addItem('services')}><Plus size={15}/> Adicionar</button></div>
 {services.filter(x=>x.category===tab).map(item=><div key={item.id} className="admin-card"><div className="admin-card-head"><h3>{item.title||'Novo serviço'}</h3><button className="admin-btn danger" onClick={()=>removeItem('services',item)}><Trash2 size={14}/> Excluir</button></div>
 <div className="admin-grid"><Field label="Nome" value={item.title} onChange={v=>changeLocal(item.id,'title',v)}/><Field label="Etiqueta" value={item.label} onChange={v=>changeLocal(item.id,'label',v)}/><Field label="Descrição" wide textarea value={item.description} onChange={v=>changeLocal(item.id,'description',v)}/><Field label="Detalhes" wide textarea value={item.details} onChange={v=>changeLocal(item.id,'details',v)}/><Field label="URL da imagem" value={item.image_url} onChange={v=>changeLocal(item.id,'image_url',v)} wide/>
 <div className="wide"><MediaUploader url={item.image_url} label={'Imagem de '+item.title} onUploaded={v=>changeLocal(item.id,'image_url',v)}/></div>
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
 <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.quote.trim()||!item.display_name.trim()} onClick={()=>saveItem('testimonials',item)}>Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('testimonials',item)}>Excluir</button></div></div>)}</section>}
 {tab==='gallery'&&<section className="admin-panel">
  <div className="admin-heading-row"><h2>Imagens dos depoimentos</h2><button className="admin-btn" onClick={()=>addItem('gallery')}><Plus size={14}/> Adicionar imagem</button></div>
  <p className="admin-note">Envie os prints ou imagens, ocultando nomes, números e qualquer dado pessoal. Cada imagem só será publicada se houver autorização de divulgação confirmada. Os cinco cartões de demonstração serão substituídos pelas imagens autorizadas publicadas aqui.</p>
  {gallery.map(item=><div className="admin-card" key={item.id}>
   <div className="admin-card-head"><h3>{item.caption||'Novo depoimento visual'}</h3><button className="admin-btn danger" onClick={()=>removeItem('gallery',item)}><Trash2 size={14}/> Excluir</button></div>
   <div className="admin-grid">
    <div className="wide"><Field label="URL da imagem" value={item.url} onChange={v=>changeLocal(item.id,'url',v)}/><MediaUploader url={item.url} label="Print do depoimento" onUploaded={v=>changeLocal(item.id,'url',v)}/></div>
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
 <div className="admin-toolbar"><button className="admin-btn" disabled={busy||!item.question.trim()||!item.answer.trim()} onClick={()=>saveItem('faqs',item)}>Salvar</button><button className="admin-btn danger" onClick={()=>removeItem('faqs',item)}>Excluir</button></div></div>)}</section>}
 {tab==='leads'&&<section className="admin-panel"><div className="admin-heading-row"><h2>Contatos recebidos <span className="admin-count">{leads.length}</span></h2><button className="admin-btn secondary" onClick={()=>run(refresh)}><RefreshCw size={14}/> Atualizar</button></div>
 <div className="admin-toolbar">
  <input className="admin-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar nome, telefone ou serviço"/>
  <select className="admin-search" value={leadStatusFilter} onChange={e=>setLeadStatusFilter(e.target.value)} aria-label="Filtrar por status">
   <option value="todos">Todos os status</option>{Object.entries(labels).map(([k,v])=><option value={k} key={k}>{v}</option>)}
  </select>
  <button className="admin-btn secondary" onClick={exportLeads}>Exportar CSV</button>
 </div>
 <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Contato</th><th>Interesse</th><th>Data</th><th>Situação</th><th>WhatsApp</th><th>Anotações privadas</th></tr></thead><tbody>{leads.filter(l=>(l.full_name+' '+l.whatsapp+' '+kinds[l.interest]).toLowerCase().includes(query.toLowerCase())&&(leadStatusFilter==='todos'||l.status===leadStatusFilter)).map(l=><tr key={l.id}>
 <td><strong>{l.full_name}</strong><small>{l.whatsapp}</small></td><td>{kinds[l.interest]}</td><td>{when(l.created_at)}</td>
 <td><select value={l.status} aria-label={'Status de '+l.full_name} onChange={e=>updateLead(l.id,e.target.value)}>{Object.entries(labels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></td>
 <td><a href={'https://wa.me/'+l.whatsapp.replace(/\D/g,'')} target="_blank" rel="noopener noreferrer">Abrir ↗</a></td>
 <td><div className="lead-note-editor"><textarea aria-label={'Observação de '+l.full_name} value={l.admin_notes||''} maxLength={2500} onChange={e=>setLeads(rows=>rows.map(x=>x.id===l.id?{...x,admin_notes:e.target.value}:x))} placeholder="Histórico do contato, retorno combinado..."/><button className="admin-btn secondary" onClick={()=>saveLeadNote(l.id,l.admin_notes||'')}>Salvar</button></div></td></tr>)}</tbody></table>{leads.length===0&&<p className="admin-empty">Nenhum interessado ainda.</p>}</div></section>}
 </main></div></div>;
}
