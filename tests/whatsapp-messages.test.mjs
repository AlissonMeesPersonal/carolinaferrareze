import test from 'node:test';
import assert from 'node:assert/strict';
import { WHATSAPP_MESSAGES, serviceWhatsAppMessage, packageWhatsAppMessage } from '../lib/whatsapp-messages.mjs';

test('assuntos gerais são distintos e não vazios',()=>{
 const messages=Object.values(WHATSAPP_MESSAGES);
 assert.equal(new Set(messages).size,messages.length);
 assert.ok(messages.every(message=>message.length>15));
});
test('pacotes de 3 e 6 sessões geram mensagens diferentes',()=>{
 const three=packageWhatsAppMessage('Pacote de 3 sessões');
 const six=packageWhatsAppMessage('Pacote de 6 sessões');
 assert.match(three,/3 sessões/);assert.match(six,/6 sessões/);
 assert.match(three,/investimento/);assert.notEqual(three,six);
});
test('nome real do atendimento aparece na conversa',()=>{
 assert.match(serviceWhatsAppMessage('Constelação individual'),/Constelação individual/);
});
test('conteúdo com linhas e campos vazios tem fallback seguro',()=>{
 assert.match(serviceWhatsAppMessage('Sessão\n individual'),/Sessão individual/);
 assert.equal(packageWhatsAppMessage(null),WHATSAPP_MESSAGES.individual);
 assert.equal(serviceWhatsAppMessage(''),WHATSAPP_MESSAGES.individual);
});
