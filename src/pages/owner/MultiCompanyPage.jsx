import { useState } from 'react';

const analysts = [
  { value: 'ana-contreras', label: 'Ana Contreras' },
  { value: 'luis-perez', label: 'Luis Perez' },
  { value: 'mariana-ruiz', label: 'Mariana Ruiz' },
  { value: 'owner', label: 'Yo mismo' },
];

const initialCompanies = [
  { id: 'empresa-1', name: 'Inversiones Andina', rif: 'J-12345678-9', analyst: 'ana-contreras', planSlots: '1/3', color: 'bg-brand-secondary-soft' },
  { id: 'empresa-2', name: 'Servicios Delta', rif: 'J-87654321-0', analyst: 'luis-perez', planSlots: '2/3', color: 'bg-status-info-soft' },
  { id: 'empresa-3', name: 'Operadora Galac', rif: 'J-11223344-5', analyst: 'owner', planSlots: '3/5', color: 'bg-status-success-soft' },
];

const MultiCompanyPage = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const stats = [
    { id: 'cap', label: 'Empresas', value: '5' },
    { id: 'assigned', label: 'Analistas asignados', value: '3' },
    { id: 'pending', label: 'Invitaciones pendientes', value: '1' },
  ];

  const handleAssign = (companyId, analystValue) => {
    setCompanies((prev) => prev.map((c) => (c.id === companyId ? { ...c, analyst: analystValue } : c)));
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Multiempresa</h1>
            <p className="text-sm text-text-muted">Agrega empresas, asigna analistas y distribuye los cupos de tu plan.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-brand-secondary px-5 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft">
              Agregar empresa
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassPanel} p-6 space-y-4 lg:col-span-2`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-text-base text-left">Empresas permitidas por tu plan</p>
              <p className="text-sm text-text-muted">Cambia el analista asignado o sube el logo para cada empresa.</p>
            </div>
          </div>

          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${company.color} text-lg font-semibold text-text-base`}>
                      {company.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-base">{company.name}</p>
                      <p className="text-xs text-text-muted">RIF {company.rif}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Analistas</p>
                    <p className="text-sm font-semibold text-text-base">{company.planSlots.split('/')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Resumen de plan</p>
          <div className="space-y-3">
            {stats.map((item) => (
              <div key={item.id} className="rounded-2xl border border-glass-border bg-glass-card-strong p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-base">{item.label}</p>
                  <p className="text-xl font-semibold text-text-base">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MultiCompanyPage;
