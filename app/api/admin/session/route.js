import {NextResponse} from 'next/server';
import {authConfigured,originAllowed,ipDigest,passwordMatches,createSession,sessionInfo,revokeSession,auditAction} from '@/lib/auth';
import {getDb,rateLimit} from '@/lib/db';
export const runtime='nodejs';
const reply=(obj,status=200)=>NextResponse.json(obj,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 try{
  const user=await sessionInfo();
  return reply({configured:authConfigured(),authenticated:Boolean(user),user:user?{email:user.email,role:user.role}:null});
 }catch{return reply({configured:authConfigured(),authenticated:false})}
}
export async function POST(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 if(!authConfigured())return reply({error:'Banco ainda não configurado.'},503);
 try{
  const sql=getDb();
  if(!await rateLimit(sql,ipDigest(req,'admin_login'),8,15))return reply({error:'Muitas tentativas. Tente novamente mais tarde.'},429);
  const body=await req.json(),email=String(body?.email||'').trim().toLowerCase(),password=body?.password;
  if(email.length>254||typeof password!=='string'||password.length>128)return reply({error:'Credenciais inválidas.'},401);
  const users=await sql`SELECT id,email,role,password_hash,active FROM cf_admin_users WHERE email=${email} LIMIT 1`;
  const account=users[0];
  if(!account||account.active!==true||!passwordMatches(password,account.password_hash))return reply({error:'E-mail ou senha inválidos.'},401);
  const response=reply({ok:true,user:{email:account.email,role:account.role}});
  await createSession(response,account.id);
  await sql`UPDATE cf_admin_users SET last_login_at=now() WHERE id=${account.id}`;
  await auditAction(account,'auth.login','');
  return response;
 }catch(err){console.error('Admin authentication failed',err?.code||'unknown');return reply({error:'Não foi possível autenticar.'},500)}
}
export async function DELETE(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 try{const response=reply({ok:true});await revokeSession(response);return response}
 catch{return reply({error:'Não foi possível encerrar a sessão.'},500)}
}
