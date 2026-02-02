import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/common/DataTable';
import ErrorNotification from '../components/common/ErrorNotification';
import SuccessNotification from '../components/common/SuccessNotification';
import CustomModal from '../components/common/CustomModal';
import GlassSelect from '../components/common/GlassSelect';

const mockCurrencies = [
  {
    id: 'usd',
    name: 'Dólar estadounidense',
    code: 'USD',
    country: 'Estados Unidos',
    symbol: '$',
    rate: 36.52,
    variation: 0.42,
    base: true,
    status: 'activa',
    source: 'Integración BCV',
    updatedAt: '2026-02-01T10:05:00Z',
  },
  {
    id: 'eur',
    name: 'Euro',
    code: 'EUR',
    country: 'Unión Europea',
    symbol: '€',
    rate: 39.11,
    variation: -0.15,
    base: false,
    status: 'activa',
    source: 'Manual tesorería',
    updatedAt: '2026-02-01T08:40:00Z',
  },
  {
    id: 'cop',
    name: 'Peso colombiano',
    code: 'COP',
    country: 'Colombia',
    symbol: '$',
    rate: 0.0093,
    variation: 0.67,
    base: false,
    status: 'activa',
    source: 'GALAC',
    updatedAt: '2026-01-31T18:12:00Z',
  },
  {
    id: 'brl',
    name: 'Real brasileño',
    code: 'BRL',
    country: 'Brasil',
    symbol: 'R$',
    rate: 7.11,
    variation: 0,
    base: false,
    status: 'inactiva',
    source: 'Integración BCV',
    updatedAt: '2026-01-30T14:22:00Z',
  },
  {
    id: 'ars',
    name: 'Peso argentino',
    code: 'ARS',
    country: 'Argentina',
    symbol: '$',
    rate: 0.034,
    variation: 1.12,
    base: false,
    status: 'activa',
    source: 'Integración BCV',
    updatedAt: '2026-01-29T09:15:00Z',
  },
  {
    id: 'clp',
    name: 'Peso chileno',
    code: 'CLP',
    country: 'Chile',
    symbol: '$',
    rate: 0.036,
    variation: -0.45,
    base: false,
    status: 'activa',
    source: 'Manual tesorería',
    updatedAt: '2026-01-28T17:42:00Z',
  },
  {
    id: 'mxn',
    name: 'Peso mexicano',
    code: 'MXN',
    country: 'México',
    symbol: '$',
    rate: 2.12,
    variation: 0.21,
    base: false,
    status: 'activa',
    source: 'GALAC',
    updatedAt: '2026-01-27T12:05:00Z',
  },
  {
    id: 'pen',
    name: 'Sol peruano',
    code: 'PEN',
    country: 'Perú',
    symbol: 'S/',
    rate: 9.44,
    variation: 0.09,
    base: false,
    status: 'activa',
    source: 'Integración BCV',
    updatedAt: '2026-01-26T07:58:00Z',
  },
  {
    id: 'ves',
    name: 'Bolívar digital',
    code: 'VES',
    country: 'Venezuela',
    symbol: 'Bs',
    rate: 1,
    variation: 0,
    base: false,
    status: 'activa',
    source: 'BCV',
    updatedAt: '2026-01-26T05:00:00Z',
  },
  {
    id: 'cop-2',
    name: 'Peso colombiano mayorista',
    code: 'COPM',
    country: 'Colombia',
    symbol: '$',
    rate: 0.0091,
    variation: 0.22,
    base: false,
    status: 'activa',
    source: 'GALAC',
    updatedAt: '2026-01-25T18:12:00Z',
  },
  {
    id: 'uyu',
    name: 'Peso uruguayo',
    code: 'UYU',
    country: 'Uruguay',
    symbol: '$',
    rate: 0.89,
    variation: -0.32,
    base: false,
    status: 'activa',
    source: 'Manual tesorería',
    updatedAt: '2026-01-24T10:45:00Z',
  },
  {
    id: 'pyg',
    name: 'Guaraní paraguayo',
    code: 'PYG',
    country: 'Paraguay',
    symbol: '₲',
    rate: 0.0049,
    variation: 0.05,
    base: false,
    status: 'activa',
    source: 'Integración BCV',
    updatedAt: '2026-01-23T14:33:00Z',
  },
  {
    id: 'bob',
    name: 'Boliviano',
    code: 'BOB',
    country: 'Bolivia',
    symbol: 'Bs',
    rate: 5.32,
    variation: 0,
    base: false,
    status: 'activa',
    source: 'Manual tesorería',
    updatedAt: '2026-01-22T16:27:00Z',
  },
];

