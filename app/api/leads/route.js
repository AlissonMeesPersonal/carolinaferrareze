import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const runtime='nodejs';
const recent=new Map();
const json=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request){
 try{
  const allowed=process.env.SITE_URL;
  const origin=request.headers.get('origin');
  if(allowed&&origin&&new URL(allowed).origin!==new URL(origin).origin) return json({error:'Origem inválida.'},403);
  const ip=(request.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
  const key=ip.slice(0,120),now=Date.now();
  if(recent.size>2500) recent.clear();
  if(now-(recent.get(key)||0)<20000) return json({error:'Aguarde alguns segundos para enviar novamente.'},429);
  const body=await request.json();
  if(body.website) return json({ok:true});
  const name=String(body.full_name||'').trim().replace(/\s+/g,' ').slice(0,120);
  const phone=String(body.whatsapp||'').replace(/[^\d+()\s-]/g,'').trim();
  const interest=String(body.interest||'');
  if(name.length<2||name.length>120||phone.replace(/\D/g,'').length<10||phone.length>22||!['atendimento','mentoria','informacoes'].includes(interest)||body.consent!==true)
   return json({error:'Confira os dados preenchidos e o consentimento.'},400);
  if(typeof body.started!=='number'||now-body.started<1200||now-body.started>86400000) return json({error:'Envio inválido. Atualize a página e tente novamente.'},400);
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!secret) return json({error:'Formulário temporariamente indisponível. Tente novamente mais tarde.'},503);
  if(process.env.TURNSTILE_SECRET_KEY){
   if(!body.turnstileToken) return json({error:'Confirme a verificação de segurança.'},400);
   const params=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:body.turnstileToken});
   const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:params,cache:'no-store'});
   const verdict=await check.json();
   if(!verdict.success) return json({error:'Verificação de segurança não concluída.'},403);
  }
  const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const {error}=await db.from('cf_leads').insert({full_name:name,whatsapp:phone,interest,consent:true,source:'landing'});
  if(error) {console.error('lead insert error',error.code);return json({error:'Não foi possível registrar. Tente mais tarde.'},500)}
  recent.set(key,now);
  return json({ok:true},201);
 }catch{return json({error:'Não foi possível enviar. Verifique os dados.'},400)}
}
