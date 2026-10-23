/**
 * Regras do módulo "Contatos recebidos".
 * Funções puras e independentes do React para facilitar testes e estudo.
 */

export function formatLeadDate(value) {
  return value
    ? new Date(value).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '—';
}

export function filterLeads(leads, query = '', status = 'todos', kinds = {}) {
  const normalizedQuery = String(query ?? '').trim().toLocaleLowerCase('pt-BR');

  return leads.filter((lead) => {
    const searchableText = [
      lead.full_name ?? '',
      lead.whatsapp ?? '',
      kinds[lead.interest] ?? lead.interest ?? '',
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR');

    const matchesQuery = searchableText.includes(normalizedQuery);
    const matchesStatus = status === 'todos' || lead.status === status;

    return matchesQuery && matchesStatus;
  });
}

/** Evita interpretar dados de usuários como fórmulas em planilhas CSV. */
export function escapeCsvCell(value) {
  let text = String(value ?? '');

  if (/^\s*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) {
    text = "'" + text;
  }

  return '"' + text.replace(/"/g, '""') + '"';
}

export function createLeadsCsv(leads, labels = {}, kinds = {}) {
  const columns = ['Data', 'Nome', 'WhatsApp', 'Interesse', 'Status', 'Observações'];
  const rows = leads.map((lead) => [
    formatLeadDate(lead.created_at),
    lead.full_name,
    lead.whatsapp,
    kinds[lead.interest] ?? lead.interest,
    labels[lead.status] ?? lead.status,
    lead.admin_notes ?? '',
  ]);

  // UTF-8 BOM facilita leitura de acentos no Excel.
  return '\uFEFF' + [columns, ...rows]
    .map((row) => row.map(escapeCsvCell).join(';'))
    .join('\r\n');
}
