import test from 'node:test';
import assert from 'node:assert/strict';
import { communityLessons,communityPreviewSlides } from '../lib/community-lessons.mjs';
test('carrossel possui três telas distintas',()=>{
 assert.deepEqual(communityPreviewSlides.map(x=>x.id),['intro','library','themes']);
});
test('biblioteca ilustrativa usa temas reais e números únicos',()=>{
 assert.equal(communityLessons.length,9);
 assert.equal(new Set(communityLessons.map(x=>x.number)).size,communityLessons.length);
 assert.ok(communityLessons.every(x=>x.title && x.duration));
 assert.match(communityLessons.find(x=>x.number===11).title,/LIMITES/);
});
