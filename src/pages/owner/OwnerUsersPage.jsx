import { useMemo, useState } from 'react';
import CustomModal from '../../components/common/CustomModal';
import GlassSelect from '../../components/common/GlassSelect';

const mockSlots = { used: 2, limit: 5 };
const mockCompanies = [
  { id: 'empresa-1', name: 'Inversiones Andina' },
  { id: 'empresa-2', name: 'Servicios Delta' },
  { id: 'empresa-3', name: 'Operadora Galac' },
];

const mockRoles = [
  { value: 'r-1', label: 'Analista Senior' },
  { value: 'r-2', label: 'Visualizador' },
  { value: 'r-3', label: 'Administrador' },
];

const mockUsers = [
  {
    id: 'u-1',
    name: 'Ana Contreras',
    email: 'ana.contreras@conta.com',
    joined: '10 Feb 2026',
    companies: ['Inversiones Andina', 'Servicios Delta'],
    role: 'Analista Senior',
    status: 'Activo',
  },
  {
    id: 'u-2',
    name: 'Luis Perez',
    email: 'luis.perez@conta.com',
    joined: '08 Feb 2026',
    companies: ['Operadora Galac'],
    role: 'Visualizador',
    status: 'Pendiente',
  },
];

const statusBadge = {
  Activo: 'bg-status-success-soft text-status-success',
  Pendiente: 'bg-status-warning-soft text-status-warning',
  Inactivo: 'bg-glass-card text-text-muted',
};

const OwnerUsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCompanies, setInviteCompanies] = useState([]);
  const [inviteRole, setInviteRole] = useState('r-1');

  const glassCard = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const slotsLeft = useMemo(() => Math.max(0, mockSlots.limit - mockSlots.used), []);
  const canInvite = slotsLeft > 0;

  const toggleCompany = (id) => {
    setInviteCompanies((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const companiesSelected = inviteCompanies.map((id) => mockCompanies.find((c) => c.id === id)?.name).filter(Boolean);
    const roleLabel = mockRoles.find(r => r.value === inviteRole)?.label || 'Sin rol';
    const newUser = {
      id: `u-${users.length + 1}`,
      name: inviteEmail.split('@')[0].replace('.', ' '),
      email: inviteEmail,
      joined: 'Hoy',
      companies: companiesSelected,
      role: roleLabel,
      status: 'Pendiente',
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteEmail('');
    setInviteCompanies([]);
    setInviteRole('r-1');
    setInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Usuarios de la suscripcion</h1>
            <p className="text-sm text-text-muted">Asigna analistas, controla accesos y envía invitaciones.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm text-text-base">
              <i className="bi bi-people text-brand-secondary" />
              <span>
                Has usado {mockSlots.used} de {mockSlots.limit} usuarios permitidos
              </span>
            </div>
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              disabled={!canInvite}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold text-text-base transition ${
                canInvite
                  ? 'bg-brand-secondary hover:bg-brand-secondary-soft'
                  : 'bg-glass-card text-text-muted cursor-not-allowed border border-dashed border-glass-border'
              }`}
            >
              + Invitar analista
            </button>
          </div>
        </div>
      </header>

      <section className={`${glassCard} p-6 space-y-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-text-base">Controla quién accede a cada empresa</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span className="rounded-full bg-glass-card px-3 py-1">Activos: {users.filter((u) => u.status === 'Activo').length}</span>
            <span className="rounded-full bg-status-warning-soft px-3 py-1 text-status-warning">Pendientes: {users.filter((u) => u.status === 'Pendiente').length}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-glass-border bg-glass-card-strong">
          <div className="grid grid-cols-12 gap-3 border-b border-glass-border bg-glass-card px-4 py-3 text-xs uppercase tracking-[0.15em] text-text-muted">
            <span className="col-span-3">Nombre / Email</span>
            <span className="col-span-2">Rol</span>
            <span className="col-span-4">Empresas asignadas</span>
            <span className="col-span-1">Estado</span>
            <span className="col-span-2 text-right">Acciones</span>
          </div>
          <div className="divide-y divide-glass-border">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm items-center">
                <div className="col-span-3 space-y-1">
                  <p className="font-semibold text-text-base">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
                <span className="col-span-2 text-text-muted font-medium">{user.role}</span>
                <span className="col-span-4 text-text-muted">
                  {user.companies.length ? user.companies.join(', ') : 'Sin empresas'}
                </span>
                <span className={`col-span-1 w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[user.status] || 'bg-glass-card text-text-muted'}`}>
                  {user.status}
                </span>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button className="rounded-xl border border-glass-border px-3 py-1 text-xs font-semibold text-status-warning transition hover:border-status-warning">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CustomModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invitar analista">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-text-muted" htmlFor="invite-email">Correo del analista</label>
            <input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="analista@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-muted" htmlFor="invite-role">Rol asignado</label>
            <GlassSelect
              id="invite-role"
              value={inviteRole}
              options={mockRoles}
              onChange={setInviteRole}
              placeholder="Selecciona un rol"
              icon="bi bi-shield-lock"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-text-base">Empresas a las que tendrá acceso</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {mockCompanies.map((company) => (
                <label key={company.id} className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-3 py-2 text-sm text-text-base">
                  <input
                    type="checkbox"
                    checked={inviteCompanies.includes(company.id)}
                    onChange={() => toggleCompany(company.id)}
                    className="rounded border-glass-border text-brand-secondary focus:ring-brand-secondary"
                  />
                  <span>{company.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleInvite}
              disabled={!inviteEmail.trim()}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold text-text-base transition ${
                inviteEmail.trim() ? 'bg-brand-secondary hover:bg-brand-secondary-soft' : 'bg-glass-card text-text-muted cursor-not-allowed'
              }`}
            >
              Enviar invitacion
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default OwnerUsersPage;
