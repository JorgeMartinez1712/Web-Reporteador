import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassSelect from '../../components/common/GlassSelect';

const wizardMocks = {
  vpnVendors: [
    { value: 'galac-tunnel', label: 'GALAC Secure Tunnel' },
    { value: 'direct-route', label: 'Ruta directa MPLS' },
    { value: 'partner-vpn', label: 'VPN partner existente' },
  ],
  dataRegions: [
    { value: 've-caracas', label: 'Caracas (VE)' },
    { value: 'pa-panama', label: 'Panamá' },
    { value: 'us-miami', label: 'Miami' },
  ],
  brandPresets: [
    { value: 'modern', label: 'Moderno' },
    { value: 'corporate', label: 'Corporativo' },
    { value: 'friendly', label: 'Cálido' },
  ],
  analystRoles: [
    { value: 'analyst', label: 'Analista contable' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'owner', label: 'Dueño (yo)' },
  ],
};

const modules = [
  { id: 'reports', name: 'Reportes' },
  { id: 'budgets', name: 'Presupuestos' },
  { id: 'config', name: 'Configuración' },
  { id: 'users', name: 'Usuarios' },
];

const actions = [
  { id: 'read', name: 'Solo lectura' },
  { id: 'write', name: 'Escritura' },
  { id: 'delete', name: 'Eliminación' },
  { id: 'export', name: 'Exportación' },
];

const SETUP_STORAGE_KEY = 'ownerSetupState';
const SETUP_STATUS_KEY = 'ownerSetupStatus';

