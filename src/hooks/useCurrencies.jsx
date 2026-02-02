import { useState, useMemo, useCallback, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const defaultFilters = {
  query: '',
  status: 'all',
};

const normalizeCurrency = (currency) => {
  const statusValue = (currency?.status || 'activa').toString().toLowerCase();
  const translatedStatus = statusValue.includes('inac') ? 'inactiva' : 'activa';
  const rawId = currency?.id ?? currency?.uuid ?? currency?.code ?? `${currency?.name || 'currency'}-${currency?.country || 'global'}`;
  const lastUpdate = currency?.updated_at || currency?.updatedAt || currency?.last_update || currency?.synced_at;

  return {
    id: String(rawId),
    name: currency?.name || currency?.currency || currency?.label || currency?.code || 'Sin nombre',
    code: (currency?.code || '').toUpperCase(),
    country: currency?.country || currency?.origin || 'Global',
    symbol: currency?.symbol || currency?.sign || (currency?.code ? currency.code.slice(0, 1) : '$'),
    rate: Number(currency?.exchange_rate ?? currency?.rate ?? 1),
    variation: Number(currency?.variation ?? currency?.delta ?? 0),
    base: Boolean(currency?.is_base ?? currency?.base ?? false),
    status: translatedStatus,
    source: currency?.source || currency?.provider || 'Manual',
    updatedAt: lastUpdate || new Date().toISOString(),
  };
};

const useCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/currencies');
      const payload = response?.data?.data ?? response?.data ?? [];
      const parsed = Array.isArray(payload) ? payload : [];
      setCurrencies(parsed.map((item) => normalizeCurrency(item)));
    } catch (err) {
      setError(err?.friendlyMessage || 'No pudimos obtener la lista de monedas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const activeCurrencies = currencies.filter((currency) => currency.status === 'activa');
    const baseCurrency = currencies.find((currency) => currency.base);
    const lastUpdated = currencies.reduce((acc, currency) => {
      if (!currency.updatedAt) return acc;
      const timestamp = new Date(currency.updatedAt).getTime();
      return Number.isNaN(timestamp) ? acc : Math.max(acc, timestamp);
    }, 0);
    const highestVariation = currencies.reduce((acc, currency) => Math.max(acc, Math.abs(currency.variation)), 0);

    return {
      total: currencies.length,
      active: activeCurrencies.length,
      baseCode: baseCurrency?.code || 'N/D',
      lastUpdatedAt: lastUpdated ? new Date(lastUpdated).toISOString() : null,
      highestVariation,
    };
  }, [currencies]);

  const filteredCurrencies = useMemo(() => {
    const queryText = filters.query.trim().toLowerCase();
    return currencies.filter((currency) => {
      const matchesQuery = !queryText
        || currency.name.toLowerCase().includes(queryText)
        || currency.code.toLowerCase().includes(queryText)
        || currency.country.toLowerCase().includes(queryText);
      const matchesStatus = filters.status === 'all'
        || (filters.status === 'active' && currency.status === 'activa')
        || (filters.status === 'inactive' && currency.status === 'inactiva');
      return matchesQuery && matchesStatus;
    });
  }, [currencies, filters]);

  const openCreateModal = () => {
    setSelectedCurrency(null);
    setIsModalOpen(true);
  };

  const openEditModal = (currency) => {
    setSelectedCurrency(currency);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCurrency(null);
    setIsModalOpen(false);
  };

  const updateFilters = (nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  const saveCurrency = useCallback(
    async (payload) => {
      setSaving(true);
      setError(null);
      try {
        if (selectedCurrency) {
          await axiosInstance.put(`/currencies/${selectedCurrency.id}`, payload);
          setSuccessMessage('Moneda actualizada correctamente.');
        } else {
          await axiosInstance.post('/currencies', payload);
          setSuccessMessage('Moneda registrada correctamente.');
        }
        await fetchCurrencies();
        setSelectedCurrency(null);
        setIsModalOpen(false);
      } catch (err) {
        setError(err?.friendlyMessage || 'No pudimos guardar la moneda.');
      } finally {
        setSaving(false);
      }
    },
    [fetchCurrencies, selectedCurrency],
  );

  const deleteCurrency = useCallback(
    async (currency) => {
      if (!currency) return;
      setSaving(true);
      setError(null);
      try {
        await axiosInstance.delete(`/currencies/${currency.id}`);
        setSuccessMessage('Moneda eliminada correctamente.');
        await fetchCurrencies();
      } catch (err) {
        setError(err?.friendlyMessage || 'No pudimos eliminar la moneda seleccionada.');
      } finally {
        setSaving(false);
      }
    },
    [fetchCurrencies],
  );

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies: filteredCurrencies,
    rawCurrencies: currencies,
    loading,
    saving,
    error,
    successMessage,
    stats,
    filters,
    setFilters: updateFilters,
    refresh: fetchCurrencies,
    openCreateModal,
    openEditModal,
    closeModal,
    isModalOpen,
    selectedCurrency,
    saveCurrency,
    deleteCurrency,
    setSuccessMessage,
    setError,
  };
};

export default useCurrencies;
