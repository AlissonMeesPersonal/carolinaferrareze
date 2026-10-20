'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
export default function LeadForm({kind='informacoes',compact=false}){
 const [full_name,setName]=useState(''),[whatsapp,setWhatsapp]=useState(''),[interest,setInterest]=useState(kind);
 const [consent,setConsent]=useState(false),[website,setWebsite]=useState('');
 const [status,setStatus]=useState(''),[loading,setLoading]=useState(false);
 const [started]=useState(()=>Date.now());
 async function submit(e){
  e.preventDefault();setStatus('');setLoading(true);
  try{
   const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full_name,whatsapp,interest,consent,website,started})});
   const data=await res.json();
   if(!res.ok) throw new Error(data.error||'Não foi possível enviar.');
   setStatus('success');setName('');setWhatsapp('');setConsent(false);
  }catch(error){setStatus(error.message||'Não foi possível enviar. Tente novamente.')}
  finally{setLoading(false)}
 }
 if(status==='success') return <div className="success-note"><CheckCircle2 size={26}/><strong>Recebemos seu contato!</strong><p>Obrigada pelo interesse. Você será contatado pelo canal informado.</p><button className="text-button" onClick={()=>setStatus('')}>Enviar outro contato</button></div>;
 return <form className="lead-form" onSubmit={submit}>
   <label>Como podemos chamar você?<input autoComplete="name" required maxLength={120} minLength={2} value={full_name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo"/></label>
   <label>Seu WhatsApp<input type="tel" autoComplete="tel" required minLength={8} maxLength={22} value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="(00) 00000-0000"/></label>
   <label>Qual seu interesse?<select value={interest} onChange={e=>setInterest(e.target.value)} required><option value="atendimento">Atendimento individual</option><option value="mentoria">Mentorias</option><option value="informacoes">Quero conhecer as opções</option></select></label>
   <div className="honey" aria-hidden="true"><label>Site<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
   <label className="check"><input type="checkbox" checked={consent} required onChange={e=>setConsent(e.target.checked)}/><span>Autorizo o uso dos meus dados para responder a este contato. Li a <a href="/privacy" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span></label>
   <button className="btn btn-dark form-submit" disabled={loading||!consent} type="submit">{loading?<Loader2 className="spin" size={18}/>:<>Enviar minha mensagem <ArrowRight size={18}/></>}</button>
   {status&&<p role="alert" className="form-error">{status}</p>}
   {!compact&&<p className="form-muted">Seus dados serão usados apenas para o contato solicitado.</p>}
 </form>
}
