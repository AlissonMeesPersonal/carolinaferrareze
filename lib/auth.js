import 'server-only';
import {createHash,randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {getDb} from '@/lib/db';

const duration=60*60*24*7;
const cookieName=()=>process.env.NODE_ENV==='production'?'__Host-cf_admin_session':'cf_admin_session';
export const sha256=value=>createHash('sha256').update(value).digest('hex');
export const authConfigured=()=>Boolean(process.env.DATABASE_URL);
export function originAllowed(req){
 const origin=req.headers.get('origin');
 if(!origin)return false;
 try{const o=new URL(origin),u=new URL(req.url);return o.host===u.host&&o.protocol===u.protocol;}catch{return false}
}
export function ipDigest(req,type){
 const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
 return type+':'+sha256(ip+':carolina');
}
export function hashPassword(password){
 if(typeof password!=='string'||password.length<14||password.length>128)throw new Error('INVALID_PASSWORD');
 const salt=randomBytes(32);
 return salt.toString('hex')+':'+scryptSync(password,salt,64).toString('hex');
}
export function passwordMatches(password,stored){
 if(typeof password!=='string'||!stored||password.length>128)return false;
 const parts=stored.split(':');
 if(parts.length!==2)return false;
 try{
  const salt=Buffer.from(parts[0],'hex'),value=Buffer.from(parts[1],'hex');
  if(salt.length!==32||value.length!==64)return false;
  const expected=scryptSync(password,salt,64);
  return timingSafeEqual(expected,value);
 }catch{return false}
}
export async function sessionInfo(){
 const sql=getDb();if(!sql)return null;
 const token=(await cookies()).get(cookieName())?.value;
 if(!token||token.length>256)return null;
 const rows=await sql`
 SELECT u.id,u.email,u.role,u.active
 FROM cf_admin_sessions s JOIN cf_admin_users u ON u.id=s.account_id
 WHERE s.token_hash=${sha256(token)} AND s.expires_at>now() AND u.active=true
 LIMIT 1`;
 return rows[0]||null;
}
export async function sessionValid(){
 try{return Boolean(await sessionInfo())}catch{return false}
}
export async function createSession(response,userId){
 const sql=getDb();if(!sql)throw new Error('DATABASE_NOT_CONFIGURED');
 const token=randomBytes(32).toString('base64url');
 await sql`INSERT INTO cf_admin_sessions(token_hash,account_id,expires_at) VALUES(${sha256(token)},${userId},now()+interval '7 days')`;
 response.cookies.set(cookieName(),token,{
  httpOnly:true,secure:process.env.NODE_ENV==='production',
  sameSite:'strict',path:'/',maxAge:duration
 });
}
export async function revokeSession(response){
 const value=(await cookies()).get(cookieName())?.value;
 const sql=getDb();
 if(sql&&value)await sql`DELETE FROM cf_admin_sessions WHERE token_hash=${sha256(value)}`;
 response.cookies.delete(cookieName());
}
export async function auditAction(user,action,subject=''){
 const sql=getDb();
 if(!sql||!user?.id)return;
 try{await sql`INSERT INTO cf_admin_audit(user_id,action,subject) VALUES(${user.id},${String(action).slice(0,100)},${String(subject).slice(0,180)})`;}
 catch(err){console.error('Admin audit failed',err?.code||'unknown')}
}
