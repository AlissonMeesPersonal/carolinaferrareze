import { NextResponse } from 'next/server';
import { authConfigured, originAllowed, ipDigest, validCredentials, createSession, sessionValid, revokeSession } from '@/lib/auth';
import { getDb, rateLimit } from '@/lib/db';
export const runtime='nodejs';
const json=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 try{return json({configured:authConfigured(),authenticated:await sessionValid()})}catch{return json({configured:false,authenticated:false})}
}
export async function POST(req){
 if(!originAllowed(req)) return json({error:'Origem inválida.'},403);
 if(!authConfigured())return json({error:'Painel ainda não configurado.'},503);
 try{
  const sql=getDb();
  const allowed=await rateLimit(sql,ipDigest(req,'admin_login'),8,15);
  if(!allowed)return json({error:'Muitas tentativas. Tente novamente mais tarde.'},429);
  const {email,password}=await req.json();
  if(!validCredentials(email,password))return json({error:'E-mail ou senha inválidos.'},401);
  const res=json({ok:true});
  await createSession(res);
  return res;
 }catch{return json({error:'Não foi possível autenticar.'},500)}
}
export async function DELETE(req){
 if(!originAllowed(req))return json({error:'Origem inválida.'},403);
 try{const res=json({ok:true});await revokeSession(res);return res}
 catch{return json({error:'Não foi possível encerrar a sessão.'},500)}
}
