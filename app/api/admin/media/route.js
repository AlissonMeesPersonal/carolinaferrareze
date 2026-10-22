import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {PutObjectCommand,S3Client} from '@aws-sdk/client-s3';
import {sessionValid,originAllowed,sessionInfo,auditAction} from '@/lib/auth';

export const runtime='nodejs';
const MAX_BYTES=8*1024*1024;
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
function format(bytes){
 const b=Buffer.from(bytes);
 if(b.length>=3 && b[0]===0xff && b[1]===0xd8 && b[2]===0xff)return {ext:'jpg',mime:'image/jpeg'};
 if(b.length>=8 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {ext:'png',mime:'image/png'};
 if(b.length>=12 && b.toString('ascii',0,4)==='RIFF' && b.toString('ascii',8,12)==='WEBP')return {ext:'webp',mime:'image/webp'};
 if(b.length>=12 && b.toString('ascii',4,8)==='ftyp' && ['avif','avis'].includes(b.toString('ascii',8,12)))return {ext:'avif',mime:'image/avif'};
 return null;
}
export async function POST(req){
 if(!originAllowed(req))return reply({error:'Origem inválida.'},403);
 if(!await sessionValid())return reply({error:'Sessão expirada. Entre novamente no painel.'},401);
 const endpoint=process.env.AWS_ENDPOINT_URL_S3;
 const region=process.env.AWS_REGION;
 const bucket=process.env.NEON_MEDIA_BUCKET;
 if(!endpoint || !region || !bucket || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY){
  return reply({error:'Armazenamento de imagens ainda não configurado.'},503);
 }
 try{
  const form=await req.formData();
  const file=form.get('file');
  if(!file || typeof file.arrayBuffer!=='function' || typeof file.size!=='number')return reply({error:'Selecione uma imagem.'},400);
  if(file.size<=0 || file.size>MAX_BYTES)return reply({error:'A imagem deve ter no máximo 8 MB.'},413);
  const buffer=Buffer.from(await file.arrayBuffer());
  const type=format(buffer);
  if(!type)return reply({error:'Formato inválido. Use JPEG, PNG, WebP ou AVIF.'},415);
  const folder=new Date().toISOString().slice(0,7);
  const key='carolina/site/'+folder+'/'+randomUUID()+'.'+type.ext;
  const s3=new S3Client({
    region,
    endpoint,
    forcePathStyle:true,
    credentials:{accessKeyId:process.env.AWS_ACCESS_KEY_ID,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY},
  });
  await s3.send(new PutObjectCommand({
    Bucket:bucket,
    Key:key,
    Body:buffer,
    ContentType:type.mime,
    CacheControl:'public, max-age=31536000, immutable'
  }));
  const base=endpoint.replace(/\/$/,'');
  const url=base+'/'+encodeURIComponent(bucket)+'/'+key.split('/').map(encodeURIComponent).join('/');
  await auditAction(await sessionInfo(),'media.uploaded',type.mime);
  return reply({url,bytes:buffer.length,mime:type.mime},201);
 }catch(e){
  console.error('Media upload',e?.name||e?.code||'storage_error');
  return reply({error:'Falha ao enviar a imagem. Verifique a conexão com o armazenamento.'},500);
 }
}
