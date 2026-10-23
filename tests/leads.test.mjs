import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadsCsv, escapeCsvCell, filterLeads } from '../lib/admin/leads.mjs';

const leads = [
  {
    id: '1',
    full_name: 'Maria Fernanda',
    whatsapp: '+55 51 99999-1111',
    interest: 'atendimento',
    status: 'novo',
    admin_notes: 'Retornar amanhã',
    created_at: '2026-10-21T15:00:00Z',
  },
  {
    id: '2',
    full_name: 'João',
    whatsapp: '5551999992222',
    interest: 'mentoria',
    status: 'agendado',
    admin_notes: '',
  },
  {
    id: '3',
    full_name: 'Ana',
    whatsapp: null,
    interest: null,
    status: 'novo',
  },
];
const interests = { atendimento: 'Atendimento', mentoria: 'Mentoria' };
const statuses = { novo: 'Novo', agendado: 'Agendado' };

test('filtro de contatos: busca por nome sem diferenciar maiúsculas', () => {
  assert.deepEqual(filterLeads(leads, 'maria', 'todos', interests).map((lead) => lead.id), ['1']);
});

test('filtro de contatos: respeita status e interesse exibido', () => {
  assert.deepEqual(filterLeads(leads, 'MENTORIA', 'agendado', interests).map((lead) => lead.id), ['2']);
});

test('filtro de contatos: valores ausentes não quebram a busca', () => {
  assert.deepEqual(filterLeads(leads, '', 'novo', interests).map((lead) => lead.id), ['1', '3']);
});

test('CSV: escapa aspas e preserva sinais como + em telefones', () => {
  assert.equal(escapeCsvCell('Ele disse "sim"'), '"Ele disse ""sim"""');
  assert.equal(escapeCsvCell('+55 51 99999-1111'), '"\'+55 51 99999-1111"');
});

test('CSV: impede fórmulas iniciadas por =, @ ou hífen', () => {
  assert.equal(escapeCsvCell('=SUM(1,2)'), '"\'=SUM(1,2)"');
  assert.equal(escapeCsvCell('@teste'), '"\'@teste"');
  assert.equal(escapeCsvCell('-1'), '"\'-1"');
  assert.equal(escapeCsvCell(null), '""');
});

test('CSV: gera cabeçalho em português e exporta somente os contatos selecionados', () => {
  const csv = createLeadsCsv(filterLeads(leads, 'maria', 'todos', interests), statuses, interests);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('Nome;') === false); // células do cabeçalho também são aspadas
  assert.ok(csv.includes('"Data";"Nome";"WhatsApp";"Interesse";"Status";"Observações"'));
  assert.ok(csv.includes('"Maria Fernanda"'));
  assert.ok(!csv.includes('"João"'));
});
