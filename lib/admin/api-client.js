/**
 * Cliente HTTP do painel administrativo.
 * Só é usado em componentes 'use client'; as credenciais do Neon nunca entram aqui.
 */
export async function adminApi(path, method = 'GET', data) {
  const hasBody = data !== undefined;

  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: hasBody ? { 'Content-Type': 'application/json' } : {},
    ...(hasBody ? { body: JSON.stringify(data) } : {}),
  });

  if (response.status === 204) return null;

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }

  if (!response.ok) {
    throw new Error(result?.error || 'Não foi possível completar a ação.');
  }
  return result;
}
