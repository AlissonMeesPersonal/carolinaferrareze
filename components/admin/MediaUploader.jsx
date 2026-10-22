'use client';
import {useRef,useState} from 'react';
import {ImagePlus,UploadCloud,LoaderCircle,CheckCircle2,AlertCircle,Image as ImageIcon} from 'lucide-react';

/**
 * Foto original para o Neon Storage: sem compressão e sem recortes.
 * O link retornado é salvo no CMS após confirmar a alteração do conteúdo.
 */
export default function MediaUploader({url='',onUploaded,label='Fotografia'}){
 const input=useRef(null);
 const [uploading,setUploading]=useState(false);
 const [dragging,setDragging]=useState(false);
 const [error,setError]=useState('');
 const [completed,setCompleted]=useState(false);

 async function upload(file){
  if(!file)return;
  setError('');setCompleted(false);
  if(file.size>8*1024*1024){setError('A imagem deve ter até 8 MB.');return;}
  if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)){
    setError('Use uma imagem JPG, PNG, WebP ou AVIF.');return;
  }
  setUploading(true);
  try{
   const body=new FormData();
   body.append('file',file);
   const response=await fetch('/api/admin/media',{method:'POST',body,credentials:'same-origin'});
   let result;
   try{result=await response.json()}catch{result={error:'O servidor não respondeu corretamente.'};}
   if(!response.ok)throw new Error(result.error||'Falha ao enviar a fotografia.');
   onUploaded(result.url);
   setCompleted(true);
  }catch(e){
   setError(e.message||'Não foi possível enviar a fotografia.');
  }finally{
   setUploading(false);
   if(input.current)input.current.value='';
  }
 }
 function drop(event){
  event.preventDefault();setDragging(false);
  if(!uploading)upload(event.dataTransfer?.files?.[0]);
 }
 return <div
  className={'media-uploader'+(dragging?' is-dragging':'')+(uploading?' is-uploading':'')}
  role="group"
  aria-label={'Envio de '+label}
  onDragOver={e=>{e.preventDefault();if(!uploading)setDragging(true);}}
  onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragging(false);}}
  onDrop={drop}
 >
  <div className="media-uploader-preview">
   {url?<img src={url} alt={'Prévia de '+label} loading="lazy"/>:
   <div className="media-uploader-empty"><ImageIcon size={33} strokeWidth={1.4}/><strong>Prévia da imagem</strong><span>A fotografia aparece aqui após o envio</span></div>}
  </div>
  <div className="media-uploader-controls">
   <span className="media-uploader-eyebrow"><UploadCloud size={16}/> BIBLIOTECA DE IMAGENS</span>
   <strong className="media-uploader-title">{url?'Fotografia selecionada':'Adicione sua fotografia'}</strong>
   <p>Escolha um arquivo do dispositivo ou arraste para esta área. Preservamos o arquivo original, sem comprimir ou recortar.</p>
   <input
    ref={input}
    id={undefined}
    className="media-uploader-input"
    type="file"
    accept="image/jpeg,image/png,image/webp,image/avif"
    disabled={uploading}
    aria-label={'Selecionar arquivo para '+label}
    onChange={e=>upload(e.target.files?.[0])}
   />
   <button className="admin-btn media-upload-action" type="button" disabled={uploading} onClick={()=>input.current?.click()}>
    {uploading?<LoaderCircle className="spin" size={18}/>:<ImagePlus size={18}/>}
    {uploading?'Enviando imagem...':url?'Substituir imagem':'Enviar imagem'}
   </button>
   <small>Formatos JPG, PNG, WebP e AVIF · Máximo de 8 MB</small>
   {completed&&<span className="upload-success" role="status"><CheckCircle2 size={17}/> Imagem enviada. Salve as alterações para publicar.</span>}
   {error&&<span className="upload-error" role="alert"><AlertCircle size={17}/> {error}</span>}
  </div>
 </div>;
}
