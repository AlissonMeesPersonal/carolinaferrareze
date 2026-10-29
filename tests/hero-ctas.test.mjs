import test from 'node:test';
import assert from 'node:assert/strict';
import { heroCtaLabel, DEFAULT_HERO_CTA_LABELS, safeHotmartUrl } from '../lib/hero-ctas.mjs';

test('mantém textos padrão dos três botões', () => {
 assert.equal(heroCtaLabel('', DEFAULT_HERO_CTA_LABELS.individual), 'Acompanhamento Individual');
 assert.equal(heroCtaLabel('  Quero Constelar  ', DEFAULT_HERO_CTA_LABELS.constelacao), 'Quero Constelar');
 assert.equal(heroCtaLabel(undefined, DEFAULT_HERO_CTA_LABELS.bmc), 'Comunidade BMC');
});

test('mantém os links oficiais para produto Hotmart', () => {
 assert.equal(safeHotmartUrl('https://pay.hotmart.com/A12345?off=abc'),'https://pay.hotmart.com/A12345?off=abc');
 assert.equal(safeHotmartUrl('https://go.hotmart.com/ABCDE'),'https://go.hotmart.com/ABCDE');
 assert.equal(safeHotmartUrl('https://hotm.art/ABCDE'),'https://hotm.art/ABCDE');
});

test('não transforma URL ausente em link de venda falso', () => {
 assert.equal(safeHotmartUrl(''),'');
 assert.equal(safeHotmartUrl(null),'');
});

test('bloqueia domínio parecido, link inseguro e protocolos indevidos', () => {
 for (const value of ['http://pay.hotmart.com/A123','https://hotmart.com.evil.example/checkout','javascript:alert(1)','https://example.com/','https://user:pass@pay.hotmart.com/A']) {
  assert.equal(safeHotmartUrl(value), '', value);
 }
});
