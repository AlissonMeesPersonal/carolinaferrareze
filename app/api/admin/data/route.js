import { NextResponse } from 'next/server';
import { sessionValid, originAllowed } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime='nodejs';
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
const definitions={
 services:{table:'cf_services',fields:['category','title','description','details','image_url','label','is_published','position']},
 testimonials:{table:'cf_testimonials',fields:['display_name','quote','permission_confirmed','is_published','position']},
 faqs:{table:'cf_faqs',fields:['question','answer','is_published','position']}
};
const siteFields=['brand','subtitle','hero_eyebrow','hero_title','hero_description','hero_image_url','about_image_url','about_title','about_text','journey_title','journey_text','whatsapp','instagram','contact_email','seo_title','seo_description','footer_note','accompaniment_title','accompaniment_intro','accompaniment_goal','accompaniment_topics','accompaniment_format','accompaniment_packages'];
const statuses=['novo','em_contato','agendado','concluido','descartado'];
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const noAccess=()=>reply({error:'Não autorizado.'},401);
const notReady=()=>reply({error:'Neon ainda não configurado.'},503);
function convert(key,value){
 if(['is_published','permission_confirmed'].includes(key))return value===true;
 if(key==='position')return Math.min(100000,Math.max(0,Math.trunc(Number(value)||0)));
 return String(value??'').slice(0,key==='details'||key==='about_text'?8000:4000);
}
function validate(type,body){
 if(!body||typeof body!=='object')return false;
 if(type==='services')return ['atendimento','mentoria'].includes(body.category)&&typeof body.title==='string'&&body.title.trim().length>0;
 if(type==='testimonials')return typeof body.display_name==='string'&&body.display_name.trim()!==''&&typeof body.quote==='string'&&body.quote.trim()!=='';
 if(type==='faqs')return typeof body.question==='string'&&body.question.trim()!==''&&typeof body.answer==='string'&&body.answer.trim()!=='';
 return false;
}
export async function GET(){
 if(!await sessionValid())return noAccess();
 const sql=getDb();if(!sql)return notReady();
 try{
  const [site,services,testimonials,faqs,leads]=await Promise.all([
   sql`SELECT * FROM cf_site WHERE id='main' LIMIT 1`,
   sql`SELECT * FROM cf_services ORDER BY position`,
   sql`SELECT * FROM cf_testimonials ORDER BY position`,
   sql`SELECT * FROM cf_faqs ORDER BY position`,
   sql`SELECT * FROM cf_leads ORDER BY created_at DESC LIMIT 1000`
  ]);
  return reply({site:site[0]||null,services,testimonials,faqs,leads});
 }catch(e){console.error('Admin read',e?.code||'error');return reply({error:'Não foi possível carregar o painel.'},500)}
}
export async function POST(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 if(!await sessionValid())return noAccess();
 const sql=getDb();if(!sql)return notReady();
 try{
  const {type,item}=await req.json(),def=definitions[type];
  if(!def||!validate(type,item))return reply({error:'Dados inválidos.'},400);
  const keys=def.fields, values=keys.map(k=>convert(k,item[k]));
  const columns=keys.join(','), placeholders=keys.map((_,i)=>'$'+(i+1)).join(',');
  const rows=await sql.query('INSERT INTO '+def.table+' ('+columns+') VALUES('+placeholders+') RETURNING *',values);
  return reply({item:rows[0]},201);
 }catch(e){console.error('Admin insert',e?.code||'error');return reply({error:'Não foi possível salvar.'},500)}
}
export async function PUT(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 if(!await sessionValid())return noAccess();
 const sql=getDb();if(!sql)return notReady();
 try{
  const {type,item,id,status}=await req.json();
  if(type==='leads'){
   if(!uuid.test(id||'')||!statuses.includes(status))return reply({error:'Dados inválidos.'},400);
   const rows=await sql`UPDATE cf_leads SET status=${status} WHERE id=${id} RETURNING id,status`;
   return rows.length?reply({item:rows[0]}):reply({error:'Contato não encontrado.'},404);
  }
  if(type==='site'){
   if(!item||typeof item!=='object')return reply({error:'Dados inválidos.'},400);
   const values=siteFields.map(k=>convert(k,item[k]));
   const setters=siteFields.map((k,i)=>k+'=$'+(i+1)).join(',');
   const rows=await sql.query('UPDATE cf_site SET '+setters+',updated_at=now() WHERE id=\'main\' RETURNING *',values);
   return reply({item:rows[0]});
  }
  const def=definitions[type];
  if(!def||!uuid.test(id||'')||!validate(type,item))return reply({error:'Dados inválidos.'},400);
  const keys=def.fields,values=keys.map(k=>convert(k,item[k]));
  const setters=keys.map((k,i)=>k+'=$'+(i+1)).join(',');
  const rows=await sql.query('UPDATE '+def.table+' SET '+setters+' WHERE id=$'+(values.length+1)+' RETURNING *',[...values,id]);
  return rows.length?reply({item:rows[0]}):reply({error:'Registro não encontrado.'},404);
 }catch(e){console.error('Admin update',e?.code||'error');return reply({error:'Não foi possível atualizar.'},500)}
}
export async function DELETE(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 if(!await sessionValid())return noAccess();
 const sql=getDb();if(!sql)return notReady();
 try{
  const type=req.nextUrl.searchParams.get('type'),id=req.nextUrl.searchParams.get('id');
  const def=definitions[type];
  if(!def||!uuid.test(id||''))return reply({error:'Identificador inválido.'},400);
  await sql.query('DELETE FROM '+def.table+' WHERE id=$1',[id]);
  return reply({ok:true});
 }catch(e){console.error('Admin delete',e?.code||'error');return reply({error:'Não foi possível excluir.'},500)}
}
