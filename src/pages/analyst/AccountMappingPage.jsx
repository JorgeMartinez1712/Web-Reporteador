import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const mockPlan = [
  { id: '4001', name: 'Ventas nacionales', balance: 420000 },
  { id: '4002', name: 'Ventas exportación', balance: 185000 },
  { id: '5101', name: 'Costo de ventas', balance: 280000 },
  { id: '6101', name: 'Gastos de administración', balance: 92000 },
  { id: '6203', name: 'Gastos de ventas', balance: 74000 },
  { id: '7101', name: 'Gastos financieros', balance: 25000 },
];

const erCategories = [
  { value: 'ingresos', label: 'Ingresos' },
  { value: 'costos', label: 'Costos' },
  { value: 'gastos', label: 'Gastos operativos' },
  { value: 'financieros', label: 'Gastos financieros' },
  { value: 'otros', label: 'Otros ingresos/egresos' },
];

const AccountMappingPage = () => {
  const [assignments, setAssignments] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('ingresos');
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const summary = useMemo(() => {
    return erCategories.map((cat) => {
      const mappedAccounts = mockPlan.filter((acc) => assignments[acc.id] === cat.value);
      const total = mappedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      return { ...cat, count: mappedAccounts.length, total };
    });
  }, [assignments]);

  const handleAssign = (accountId, categoryValue) => {
    setAssignments((prev) => ({ ...prev, [accountId]: categoryValue }));
    localStorage.setItem('analystMappingReady', 'true');
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Configuracion tecnica</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Mapeo GALAC al EERR</h1>
            <p className="text-sm text-text-muted">Clasifica el plan de cuentas en las categorias del Estado de Resultados para habilitar reportes.</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={erCategories}
              placeholder="Categoria destino"
              icon="bi bi-diagram-3"
              className="w-64"
            />
            <button className="rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Guardar mapeo</button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`${glassPanel} p-6 space-y-4 xl:col-span-2`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Plan de cuentas GALAC</p>
              <p className="text-lg font-semibold text-text-base">Selecciona y asigna</p>
            </div>
            <span className="rounded-2xl bg-glass-card px-4 py-2 text-sm text-text-muted">{mockPlan.length} cuentas detectadas</span>
          </div>

          <div className="space-y-3">
            {mockPlan.map((account) => {
              const assigned = assignments[account.id];
              const isSelected = assigned === selectedCategory;
              return (
                <div key={account.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-base">{account.id} · {account.name}</p>
                    <p className="text-xs text-text-muted">Saldo actual: {formatCurrency(account.balance)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">Destino</span>
                    <GlassSelect
                      value={assigned || selectedCategory}
                      options={erCategories}
                      onChange={(value) => handleAssign(account.id, value)}
                      placeholder="Categoria"
                      icon="bi bi-arrow-left-right"
                      className="w-56"
                    />
                    <button
                      type="button"
                      onClick={() => handleAssign(account.id, selectedCategory)}
                      className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                        isSelected ? 'bg-brand-secondary text-text-base' : 'border border-glass-border text-text-base hover:border-brand-secondary'
                      }`}
                    >
                      Asignar rapido
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Resumen de clasificacion</p>
          <div className="space-y-3">
            {summary.map((cat) => (
              <div key={cat.value} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-base">{cat.label}</p>
                  <p className="text-xs text-text-muted">{cat.count} cuentas</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-text-base">{formatCurrency(cat.total)}</p>
                  <p className="text-xs text-text-muted">Saldo asignado</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">Publicar mapeo</button>
        </div>
      </section>
    </div>
  );
};

export default AccountMappingPage;
