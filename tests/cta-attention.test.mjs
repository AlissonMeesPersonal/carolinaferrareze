import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../app/globals.css', import.meta.url)), 'utf8');

test('os dois CTAs usam animações com realce dourado perceptível', () => {
  assert.match(css, /\.about \.about-contact-attention\s*\{[^}]*animation:about-cta-highlight 4s/);
  assert.match(css, /\.accompaniment-intro \.booking-cta-pulse\s*\{[^}]*animation:booking-cta-highlight 4s/);
  assert.match(css, /@keyframes about-cta-highlight/);
  assert.match(css, /@keyframes booking-cta-highlight/);
  assert.match(css, /0 0 0 10px rgba\(156,117,47,\.28\)/);
});

test('hover do desktop não pausa a animação e a redução de movimento tem fallback estático', () => {
  assert.match(css, /\.about \.about-contact-attention:hover\s*\{\s*animation-play-state:running;/);
  assert.match(css, /\.accompaniment-intro \.booking-cta-pulse:hover\s*\{\s*animation-play-state:running;/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\s*\{/);
  assert.match(css, /box-shadow:0 0 0 6px rgba\(156,117,47,\.24\)/);
  assert.doesNotMatch(css, /animation-play-state:paused;/);
});