const initialFilters = { query: '', status: 'all' };

const emptyForm = {
  name: '',
  code: '',
  country: '',
  symbol: '',
  rate: '1',
  variation: '0',
  source: 'Manual',
  status: 'activa',
  base: false,
};

const CurrenciesPage = () => {
  const [currencies, setCurrencies] = useState(mockCurrencies);
  const [filters, setFilters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!successMessage) return undefined;
    const timeout = setTimeout(() => setSuccessMessage(''), 3500);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const rateFormatter = useMemo(
    () => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
    [],
  );

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }),
    [],
  );

  const filteredCurrencies = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return currencies.filter((currency) => {
      const matchesQuery = !query
        || currency.name.toLowerCase().includes(query)
        || currency.code.toLowerCase().includes(query)
        || currency.country.toLowerCase().includes(query);
      const matchesStatus = filters.status === 'all'
        || (filters.status === 'active' && currency.status === 'activa')
        || (filters.status === 'inactive' && currency.status === 'inactiva');
      return matchesQuery && matchesStatus;
    });
  }, [currencies, filters]);

  const stats = useMemo(() => {
    const total = currencies.length;
    const active = currencies.filter((currency) => currency.status === 'activa').length;
    const baseCurrency = currencies.find((currency) => currency.base);
    const lastUpdated = currencies.reduce((latest, currency) => {
      if (!currency.updatedAt) return latest;
      const timestamp = new Date(currency.updatedAt).getTime();
      if (Number.isNaN(timestamp)) return latest;
      return Math.max(latest, timestamp);
    }, 0);
    const highestVariation = currencies.reduce(
      (max, currency) => Math.max(max, Math.abs(currency.variation || 0)),
      0,
    );

    return {
      total,
      active,
      baseCode: baseCurrency?.code || 'N/D',
      highestVariation,
      lastUpdatedAt: lastUpdated ? new Date(lastUpdated).toISOString() : null,
    };
  }, [currencies]);

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Moneda',
        flex: 1.1,
        minWidth: 180,
        renderCell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-text-base">{row.name}</span>
            <span className="text-xs text-text-muted">{row.country}</span>
          </div>
        ),
      },
      {
        field: 'code',
        headerName: 'Código',
        flex: 0.7,
        minWidth: 120,
        renderCell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-glass-border bg-glass-card px-2 py-1 text-xs font-semibold uppercase text-text-base">
              {row.code}
            </span>
            <span className="text-sm text-text-muted">{row.symbol}</span>
          </div>
        ),
      },
      {
        field: 'rate',
        headerName: 'Tipo de cambio',
        flex: 0.8,
        minWidth: 140,
        renderCell: ({ value }) => (
          <span className="text-sm font-semibold text-text-base">{rateFormatter.format(Number(value) || 0)}</span>
        ),
      },
      {
        field: 'variation',
        headerName: 'Variación',
        flex: 0.7,
        minWidth: 120,
        renderCell: ({ value }) => {
          const variationValue = Number(value) || 0;
          const tone = variationValue >= 0
            ? 'bg-status-success-soft text-status-success border border-status-success/60'
            : 'bg-status-warning-soft text-status-warning border border-status-warning/60';
          const sign = variationValue >= 0 ? '+' : '';
          return (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
              {`${sign}${variationValue.toFixed(2)}%`}
            </span>
          );
        },
      },
      {
        field: 'base',
        headerName: 'Rol',
        flex: 0.6,
        minWidth: 110,
        renderCell: ({ value }) => (
          value ? (
            <span className="rounded-full bg-brand-primary-soft px-3 py-1 text-xs font-semibold text-brand-primary">
              Referencia
            </span>
          ) : (
            <span className="text-xs text-text-muted">Secundaria</span>
          )
        ),
      },
      {
        field: 'status',
        headerName: 'Estado',
        flex: 0.7,
        minWidth: 130,
        renderCell: ({ value }) => {
          const isActive = value === 'activa';
          const styles = isActive
            ? 'bg-status-success-soft text-status-success border border-status-success/60'
            : 'bg-glass-card text-text-muted border border-glass-border';
          return (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
              {isActive ? 'Activa' : 'Inactiva'}
            </span>
          );
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Actualizada',
        flex: 0.9,
        minWidth: 160,
        renderCell: ({ value }) => (
          <span className="text-xs text-text-muted">
            {value ? dateFormatter.format(new Date(value)) : 'Sin registro'}
          </span>
        ),
      },
    ],
    [dateFormatter, rateFormatter],
  );

  const handleFilterChange = (nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrencies((prev) => prev.map((currency) => ({
        ...currency,
        updatedAt: new Date().toISOString(),
      })));
      setLoading(false);
      setSuccessMessage('Tipos de cambio sincronizados.');
    }, 900);
  };

  const openCreateModal = () => {
    setSelectedCurrency(null);
    setFormValues({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (row) => {
    setSelectedCurrency(row);
    setFormValues({
      ...emptyForm,
      ...row,
      rate: String(row.rate ?? '1'),
      variation: String(row.variation ?? '0'),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'rate' || name === 'variation') {
      setFormValues((prev) => ({ ...prev, [name]: value }));
      return;
    }
    if (name === 'code') {
      setFormValues((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleBase = (event) => {
    setFormValues((prev) => ({ ...prev, base: event.target.checked }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...formValues,
      rate: Number(formValues.rate) || 1,
      variation: Number(formValues.variation) || 0,
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setCurrencies((prev) => {
        if (selectedCurrency) {
          const updatedList = prev.map((currency) => (
            currency.id === selectedCurrency.id ? { ...currency, ...payload } : currency
          ));
          if (payload.base) {
            return updatedList.map((currency) => ({
              ...currency,
              base: currency.id === selectedCurrency.id,
            }));
          }
          return updatedList;
        }

        const newCurrency = {
          ...payload,
          id: `currency-${Date.now()}`,
        };
        const nextList = [newCurrency, ...prev];
        if (payload.base) {
          return nextList.map((currency) => ({
            ...currency,
            base: currency.id === newCurrency.id,
          }));
        }
        return nextList;
      });

      setSaving(false);
      setSuccessMessage(selectedCurrency ? 'Moneda actualizada.' : 'Moneda registrada.');
      setIsModalOpen(false);
      setSelectedCurrency(null);
      setFormValues({ ...emptyForm });
    }, 800);
  };

  const handleDelete = (row) => {
    setCurrencies((prev) => prev.filter((currency) => currency.id !== row.id));
    setSuccessMessage('Moneda eliminada.');
  };

  const lastUpdateLabel = stats.lastUpdatedAt
    ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(stats.lastUpdatedAt))
    : 'Sin sincronización reciente';

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-text-muted flex">Dominios monetarios</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold flex">Gestión de monedas</h1>
            <p className="text-sm text-text-muted mb-4">Controla los tipos de cambio que alimentan los reportes automatizados.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:bg-brand-secondary"
          >
            <i className="bi bi-plus-circle" />
            Registrar moneda
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Monedas registradas</p>
          <p className="text-2xl font-semibold text-text-base">{stats.total}</p>
          <p className="text-xs text-text-muted">Disponibles para aplicar en reportes</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Monedas activas</p>
          <p className="text-2xl font-semibold text-text-base">{stats.active}</p>
          <p className="text-xs text-text-muted">Habilitadas en cálculos y plantillas</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Moneda base</p>
          <p className="text-2xl font-semibold text-text-base">{stats.baseCode}</p>
          <p className="text-xs text-text-muted">Referencial contable para cascadas</p>
        </div>
        <div className="glass-elevation rounded-2xl border border-glass-border bg-glass-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Variación máxima 24h</p>
          <p className="text-2xl font-semibold text-text-base">{stats.highestVariation.toFixed(2)}%</p>
          <p className="text-xs text-text-muted">{lastUpdateLabel}</p>
        </div>
      </section>

      <section className="glass-elevation rounded-3xl border border-glass-border bg-glass-card p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 w-full lg:flex-row lg:items-center">
            <div className="relative w-full lg:w-72">
              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                name="query"
                value={filters.query}
                onChange={(event) => handleFilterChange({ query: event.target.value })}
                placeholder="Buscar por código, país o moneda"
                className="w-full rounded-2xl border border-glass-border bg-glass-card py-3 pl-11 pr-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="flex items-center gap-2">
              <GlassSelect
                value={filters.status}
                onChange={(value) => handleFilterChange({ status: value })}
                options={[
                  { value: 'all', label: 'Todas las monedas' },
                  { value: 'active', label: 'Solo activas' },
                  { value: 'inactive', label: 'Solo inactivas' },
                ]}
                icon="bi bi-funnel"
                buttonClassName="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base"
              />
            </div>
            <p className="text-xs text-text-muted lg:ml-4">Última sincronización: {lastUpdateLabel}</p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-5 py-3 text-sm font-semibold text-text-base transition hover:border-brand-secondary disabled:opacity-60"
            >
              <i className="bi bi-arrow-repeat text-base" />
              Actualizar
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand-primary text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-brand-primary/30 transition hover:bg-brand-secondary"
            >
              <i className="bi bi-plus-lg" />
              Nueva moneda
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-text-muted">
            <span className="flex items-center gap-3">
              <span className="h-3 w-3 animate-ping rounded-full bg-brand-secondary" />
              Actualizando tipos de cambio...
            </span>
          </div>
        ) : (
          <DataTable
            rows={filteredCurrencies}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </section>

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCurrency ? 'Editar moneda' : 'Registrar nueva moneda'}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Nombre</label>
              <input
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Código</label>
              <input
                name="code"
                value={formValues.code}
                onChange={handleInputChange}
                required
                maxLength={5}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">País o región</label>
              <input
                name="country"
                value={formValues.country}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Símbolo</label>
              <input
                name="symbol"
                value={formValues.symbol}
                onChange={handleInputChange}
                maxLength={3}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Tipo de fuente</label>
              <input
                name="source"
                value={formValues.source}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Estado</label>
              <GlassSelect
                value={formValues.status}
                onChange={(value) => setFormValues((prev) => ({ ...prev, status: value }))}
                options={[
                  { value: 'activa', label: 'Activa' },
                  { value: 'inactiva', label: 'Inactiva' },
                ]}
                buttonClassName="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Tipo de cambio</label>
              <input
                name="rate"
                type="number"
                step="0.0001"
                value={formValues.rate}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-text-muted">Variación %</label>
              <input
                name="variation"
                type="number"
                step="0.01"
                value={formValues.variation}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-text-base">Usar como moneda base</p>
              <p className="text-xs text-text-muted">Esta moneda se aplicará como referencia para reportes.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formValues.base}
                onChange={handleToggleBase}
                className="peer sr-only"
              />
              <span className="block h-6 w-11 rounded-full bg-text-muted transition-all peer-checked:bg-brand-secondary"></span>
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto rounded-2xl border border-glass-border bg-transparent px-6 py-3 text-sm font-semibold text-text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:bg-brand-secondary disabled:opacity-60"
            >
              {saving ? 'Guardando...' : selectedCurrency ? 'Actualizar moneda' : 'Registrar moneda'}
            </button>
          </div>
        </form>
      </CustomModal>

      <ErrorNotification
        isOpen={Boolean(error)}
        message={error || ''}
        onClose={() => setError('')}
      />
      <SuccessNotification
        isOpen={Boolean(successMessage)}
        message={successMessage}
      />
    </div>
  );
};

export default CurrenciesPage;
