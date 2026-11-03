import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_COMMUNITY_TAKEAWAYS,parseCommunityTakeaways } from '../lib/community-takeaways.mjs';

test('mantém as cinco frases da cliente, incluindo acentos e TERAPÊUTICA',()=>{
 const values=parseCommunityTakeaways();
 assert.equal(values.length,5);
 assert.equal(values[0],DEFAULT_COMMUNITY_TAKEAWAYS[0]);
 assert.match(values[3],/TERAPÊUTICA/);
 assert.match(values[4],/leveza e confiança\./);
});
test('normaliza quebras e linhas em branco e limita a cinco blocos',()=>{
 const values=parseCommunityTakeaways(' A \r\n\r\n B\r\n C\r\n D\r\n E\r\n F');
 assert.deepEqual(values,['A','B','C','D','E']);
});
