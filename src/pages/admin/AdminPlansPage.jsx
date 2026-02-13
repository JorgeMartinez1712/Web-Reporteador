import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const plansMock = [
  { id: 'basic', name: 'Básico', price: 89, companies: 2, users: 5, devices: 10 },
  { id: 'pro', name: 'Pro', price: 149, companies: 5, users: 15, devices: 25 },
  { id: 'corp', name: 'Corporativo', price: 289, companies: 10, users: 40, devices: 60 },
];

const requirementsMock = [
  { id: 'rif', label: 'RIF actualizado', mandatory: true },
  { id: 'acta', label: 'Acta Constitutiva', mandatory: true },
  { id: 'banco', label: 'Estado de cuenta bancario', mandatory: true },
  { id: 'rnc', label: 'Registro Nacional de Contratistas', mandatory: false },
];

const AdminPlansPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [requirements, setRequirements] = useState(requirementsMock);

  const currentPlan = useMemo(() => plansMock.find((p) => p.id === selectedPlan), [selectedPlan]);

  const toggleRequirement = (id) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, mandatory: !r.mandatory } : r)));
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Configurador de planes y requisitos</h1>
            <p className="text-sm text-text-muted">Edita precios, límites y define qué documentos se piden en onboarding.</p>
          </div>
          <GlassSelect
            value={selectedPlan}
            onChange={setSelectedPlan}
            options={plansMock.map((p) => ({ value: p.id, label: p.name }))}
            icon="bi bi-columns-gap"
            className="w-48"
          />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${glassPanel} p-6 space-y-4 lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Plan seleccionado</p>
              <p className="text-lg font-semibold text-text-base">{currentPlan?.name}</p>
              <p className="text-sm text-text-muted">Precio y límites para empresas, usuarios y dispositivos.</p>
            </div>
            <span className="rounded-full bg-status-info-soft px-3 py-1 text-xs font-semibold text-brand-secondary">USD {currentPlan?.price}/mes</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Empresas</p>
              <p className="text-2xl font-semibold text-text-base">{currentPlan?.companies}</p>
              <p className="text-xs text-text-muted">Máximo permitido</p>
            </div>
            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Usuarios</p>
              <p className="text-2xl font-semibold text-text-base">{currentPlan?.users}</p>
              <p className="text-xs text-text-muted">Con acceso al panel</p>
            </div>
            <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Dispositivos</p>
              <p className="text-2xl font-semibold text-text-base">{currentPlan?.devices}</p>
              <p className="text-xs text-text-muted">Regla de seguridad</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="number"
              min="0"
              className="w-full md:w-1/3 rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              defaultValue={currentPlan?.price}
            />
            <div className="flex gap-2">
              <button className="rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
                Guardar precio
              </button>
              <button className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">
                Publicar cambios
              </button>
            </div>
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Requisitos</p>
              <p className="text-lg font-semibold text-text-base">Checklist dinámico</p>
            </div>
            <button className="rounded-xl border border-glass-border bg-glass-card px-3 py-1 text-xs font-semibold text-text-base transition hover:border-brand-secondary">
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {requirements.map((req) => (
              <label key={req.id} className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card-strong px-4 py-3 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-text-base">{req.label}</p>
                  <p className="text-xs text-text-muted">Visible para nuevos interesados</p>
                </div>
                <input
                  type="checkbox"
                  checked={req.mandatory}
                  onChange={() => toggleRequirement(req.id)}
                  className="h-5 w-5 rounded border-glass-border text-brand-secondary focus:ring-brand-secondary"
                />
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPlansPage;
