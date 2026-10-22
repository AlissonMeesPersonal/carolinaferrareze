'use client';
import {useState} from 'react';
import {ImagePlus,Loader2,CheckCircle2} from 'lucide-react';

/** Selects a real local image; uploads through the authenticated server; returns a permanent Neon Storage URL. */
export default function MediaUploader({url='',onUploaded,label='Fotografia'}){
 const [uploading,setUploading]=useState(false);
 const [error,setError]=useState('');
 const [completed,setCompleted]=useState(false);
 async function handleChange(event){
  const file=event.target.files?.[0];
  if(!file)return;
  setError('');setCompleted(false);
  if(file.size>8*1024*1024){setError('A foto deve ter no máximo 8 MB.');return;}
  setUploading(true);
  try{
   const body=new FormData();body.append('file',file);
   const response=await fetch('/api/admin/media',{method:'POST',body,credentials:'same-origin'});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'Falha ao enviar a foto.');
   onUploaded(result.url);setCompleted(true);
  }catch(e){setError(e.message||'Não foi possível enviar a foto.')}
  finally{setUploading(false);event.target.value='';}
 }
 return <div className="media-uploader">
  <div className="media-uploader-preview">
   {url?<img src={url} alt={'Prévia: '+label} loading="lazy"/>:<div className="media-uploader-empty"><ImagePlus size={28}/><span>Sem imagem selecionada</span></div>}
  </div>
  <div className="media-uploader-controls">
   <label className={'admin-btn secondary media-upload-label'+(uploading?' uploading':'')}>
    {uploading?<Loader2 className="spin" size={16}/>:<ImagePlus size={16}/>}
    {uploading?'Enviando...':'Escolher foto'}
    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={handleChange}/>
   </label>
   {completed&&<span className="upload-success"><CheckCircle2 size={15}/> Arquivo enviado. Clique em Salvar para publicar.</span>}
   {error&&<span role="alert" className="form-error">{error}</span>}
   <small>JPG, PNG, WebP ou AVIF, até 8 MB. O arquivo não será reduzido ou recortado.</small>
  </div>
 </div>
}
