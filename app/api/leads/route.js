import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getDb, rateLimit } from '@/lib/db';
export const runtime='nodejs';
const json=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request){
 try {
  const origin=request.headers.get('origin');
  if(!origin || new URL(origin).host!==request.headers.get('host')) return json({error:'Origem inválida.'},403);
  const data=await request.json();
  if(data.website)return json({ok:true});
  const name=String(data.full_name||'').trim().replace(/\s+/g,' ');
  const phone=String(data.whatsapp||'').replace(/[^\d+()\s-]/g,'').trim();
  const interest=String(data.interest||'');
  const now=Date.now();
  if(name.length<2||name.length>120||phone.replace(/\D/g,'').length<10||phone.length>22
  || !['atendimento','mentoria','informacoes'].includes(interest)||data.consent!==true
  ||typeof data.started!=='number'||now-data.started<1000||now-data.started>86400000)
   return json({error:'Revise os dados e tente novamente.'},400);
  const sql=getDb();
  if(!sql)return json({error:'Formulário indisponível no momento.'},503);
  const ip=(request.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
  const bucket='lead:'+createHash('sha256').update(ip+':'+(process.env.ADMIN_EMAIL||'cf')).digest('hex');
  if(!await rateLimit(sql,bucket,5,15))return json({error:'Limite de mensagens atingido. Tente novamente mais tarde.'},429);
  await sql`INSERT INTO cf_leads(full_name,whatsapp,interest,consent) VALUES(${name},${phone},${interest},true)`;
  return json({ok:true},201);
 }catch(err){console.error('Lead route failed',err?.code||'unknown');return json({error:'Erro ao registrar contato. Tente novamente.'},500)}
}
