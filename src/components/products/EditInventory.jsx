import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ErrorNotification from '../common/ErrorNotification';

const EditInventory = ({
  inventory,
  retailUnits = [],
  onSave,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    sucursalId: '',
  });

  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isRetailUnitsEmpty = retailUnits.length === 0;

  useEffect(() => {
    if (inventory) {
      const sucursalId = inventory.retailuniid ?? inventory.retail_unit_id ?? inventory.retailUnitId ?? inventory.retail_unit ?? '';
      setFormData({
        sucursalId: sucursalId ? String(sucursalId) : '',
      });
    }
  }, [inventory]);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, sucursalId: value }));
    if (showErrorNotification) {
      setShowErrorNotification(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sucursalId) {
      setErrorMessage('El campo Sucursal es obligatorio.');
      setShowErrorNotification(true);
      return;
    }

    const dataToSend = {
      id: Number(inventory.id),
      sucursalId: Number(formData.sucursalId),
    };

    try {
      await onSave(dataToSend);
      onCancel();
    } catch (error) {
      setShowErrorNotification(true);
      setErrorMessage(error.response?.data?.message || 'Error al actualizar el dispositivo. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto max-h-[70vh]">
      <ErrorNotification isOpen={showErrorNotification} message={errorMessage} />
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="sucursalId" className="text-sm font-medium text-gray-700">
            Sucursal
          </label>
          {isRetailUnitsEmpty ? (
            <div className="border border-yellow-300 bg-yellow-100 text-yellow-700 p-2 rounded-lg text-sm">
              No hay sucursales disponibles para asignar.
            </div>
          ) : (
            <select
              id="sucursalId"
              name="sucursalId"
              value={formData.sucursalId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
              disabled={loading}
            >
              <option value="">Seleccione una sucursal</option>
              {retailUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className='w-full flex justify-end gap-2 mt-4'>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || isRetailUnitsEmpty}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default EditInventory;