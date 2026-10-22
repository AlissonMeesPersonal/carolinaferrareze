import {NextResponse} from 'next/server';
import {getDb,rateLimit} from '@/lib/db';
import {originAllowed,ipDigest,sha256,hashPassword,createSession,auditAction} from '@/lib/auth';
export const runtime='nodejs';
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req){
 const token=req.nextUrl.searchParams.get('token');
 if(!token||!(/^[a-f0-9]{64}$/i.test(token)))return reply({valid:false},400);
 try{
  const sql=getDb();if(!sql)return reply({valid:false},503);
  const found=await sql`
   SELECT u.email,u.role
   FROM cf_admin_invites i JOIN cf_admin_users u ON u.id=i.user_id
   WHERE i.token_hash=${sha256(token)} AND i.used_at IS NULL
   AND i.expires_at>now() AND u.active=true AND u.password_hash IS NULL
   LIMIT 1`;
  return reply({valid:Boolean(found.length),user:found[0]||null});
 }catch{return reply({valid:false},500)}
}
export async function POST(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 try{
  const sql=getDb();if(!sql)return reply({error:'Banco indisponível.'},503);
  if(!await rateLimit(sql,ipDigest(req,'invite_activation'),8,30))return reply({error:'Muitas tentativas. Tente mais tarde.'},429);
  const {token,password,confirmPassword}=await req.json();
  if(typeof token!=='string'||!(/^[a-f0-9]{64}$/i.test(token))||password!==confirmPassword)
   return reply({error:'Convite ou confirmação inválidos.'},400);
  if(typeof password!=='string'||password.length<14||password.length>128)
   return reply({error:'Escolha uma senha de 14 a 128 caracteres.'},400);
  const passwordHash=hashPassword(password);
  const [invite]=await sql`
   UPDATE cf_admin_invites SET used_at=now()
   WHERE token_hash=${sha256(token)} AND used_at IS NULL AND expires_at>now()
   RETURNING user_id`;
  if(!invite)return reply({error:'Convite expirado ou já utilizado.'},410);
  const [user]=await sql`
   UPDATE cf_admin_users SET password_hash=${passwordHash}
   WHERE id=${invite.user_id} AND password_hash IS NULL AND active=true
   RETURNING id,email,role`;
  if(!user)return reply({error:'A conta já foi ativada.'},409);
  const response=reply({ok:true,user:{email:user.email,role:user.role}});
  await createSession(response,user.id);
  await auditAction(user,'auth.activated','');
  return response;
 }catch(err){console.error('Admin activation failed',err?.code||'unknown');return reply({error:'Não foi possível ativar o convite.'},500)}
}
