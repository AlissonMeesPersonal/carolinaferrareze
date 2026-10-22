import {NextResponse} from 'next/server';
import {getDb,rateLimit} from '@/lib/db';
import {sessionInfo,originAllowed,sha256,ipDigest,auditAction} from '@/lib/auth';
import {randomBytes} from 'node:crypto';
export const runtime='nodejs';
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(){
 const user=await sessionInfo();if(!user)return reply({error:'Não autorizado.'},401);
 const sql=getDb();
 const [users,audit]=await Promise.all([
  sql`SELECT id,email,role,active,created_at,last_login_at,CASE WHEN password_hash IS NULL THEN false ELSE true END AS activated FROM cf_admin_users ORDER BY created_at`,
  sql`SELECT a.action,a.subject,a.created_at,u.email FROM cf_admin_audit a LEFT JOIN cf_admin_users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 40`
 ]);
 return reply({users,audit,viewer:{email:user.email,role:user.role}});
}
export async function POST(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 const user=await sessionInfo();if(!user)return reply({error:'Não autorizado.'},401);
 const sql=getDb();
 if(!await rateLimit(sql,ipDigest(req,'admin_invite'),10,60))return reply({error:'Limite de convites atingido.'},429);
 const body=await req.json();
 const email=String(body.email||'').trim().toLowerCase(),role=body.role;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!['owner','support'].includes(role))
  return reply({error:'Informe e-mail e perfil válidos.'},400);
 // Suporte só pode cadastrar a primeira proprietária. Novos acessos requerem a proprietária.
 if(user.role!=='owner'){
  const owners=await sql`SELECT 1 FROM cf_admin_users WHERE role='owner' AND active=true LIMIT 1`;
  if(role!=='owner'||owners.length)return reply({error:'Somente a proprietária pode conceder novos acessos.'},403);
 }
 let account=(await sql`SELECT id,email,password_hash,active FROM cf_admin_users WHERE email=${email} LIMIT 1`)[0];
 if(account && account.password_hash)return reply({error:'Essa conta já está ativa. Não é possível gerar convite de redefinição por aqui.'},409);
 if(account && !account.active)return reply({error:'O acesso dessa conta está desativado.'},409);
 if(!account){
  const inserted=await sql`INSERT INTO cf_admin_users(email,role,active) VALUES(${email},${role},true) RETURNING id,email`;
  account=inserted[0];
 }
 const raw=randomBytes(32).toString('hex');
 await sql`INSERT INTO cf_admin_invites(token_hash,user_id,created_by,expires_at)
  VALUES(${sha256(raw)},${account.id},${user.id},now()+interval '48 hours')`;
 await auditAction(user,'admin.invite',email);
 return reply({inviteUrl:req.nextUrl.origin+'/admin/ativar?token='+raw,email,expiresHours:48},201);
}
export async function PATCH(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 const user=await sessionInfo();if(!user)return reply({error:'Não autorizado.'},401);
 if(user.role!=='owner')return reply({error:'Somente a proprietária pode gerenciar acessos.'},403);
 const {id,active}=await req.json();
 if(!uuid.test(id||'')||typeof active!=='boolean'||id===user.id)return reply({error:'Alteração inválida.'},400);
 const sql=getDb();
 const [account]=await sql`UPDATE cf_admin_users SET active=${active} WHERE id=${id} AND role='support' RETURNING email,id`;
 if(!account)return reply({error:'Somente acessos de suporte podem ser alterados por esta ação.'},404);
 if(!active)await sql`DELETE FROM cf_admin_sessions WHERE account_id=${id}`;
 await auditAction(user,active?'admin.support_enabled':'admin.support_disabled',account.email);
 return reply({ok:true});
}
