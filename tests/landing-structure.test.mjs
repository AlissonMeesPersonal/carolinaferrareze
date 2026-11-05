import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const landing=readFileSync(new URL('../components/Landing.jsx',import.meta.url),'utf8');
const admin=readFileSync(new URL('../app/admin/page.jsx',import.meta.url),'utf8');
const api=readFileSync(new URL('../app/api/admin/data/route.js',import.meta.url),'utf8');

test('Acompanhamento, Comunidade e Sobre mim aparecem nesta ordem',()=>{
 const a=landing.indexOf('id="acompanhamento"');
 const c=landing.indexOf('id="comunidade"');
 const s=landing.indexOf('id="sobre"');
 assert.ok(a>=0 && c>a && s>c);
});
test('relatos escritos fictícios e convite antigo deixam de aparecer',()=>{
 assert.doesNotMatch(landing,/Histórias compartilhadas/);
 assert.doesNotMatch(landing,/O seu processo merece/);
 assert.doesNotMatch(landing,/relato-1\.svg/);
 assert.match(landing,/Seus sonhos merecem sua disciplina/);
});
test('contato direto é exclusivo quando formulário está desligado',()=>{
 assert.match(landing,/formEnabled&&<div className="contact-copy">/);
 assert.match(landing,/contact-direct-card/);
});
test('edição de frase e galeria de imagens em lote preservam rascunhos',()=>{
 assert.match(admin,/galleryBatchConsent/);
 assert.match(admin,/is_published:false/);
 assert.match(admin,/Enviar várias fotos/);
 assert.match(admin,/closing_phrase/);
 assert.match(api,/closing_phrase/);
});
