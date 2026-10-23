'use client';

import Field from '@/components/admin/Field';

/**
 * Permissões de acesso no painel.
 * O servidor continua responsável por validar as ações de suporte/proprietária.
 */
export default function AccessPanel({
  viewer,
  accounts,
  audit,
  busy,
  when,
  newEmail,
  setNewEmail,
  newRole,
  setNewRole,
  inviteUrl,
  onInviteAccount,
  onToggleSupport,
  onSelfEndSupport,
}) {
  return (
    <section className="admin-panel">
      <h2>Usuários autorizados</h2>
      <p className="admin-note">
        Aqui aparecem somente as contas ativas. A proprietária pode revogar o
        suporte; os registros de auditoria permanecem disponíveis depois do
        encerramento do acesso.
      </p>

      {viewer?.role === 'support' && (
        <div className="admin-card">
          <h3>Encerrar meu acesso de suporte</h3>
          <p className="admin-note">
            Use esta opção ao entregar o projeto. Sua conta será desativada,
            as sessões serão encerradas e seu nome sairá da lista de acessos
            ativos. O histórico das alterações continuará disponível.
          </p>
          <button
            type="button"
            className="admin-btn danger"
            disabled={busy}
            onClick={onSelfEndSupport}
          >
            Encerrar meu acesso
          </button>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Situação</th>
              <th>Último acesso</th>
              <th>Controle</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td data-label="Conta"><strong>{account.email}</strong></td>
                <td data-label="Perfil">
                  {account.role === 'owner' ? 'Proprietária' : 'Suporte técnico'}
                </td>
                <td data-label="Situação">
                  {!account.active
                    ? 'Desativado'
                    : !account.activated
                      ? 'Aguardando ativação'
                      : 'Ativo'}
                </td>
                <td data-label="Último acesso">{when(account.last_login_at)}</td>
                <td data-label="Ação">
                  {viewer?.role === 'owner' && account.role === 'support' ? (
                    <button
                      type="button"
                      className="admin-btn secondary"
                      onClick={() => onToggleSupport(account)}
                    >
                      Desativar suporte
                    </button>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card admin-access-create">
        <h3>Convidar uma pessoa</h3>
        <p className="admin-note">
          O sistema gera um convite temporário válido por 48 horas. Envie o link
          diretamente à pessoa; ela define sua própria senha.
        </p>
        <form onSubmit={onInviteAccount} className="admin-grid">
          <Field
            label="E-mail do novo acesso"
            type="email"
            value={newEmail}
            onChange={setNewEmail}
            placeholder="email@exemplo.com"
          />
          <label className="admin-field">
            Perfil
            <select value={newRole} onChange={(event) => setNewRole(event.target.value)}>
              <option value="owner">Proprietária</option>
              {viewer?.role === 'owner' && <option value="support">Suporte técnico</option>}
            </select>
          </label>
          <div className="wide">
            <button type="submit" className="admin-btn" disabled={busy || !newEmail.includes('@')}>
              Gerar convite
            </button>
          </div>
        </form>

        {inviteUrl && (
          <div className="admin-invite-result">
            <strong>Link de ativação — compartilhe em particular:</strong>
            <input
              readOnly
              value={inviteUrl}
              onFocus={(event) => event.target.select()}
              aria-label="Link de ativação de uso único"
            />
            <button
              type="button"
              className="admin-btn secondary"
              onClick={() => navigator.clipboard?.writeText(inviteUrl)}
            >
              Copiar link
            </button>
            <small>Este link dá acesso ao cadastro de senha. Não publique nem envie a terceiros.</small>
          </div>
        )}
      </div>

      <h3>Histórico de atividades administrativas</h3>
      <p className="admin-note">
        Alterações relevantes são registradas com o usuário responsável, sem
        expor os dados dos interessados neste histórico.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Quando</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((entry, index) => (
              <tr key={index}>
                <td data-label="Quando">{when(entry.created_at)}</td>
                <td data-label="Usuário">{entry.email || 'Conta antiga'}</td>
                <td data-label="Ação">{entry.action}</td>
                <td data-label="Item">{entry.subject || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {audit.length === 0 && <p className="admin-empty">Ainda não há atividades registradas.</p>}
      </div>
    </section>
  );
}
