import { useMemo, useState } from 'react';
import GlassSelect from '../../components/common/GlassSelect';

const bcvFeed = { value: 36.52, updatedAt: '2026-02-13 09:00', source: 'BCV oficial' };

const roundingOptions = [
  { value: 'bancario', label: 'Redondeo bancario' },
  { value: 'arriba', label: 'Hacia arriba' },
  { value: 'abajo', label: 'Hacia abajo' },
  { value: 'nearest', label: '0.5 al par' },
];

const decimalOptions = [0, 2, 3, 4].map((value) => ({ value, label: `${value} decimales` }));

const initialCurrencies = [
  {
    id: 'ves',
    code: 'VES',
    name: 'Bolívar venezolano',
    symbol: 'Bs.',
    enabled: true,
    decimals: 2,
    rounding: 'bancario',
    rates: [
      { date: '2026-02-17', value: 36.52, source: 'BCV', published: true },
      { date: '2026-02-16', value: 36.28, source: 'BCV', published: true },
    ],
  },
  {
    id: 'usd',
    code: 'USD',
    name: 'Dólar estadounidense',
    symbol: '$',
    enabled: true,
    decimals: 2,
    rounding: 'nearest',
    rates: [
      { date: '2026-02-17', value: 1, source: 'Manual', published: true },
    ],
  },
  {
    id: 'eur',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    enabled: false,
    decimals: 3,
    rounding: 'arriba',
    rates: [
      { date: '2026-02-10', value: 0.92, source: 'Manual', published: false },
    ],
  },
];

const CurrencyPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(initialCurrencies[0].id);
  const [newCurrency, setNewCurrency] = useState({ code: 'COP', name: 'Peso colombiano', symbol: '$', decimals: 2, rounding: 'bancario' });
  const [rateForm, setRateForm] = useState({
    currencyId: initialCurrencies[0].id,
    date: '2026-02-18',
    value: '36.70',
    publish: true,
    decimals: initialCurrencies[0].decimals,
    rounding: initialCurrencies[0].rounding,
  });
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const selectedCurrency = currencies.find((item) => item.id === selectedCurrencyId);

  const stats = useMemo(() => {
    const publishedRates = currencies.reduce((acc, currency) => acc + currency.rates.filter((rate) => rate.published).length, 0);
    const activeCurrencies = currencies.filter((currency) => currency.enabled).length;
    return {
      publishedRates,
      activeCurrencies,
      lastBcv: bcvFeed,
    };
  }, [currencies]);

  const resetFeedback = () => setFeedback({ type: '', message: '' });

  const handleToggleCurrency = (id) => {
    resetFeedback();
    setCurrencies((prev) => prev.map((currency) => (currency.id === id ? { ...currency, enabled: !currency.enabled } : currency)));
  };

  const handleCurrencySettingChange = (id, field, value) => {
    resetFeedback();
    setCurrencies((prev) => prev.map((currency) => (currency.id === id ? { ...currency, [field]: value } : currency)));
    if (id === rateForm.currencyId && (field === 'decimals' || field === 'rounding')) {
      setRateForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCreateCurrency = () => {
    resetFeedback();
    const exists = currencies.some((currency) => currency.code.toUpperCase() === newCurrency.code.toUpperCase());
    if (exists) {
      setFeedback({ type: 'error', message: 'Ya existe una moneda con ese código.' });
      return;
    }

    const created = {
      id: newCurrency.code.toLowerCase(),
      code: newCurrency.code.toUpperCase(),
      name: newCurrency.name,
      symbol: newCurrency.symbol,
      enabled: true,
      decimals: newCurrency.decimals,
      rounding: newCurrency.rounding,
      rates: [],
    };

    setCurrencies((prev) => [...prev, created]);
    setSelectedCurrencyId(created.id);
    setRateForm((prev) => ({ ...prev, currencyId: created.id, decimals: created.decimals, rounding: created.rounding }));
    setFeedback({ type: 'success', message: 'Moneda creada. Configura decimales y registra su primera tasa.' });
  };

  const handleRateSubmit = () => {
    resetFeedback();
    const currency = currencies.find((item) => item.id === rateForm.currencyId);
    if (!currency) return;

    const duplicate = currency.rates.some((rate) => rate.date === rateForm.date);
    if (duplicate) {
      setFeedback({ type: 'error', message: 'Ya existe una tasa para esa fecha en esta moneda.' });
      return;
    }

    const nextRate = {
      date: rateForm.date,
      value: Number(rateForm.value),
      source: 'Manual',
      published: rateForm.publish,
      decimals: rateForm.decimals,
      rounding: rateForm.rounding,
    };

    setCurrencies((prev) => prev.map((item) => (item.id === currency.id ? { ...item, rates: [nextRate, ...item.rates] } : item)));
    setSelectedCurrencyId(currency.id);
    setFeedback({ type: 'success', message: rateForm.publish ? 'Tasa registrada y publicada para reportes.' : 'Tasa guardada como borrador.' });
  };

  const handlePublishToggle = (currencyId, date) => {
    resetFeedback();
    setCurrencies((prev) => prev.map((currency) => {
      if (currency.id !== currencyId) return currency;
      const rates = currency.rates.map((rate) => (rate.date === date ? { ...rate, published: !rate.published } : rate));
      return { ...currency, rates };
    }));
  };

  const handleSyncBcv = () => {
    resetFeedback();
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setRateForm((prev) => ({ ...prev, value: bcvFeed.value.toString(), source: 'BCV' }));
      setFeedback({ type: 'success', message: 'Tasa del día del BCV lista para publicar.' });
    }, 800);
  };

  const rateHistory = selectedCurrency?.rates || [];

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <div className="space-y-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-left mb-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-text-base">Gestión de monedas y tasas</h1>
            <p className="text-sm text-text-muted">Crea monedas, define reglas de decimales y publica tasas por fecha para conversiones multimoneda precisas.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSyncBcv}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold text-text-base transition flex items-center gap-2 ${syncing ? 'bg-brand-secondary/60' : 'bg-brand-secondary hover:bg-brand-secondary-soft'}`}
            >
              <i className="bi bi-cloud-download" />
              {syncing ? 'Sincronizando BCV...' : 'Traer tasa BCV'}
            </button>
           
          </div>
        </div>
      </div>

      {feedback.message && (
        <div className={`${glassPanel} border-l-4 ${feedback.type === 'error' ? 'border-glass-border' : 'border-brand-secondary'} p-4 flex items-center gap-3`}>
          <i className={`bi ${feedback.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-lg'} text-text-base`} />
          <p className="text-sm text-text-base">{feedback.message}</p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`${glassPanel} p-5 space-y-2`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Monedas activas</p>
          <p className="text-3xl font-semibold text-text-base">{stats.activeCurrencies}</p>
          <p className="text-xs text-text-muted">Disponible para cargar tasas y reportes</p>
        </div>
        <div className={`${glassPanel} p-5 space-y-2`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Tasas publicadas</p>
          <p className="text-3xl font-semibold text-text-base">{stats.publishedRates}</p>
          <p className="text-xs text-text-muted">Validadas para uso en conversión</p>
        </div>
        <div className={`${glassPanel} p-5 space-y-2`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Última tasa BCV</p>
          <p className="text-3xl font-semibold text-text-base">${bcvFeed.value}</p>
          <p className="text-xs text-text-muted">{bcvFeed.updatedAt}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`${glassPanel} p-6 space-y-5 xl:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-base">Habilita monedas y define decimales y redondeo</h2>
            </div>
            <div className="flex  text-xs text-text-muted">
              <i className="bi bi-shield-check" />
              <span>Las tasas publicadas se usan en todo el sistema</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currencies.map((currency) => (
              <div key={currency.id} className="rounded-3xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-text-muted">{currency.code}</p>
                    <p className="text-lg font-semibold text-text-base">{currency.name}</p>
                    <p className="text-xs text-text-muted">Símbolo {currency.symbol}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCurrency(currency.id)}
                    className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${currency.enabled ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-muted hover:text-text-base'}`}
                  >
                    {currency.enabled ? 'Habilitada' : 'Deshabilitada'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <GlassSelect
                    value={currency.decimals}
                    options={decimalOptions}
                    onChange={(value) => handleCurrencySettingChange(currency.id, 'decimals', value)}
                    placeholder="Decimales"
                    className="w-full"
                  />
                  <GlassSelect
                    value={currency.rounding}
                    options={roundingOptions}
                    onChange={(value) => handleCurrencySettingChange(currency.id, 'rounding', value)}
                    placeholder="Regla de redondeo"
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-dashed border-glass-border bg-glass-card px-4 py-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-broadcast" />
                    <span>{currency.rates.filter((rate) => rate.published).length} tasas publicadas</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrencyId(currency.id)}
                    className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary/80"
                  >
                    Ver tasas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Nueva moneda</p>
          <div className="space-y-3">
            <input
              type="text"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency((prev) => ({ ...prev, code: e.target.value }))}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="Código (ej. COP)"
            />
            <input
              type="text"
              value={newCurrency.name}
              onChange={(e) => setNewCurrency((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="Nombre de la moneda"
            />
            <input
              type="text"
              value={newCurrency.symbol}
              onChange={(e) => setNewCurrency((prev) => ({ ...prev, symbol: e.target.value }))}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="Símbolo"
            />
            <GlassSelect
              value={newCurrency.decimals}
              options={decimalOptions}
              onChange={(value) => setNewCurrency((prev) => ({ ...prev, decimals: value }))}
              placeholder="Decimales"
              className="w-full"
            />
            <GlassSelect
              value={newCurrency.rounding}
              options={roundingOptions}
              onChange={(value) => setNewCurrency((prev) => ({ ...prev, rounding: value }))}
              placeholder="Regla de redondeo"
              className="w-full"
            />
            <p className="text-xs text-text-muted">Se validará el código para evitar duplicados.</p>
          </div>
          <button
            type="button"
            onClick={handleCreateCurrency}
            className="w-full rounded-2xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
          >
            Guardar moneda
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${glassPanel} p-6 space-y-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Registrar tasa</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <GlassSelect
              value={rateForm.currencyId}
              options={currencies.map((currency) => ({ value: currency.id, label: `${currency.code} · ${currency.name}` }))}
              onChange={(value) => {
                const currency = currencies.find((item) => item.id === value);
                setRateForm((prev) => ({
                  ...prev,
                  currencyId: value,
                  decimals: currency?.decimals || prev.decimals,
                  rounding: currency?.rounding || prev.rounding,
                }));
                setSelectedCurrencyId(value);
              }}
              placeholder="Moneda"
              className="w-full"
            />
            <input
              type="date"
              value={rateForm.date}
              onChange={(e) => setRateForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
            <input
              type="number"
              value={rateForm.value}
              onChange={(e) => setRateForm((prev) => ({ ...prev, value: e.target.value }))}
              className="w-full rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="Tasa de cambio"
            />
            <GlassSelect
              value={rateForm.rounding}
              options={roundingOptions}
              onChange={(value) => setRateForm((prev) => ({ ...prev, rounding: value }))}
              placeholder="Regla de redondeo"
              className="w-full"
            />
            <GlassSelect
              value={rateForm.decimals}
              options={decimalOptions}
              onChange={(value) => setRateForm((prev) => ({ ...prev, decimals: value }))}
              placeholder="Decimales"
              className="w-full"
            />
            <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-base">Publicar en el sistema</p>
                <p className="text-xs text-text-muted">Dejar en borrador si aún no está validada.</p>
              </div>
              <button
                type="button"
                onClick={() => setRateForm((prev) => ({ ...prev, publish: !prev.publish }))}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${rateForm.publish ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-muted'}`}
              >
                {rateForm.publish ? 'Publicada' : 'Borrador'}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <i className="bi bi-info-circle" />
              <span>Validamos una sola tasa por fecha y moneda.</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRateForm((prev) => ({ ...prev, value: bcvFeed.value }))}
                className="rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm font-semibold text-text-base transition hover:bg-glass-card-strong"
              >
                Usar tasa BCV
              </button>
              <button
                type="button"
                onClick={handleRateSubmit}
                className="rounded-2xl bg-brand-secondary px-5 py-3 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
              >
                Registrar tasa
              </button>
            </div>
          </div>
        </div>

        <div className={`${glassPanel} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Tasas por moneda</p>
              <h2 className="text-lg font-semibold text-text-base">Publicar o deshabilitar tasas duplicadas</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <i className="bi bi-calendar-check" />
              <span>{selectedCurrency?.code || 'Moneda'}</span>
            </div>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {rateHistory.length === 0 && (
              <div className="rounded-2xl border border-dashed border-glass-border bg-glass-card-strong px-4 py-3 text-sm text-text-muted">
                Aún no hay tasas registradas para esta moneda.
              </div>
            )}
            {rateHistory.map((rate) => (
              <div key={`${rate.date}-${rate.value}`} className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-base">{rate.date}</p>
                    <p className="text-xs text-text-muted">Origen {rate.source} · {rate.rounding || selectedCurrency?.rounding} · {rate.decimals ?? selectedCurrency?.decimals} decimales</p>
                  </div>
                  <span className="text-lg font-semibold text-text-base">{rate.value}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-shield-check" />
                    <span>{rate.published ? 'Publicada para reportes' : 'Borrador interno'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePublishToggle(selectedCurrencyId, rate.date)}
                    className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${rate.published ? 'bg-brand-secondary text-text-base' : 'border border-glass-border bg-glass-card text-text-base'}`}
                  >
                    {rate.published ? 'Retirar publicación' : 'Publicar'}
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

export default CurrencyPage;
