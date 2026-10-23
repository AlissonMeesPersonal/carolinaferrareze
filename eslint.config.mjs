import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

// Regras recomendadas pelo Next.js para rotas, React e acessibilidade.
// Alertas existentes podem ser resolvidos incrementalmente, por módulo.
export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', '.vercel/**']),
]);
