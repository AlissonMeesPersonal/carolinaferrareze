import 'server-only';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';

const seconds=60*60*24*7;
const tokenKey=()=>process.env.NODE_ENV==='production'?'__Host-cf_admin_session':'cf_admin_session';
const hash=(s)=>createHash('sha256').update(s).digest('hex');
export function authConfigured(){
 return !!(process.env.DATABASE_URL && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH);
}
export function originAllowed(req) {
 const origin=req.headers.get('origin');
 if(!origin)return false;
 try {return new URL(origin).host === req.headers.get('host') && new URL(origin).protocol === new URL(req.url).protocol;}
 catch{return false;}
}
export function ipDigest(req,type){
 const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim() || 'unknown';
 return type+':'+hash(ip+':'+(process.env.ADMIN_EMAIL||'carolina'));
}
export function validCredentials(email,password){
 const expected=(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
 const parts=(process.env.ADMIN_PASSWORD_HASH||'').split(':');
 if(!expected || parts.length!==2 || !password || typeof password!=='string' || password.length>200) return false;
 try{
  const salt=Buffer.from(parts[0],'hex'),actual=Buffer.from(parts[1],'hex');
  if(salt.length<16 || actual.length!==64) return false;
  const candidate=scryptSync(password,salt,64);
  const pass=timingSafeEqual(actual,candidate);
  return pass && typeof email==='string' && email.trim().toLowerCase()===expected;
 }catch{return false}
}
export async function createSession(response){
 const token=randomBytes(32).toString('base64url');
 const sql=getDb();
 await sql`INSERT INTO cf_admin_sessions(token_hash,expires_at) VALUES(${hash(token)},now()+interval '7 days')`;
 response.cookies.set(tokenKey(),token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:seconds});
}
export async function sessionValid(){
 if(!authConfigured())return false;
 const sql=getDb();
 const jar=await cookies();
 const token=jar.get(tokenKey())?.value;
 if(!token)return false;
 const rows=await sql`SELECT 1 FROM cf_admin_sessions WHERE token_hash=${hash(token)} AND expires_at>now() LIMIT 1`;
 return rows.length>0;
}
export async function revokeSession(response){
 const jar=await cookies(),token=jar.get(tokenKey())?.value;
 if(token && getDb()){
  const sql=getDb();
  await sql`DELETE FROM cf_admin_sessions WHERE token_hash=${hash(token)}`;
 }
 response.cookies.delete(tokenKey());
}
