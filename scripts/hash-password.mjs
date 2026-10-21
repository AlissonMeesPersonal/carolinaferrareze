import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
const rl=createInterface({input:process.stdin,output:process.stdout});
const ask=(q)=>new Promise(resolve=>rl.question(q,resolve));
const password=await ask('Defina uma senha forte para o painel (terminal local): ');
rl.close();
if(password.length<14){console.error('A senha deve ter pelo menos 14 caracteres.');process.exit(1)}
const salt=randomBytes(32);
const encoded=salt.toString('hex')+':'+scryptSync(password,salt,64).toString('hex');
console.log('Copie somente o HASH abaixo para ADMIN_PASSWORD_HASH na Vercel:');
console.log(encoded);
