import { useMemo, useState } from 'react';

const initialDevices = [
  { id: 'lap-01', name: 'Laptop Contabilidad', lastSeen: 'Hace 2h', location: 'Caracas', trusted: true },
  { id: 'tab-01', name: 'iPad Dirección', lastSeen: 'Hoy 08:14', location: 'Panamá', trusted: true },
  { id: 'mob-02', name: 'iPhone Tesorería', lastSeen: 'Ayer 22:41', location: 'Maracaibo', trusted: false },
  { id: 'desk-04', name: 'PC Oficina Norte', lastSeen: 'Hace 3 días', location: 'Bogotá', trusted: false },
];

const SecurityDevicesPage = () => {
  const [devices, setDevices] = useState(initialDevices);
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';

  const totals = useMemo(() => {
    const used = devices.length;
    const risky = devices.filter((d) => !d.trusted).length;
    return { used, risky, available: 30 - used };
  }, [devices]);

  const handleUnlink = (id) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left mb-4">
            <h1 className="text-3xl font-semibold text-text-base">Dispositivos vinculados</h1>
            <p className="text-sm text-text-muted">Controla los equipos con acceso y libera cupos si ves algo sospechoso.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-glass-card px-4 py-2 text-sm text-text-muted">Capacidad 30 dispositivos</span>
            
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { id: 'used', label: 'Dispositivos en uso', value: totals.used },
          { id: 'available', label: 'Cupos libres', value: totals.available },
          { id: 'alerts', label: 'Riesgos detectados', value: totals.risky },
        ].map((item) => (
          <div key={item.id} className={`${glassPanel} p-5 space-y-2`}>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{item.label}</p>
            <p className="text-3xl font-semibold text-text-base">{item.value}</p>
            <p className="text-xs text-text-muted">Actualizado en vivo</p>
          </div>
        ))}
      </section>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-text-base">Equipos autorizados</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-glass-border bg-glass-card-strong">
          <div className="grid grid-cols-4 gap-2 border-b border-glass-border px-4 py-3 text-xs uppercase tracking-[0.2em] text-text-muted">
            <span>Dispositivo</span>
            <span>Ultima conexion</span>
            <span>Ubicacion</span>
            <span className="text-right">Accion</span>
          </div>
          <div className="divide-y divide-glass-border">
            {devices.map((device) => (
              <div key={device.id} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-text-base">
                <div className="flex items-center gap-2">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${device.trusted ? 'bg-status-success-soft text-status-success' : 'bg-status-warning-soft text-status-warning'}`}>
                    <i className="bi bi-laptop" />
                  </span>
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-xs text-text-muted">ID {device.id}</p>
                  </div>
                </div>
                <span className="text-text-muted">{device.lastSeen}</span>
                <span className="text-text-muted">{device.location}</span>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleUnlink(device.id)}
                    className="rounded-xl border border-glass-border px-3 py-2 text-xs font-semibold text-text-base transition hover:border-brand-secondary"
                  >
                    Desvincular
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityDevicesPage;