const SetupWizardPage = () => {
  const navigate = useNavigate();
  const [newRole, setNewRole] = useState({ name: '', permissions: {} });
  const [steps, setSteps] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(SETUP_STORAGE_KEY) : null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        return {
          connection: { vendor: 'galac-tunnel', region: 've-caracas', route: '', status: 'incomplete' },
          branding: { name: 'Mi nueva empresa', tagline: 'Reportes claros desde el día 1', preset: 'modern', status: 'incomplete' },
          analyst: { fullName: '', email: '', role: 'analyst', status: 'optional' },
        };
      }
    }
    return {
      connection: { vendor: 'galac-tunnel', region: 've-caracas', route: '', status: 'incomplete' },
      branding: { name: 'Mi nueva empresa', tagline: 'Reportes claros desde el día 1', preset: 'modern', status: 'incomplete' },
      analyst: { fullName: '', email: '', role: 'analyst', status: 'optional' },
    };
  });

  const completion = useMemo(() => {
    const completedCount = ['connection', 'branding'].filter((stepKey) => steps[stepKey].status === 'complete').length;
    const total = 4; // Subimos a 4 por el paso de roles
    return Math.round(((completedCount + (steps.analyst.status === 'complete' ? 1 : 0)) / total) * 100);
  }, [steps]);

  const togglePermission = (moduleId, actionId) => {
    setNewRole((prev) => {
      const currentModulePerms = prev.permissions[moduleId] || [];
      const updatedModulePerms = currentModulePerms.includes(actionId)
        ? currentModulePerms.filter((p) => p !== actionId)
        : [...currentModulePerms, actionId];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: updatedModulePerms,
        },
      };
    });
  };

  const connectionReady = steps.connection.status === 'complete';
  const brandingReady = steps.branding.status === 'complete';

  const markStep = (stepKey, status) => {
    setSteps((prev) => ({ ...prev, [stepKey]: { ...prev[stepKey], status } }));
  };

  const updateField = (stepKey, field, value) => {
    setSteps((prev) => ({ ...prev, [stepKey]: { ...prev[stepKey], [field]: value } }));
  };

  const glassCard = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  useEffect(() => {
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(steps));
    localStorage.setItem(SETUP_STATUS_KEY, JSON.stringify({ completion, completed: completion === 100, lastUpdated: new Date().toISOString() }));
  }, [steps, completion]);

  useEffect(() => {
    const storedStatus = typeof window !== 'undefined' ? localStorage.getItem(SETUP_STATUS_KEY) : null;
    if (storedStatus) {
      try {
        const parsed = JSON.parse(storedStatus);
        if (parsed.completed) {
          navigate('/ajustes', { replace: true });
        }
      } catch (err) {
      }
    }
  }, [navigate]);

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleFinish = () => {
    setSteps((prev) => ({
      connection: { ...prev.connection, status: 'complete' },
      branding: { ...prev.branding, status: 'complete' },
      analyst: { ...prev.analyst, status: 'complete' },
    }));
    navigate('/ajustes');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl font-semibold text-text-base flex">Configuración inicial</h1>
            <p className="text-sm text-text-muted text-left">Tres pasos guiados para que tu instancia quede lista y empiece a generar reportes.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm text-text-base">
              <i className="bi bi-lightning-charge text-brand-secondary" />
              <span>Avance {completion}%</span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-glass-card-strong"
            >
              Configurar mas tarde
            </button>
          </div>
        </div>
      </header>

      <div className={`${glassCard} p-6 space-y-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Progreso</p>
            <p className="text-lg font-semibold">Activación de tu instancia</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className={`flex items-center gap-1 rounded-full px-3 py-1 ${connectionReady ? 'bg-status-success-soft text-status-success' : 'bg-glass-card-strong text-text-muted'}`}>
              <i className="bi bi-check-circle" /> Paso A {connectionReady ? 'listo' : 'pendiente'}
            </span>
            <span className={`flex items-center gap-1 rounded-full px-3 py-1 ${brandingReady ? 'bg-status-success-soft text-status-success' : 'bg-status-info-soft text-brand-secondary'}`}>
              <i className="bi bi-magic" /> Paso B {brandingReady ? 'listo' : 'en curso'}
            </span>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-glass-card-strong">
          <div className="h-full rounded-full bg-brand-secondary" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassCard} p-6 space-y-5 lg:col-span-2`}>
          <div className="space-y-1">
            <div className="text-center">
              <div>
                <p className="text-lg font-semibold text-text-base">Conexión con GALAC</p>
                <p className="text-sm text-text-muted">Define la ruta de datos segura para sincronizar movimientos.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <GlassSelect
              value={steps.connection.vendor}
              options={wizardMocks.vpnVendors}
              onChange={(value) => updateField('connection', 'vendor', value)}
              placeholder="Proveedor VPN"
              icon="bi bi-shield-check"
            />
            <GlassSelect
              value={steps.connection.region}
              options={wizardMocks.dataRegions}
              onChange={(value) => updateField('connection', 'region', value)}
              placeholder="Región de datos"
              icon="bi bi-geo-alt"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-muted" htmlFor="route-name">
              Ruta interna o IP expuesta
            </label>
            <input
              id="route-name"
              type="text"
              value={steps.connection.route}
              onChange={(e) => updateField('connection', 'route', e.target.value)}
              placeholder="10.0.0.12:443 / vpn.miempresa.com"
              className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => markStep('connection', 'complete')}
              className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Marcar como listo
            </button>
          </div>
        </div>

        <div className={`${glassCard} p-6 space-y-4`}>
          <p className="text-lg font-semibold text-text-base">Branding inmediato</p>
          <p className="text-sm text-text-muted">Carga logo y nombre comercial que usaremos en cada reporte.</p>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-muted" htmlFor="brand-name">Nombre comercial</label>
              <input
                id="brand-name"
                type="text"
                value={steps.branding.name}
                onChange={(e) => updateField('branding', 'name', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <i className="bi bi-upload text-text-muted" />
                <span>Arrastra o selecciona tu logo</span>
              </div>
              <button
                type="button"
                className="rounded-xl border border-glass-border px-3 py-1 text-xs font-semibold text-text-base transition hover:bg-glass-card"
              >
                Subir
              </button>
            </div>
            <button
              type="button"
              onClick={() => markStep('branding', 'complete')}
              className="w-full rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Guardar branding
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassCard} p-6 space-y-4 lg:col-span-2`}>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-text-base">Invita a tu primer analista</p>
              <p className="text-sm text-text-muted">Si no tienes analista, puedes invitarlo luego.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-text-muted" htmlFor="analyst-role">Puesto</label>
              <GlassSelect
                id="analyst-role"
                value={steps.analyst.role}
                options={wizardMocks.analystRoles}
                onChange={(value) => updateField('analyst', 'role', value)}
                placeholder="Rol"
                icon="bi bi-person-badge"
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-text-muted" htmlFor="analyst-name">Nombre completo</label>
              <input
                id="analyst-name"
                type="text"
                value={steps.analyst.fullName}
                onChange={(e) => updateField('analyst', 'fullName', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-text-muted" htmlFor="analyst-email">Correo corporativo</label>
              <input
                id="analyst-email"
                type="email"
                value={steps.analyst.email}
                onChange={(e) => updateField('analyst', 'email', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => markStep('analyst', 'complete')}
              className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
            >
              Enviar invitacion
            </button>
          </div>
        </div>

        <div className={`${glassCard} p-6 space-y-3`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Resumen rápido</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="space-y-1 text-left">
                <p className="text-text-muted">GALAC</p>
                <p className="font-semibold text-text-base">{wizardMocks.vpnVendors.find((v) => v.value === steps.connection.vendor)?.label}</p>
              </div>
              <i className="bi bi-shield-lock text-brand-secondary" />
            </div>
            <div className="flex items-start justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3">
              <div className="space-y-1 text-left">
                <p className="text-text-muted">Branding</p>
                <p className="font-semibold text-text-base">{steps.branding.name}</p>
                <p className="text-xs text-text-muted">{steps.branding.tagline}</p>
              </div>
              <i className="bi bi-image text-brand-secondary" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6">
        <div className={`${glassCard} p-6 space-y-6`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 text-left">
              <p className="text-lg font-semibold text-text-base">Roles y Permisos (Opcional)</p>
              <p className="text-sm text-text-muted">Configura un rol personalizado para tus empleados.</p>
            </div>
            <div className="p-3 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20">
               <p className="text-xs text-brand-secondary font-medium">HU-04: Definición de Roles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm text-text-muted" htmlFor="role-name-wizard">Nombre del rol</label>
                <input
                  id="role-name-wizard"
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Ej. Analista de Tesorería"
                  className="w-full rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-glass-border bg-glass-card-strong">
                <table className="w-full text-left text-sm">
                  <thead className="bg-glass-card text-xs uppercase tracking-wider text-text-muted border-b border-glass-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Módulo</th>
                      {actions.map((action) => (
                        <th key={action.id} className="px-4 py-3 font-medium text-center">{action.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {modules.map((module) => (
                      <tr key={module.id} className="hover:bg-glass-card/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-text-base">{module.name}</td>
                        {actions.map((action) => (
                          <td key={action.id} className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => togglePermission(module.id, action.id)}
                              className={`inline-flex items-center justify-center h-5 w-5 rounded border transition-all ${
                                (newRole.permissions[module.id] || []).includes(action.id)
                                  ? 'bg-brand-secondary border-brand-secondary text-text-base'
                                  : 'border-glass-border bg-glass-card-strong text-transparent'
                              }`}
                            >
                              <i className="bi bi-check" />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-2xl bg-glass-card-strong border border-glass-border relative overflow-hidden">
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand-secondary/20">
                      <i className="bi bi-shield-check text-brand-secondary" />
                    </div>
                    <p className="font-semibold text-text-base">Vista previa del rol</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-brand-secondary">{newRole.name || 'Nuevo Rol'}</p>
                    <div className="flex flex-wrap gap-2">
                       {Object.keys(newRole.permissions).length > 0 ? (
                         Object.entries(newRole.permissions).map(([mod, perms]) => perms.length > 0 && (
                           <span key={mod} className="px-3 py-1 rounded-full bg-glass-card border border-glass-border text-xs text-text-muted">
                             {modules.find(m => m.id === mod)?.name}: {perms.length} permisos
                           </span>
                         ))
                       ) : (
                         <p className="text-sm text-text-muted italic">No has seleccionado permisos aún.</p>
                       )}
                    </div>
                  </div>
               </div>
               <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full mt-8 rounded-2xl bg-brand-secondary px-4 py-4 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft shadow-lg shadow-brand-secondary/20"
                >
                  Finalizar y Guardar todo
                </button>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-secondary/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SetupWizardPage;
