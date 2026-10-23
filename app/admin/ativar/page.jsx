'use client';
import {useEffect,useState,Suspense} from 'react';
import '../admin.css';
import {useRouter,useSearchParams} from 'next/navigation';
import Link from 'next/link';
function ActivationForm(){
 const router=useRouter(),params=useSearchParams(),token=params.get('token')||'';
 const validToken=/^[a-f0-9]{64}$/i.test(token);
 const [state,setState]=useState('loading'),[user,setUser]=useState(null),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{
  if(!validToken)return;
  let active=true;
  fetch('/api/admin/activate?token='+token,{cache:'no-store'})
   .then(async r=>{const d=await r.json();if(active){setState(d.valid?'ready':'invalid');setUser(d.user||null)}})
   .catch(()=>{if(active)setState('invalid')});
  return()=>{active=false};
 },[token,validToken]);
 async function submit(e){
  e.preventDefault();setError('');
  if(password!==confirm){setError('As senhas não coincidem.');return}
  if(password.length<14){setError('Escolha uma senha com pelo menos 14 caracteres.');return}
  setBusy(true);
  try{
   const r=await fetch('/api/admin/activate',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,password,confirmPassword:confirm})});
   const d=await r.json();
   if(!r.ok)throw Error(d.error||'Não foi possível ativar.');
   setPassword('');setConfirm('');router.replace('/admin');router.refresh();
  }catch(err){setError(err.message)}
  finally{setBusy(false)}
 }
 return <main className="admin-body"><div className="admin-login">
  <Link className="admin-back" href="/">← Voltar ao site</Link>
  <h1>Ativar acesso</h1>
  {validToken&&state==='loading'&&<p>Verificando convite...</p>}
  {(!validToken||state==='invalid')&&<p className="admin-alert admin-error">O convite expirou, já foi utilizado ou é inválido. Solicite um novo convite ao administrador.</p>}
  {state==='ready'&&<><p>Configure uma senha pessoal para <strong>{user?.email}</strong> — perfil {user?.role==='owner'?'Proprietária':'Suporte técnico'}.</p>
   <form onSubmit={submit}>
    <label className="admin-field">Criar senha (mínimo 14 caracteres)<input type="password" autoComplete="new-password" required minLength={14} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <label className="admin-field">Confirmar senha<input type="password" autoComplete="new-password" required minLength={14} maxLength={128} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>
    {error&&<p className="admin-alert admin-error" role="alert">{error}</p>}
    <button className="admin-btn" disabled={busy||!password||!confirm}>{busy?'Ativando...':'Ativar minha conta'}</button>
   </form>
   <p className="admin-note">Convite de uso único. Seu acesso não aparece no site público; as ações no painel ficam registradas por segurança.</p>
  </>}
 </div></main>;
}

export default function Activate(){return <Suspense fallback={<main className="admin-body"><div className="admin-login">Carregando...</div></main>}><ActivationForm/></Suspense>}
