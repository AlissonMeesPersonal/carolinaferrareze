'use client';

import { Download, RefreshCw, Users } from 'lucide-react';

/**
 * Lista e ações do CRM simplificado.
 * O estado dos contatos e as chamadas de API ficam no componente Admin.
 */
export default function LeadsPanel({
  leads,
  filteredLeads,
  query,
  setQuery,
  leadStatusFilter,
  setLeadStatusFilter,
  labels,
  kinds,
  when,
  onRefresh,
  onExport,
  onUpdateStatus,
  onUpdateNote,
  onSaveNote,
  busy,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-heading-row">
        <h2>
          Contatos recebidos <span className="admin-count">{leads.length}</span>
        </h2>
        <button type="button" className="admin-btn secondary" disabled={busy} onClick={onRefresh}>
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div className="admin-toolbar admin-lead-toolbar">
        <div className="admin-search-wrapper">
          <Users size={18} />
          <input
            className="admin-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nome, telefone ou serviço"
            aria-label="Buscar contatos"
          />
        </div>
        <select
          className="admin-search"
          value={leadStatusFilter}
          onChange={(event) => setLeadStatusFilter(event.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="todos">Todos os status</option>
          {Object.entries(labels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button type="button" className="admin-btn secondary" onClick={onExport}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Contato</th>
              <th>Interesse</th>
              <th>Data</th>
              <th>Situação</th>
              <th>WhatsApp</th>
              <th>Anotações privadas</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td data-label="Contato">
                  <strong>{lead.full_name}</strong>
                  <small>{lead.whatsapp}</small>
                </td>
                <td data-label="Interesse">{kinds[lead.interest] ?? lead.interest}</td>
                <td data-label="Data">{when(lead.created_at)}</td>
                <td data-label="Situação">
                  <select
                    value={lead.status}
                    aria-label={'Status de ' + lead.full_name}
                    onChange={(event) => onUpdateStatus(lead.id, event.target.value)}
                  >
                    {Object.entries(labels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
                <td data-label="WhatsApp">
                  {lead.whatsapp ? (
                    <a
                      href={'https://wa.me/' + String(lead.whatsapp).replace(/\D/g, '')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir ↗
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td data-label="Anotações">
                  <div className="lead-note-editor">
                    <textarea
                      aria-label={'Observação de ' + lead.full_name}
                      value={lead.admin_notes || ''}
                      maxLength={2500}
                      onChange={(event) => onUpdateNote(lead.id, event.target.value)}
                      placeholder="Histórico do contato, retorno combinado..."
                    />
                    <button
                      type="button"
                      className="admin-btn secondary"
                      disabled={busy}
                      onClick={() => onSaveNote(lead.id, lead.admin_notes || '')}
                    >
                      Salvar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 && (
          <p className="admin-empty">
            {leads.length === 0
              ? 'Nenhum interessado ainda.'
              : 'Nenhum contato encontrado com os filtros selecionados.'}
          </p>
        )}
      </div>
    </section>
  );
}
