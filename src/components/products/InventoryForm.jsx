import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ErrorNotification from '../common/ErrorNotification';

const InventoryForm = ({
  productId,
  retailUnits = [],
  onSubmit,
  loading,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    retail_unit_id: '',
    serial_number: '',
    imei: '',
    cantidad: '1',
  });

  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (showErrorNotification) {
      setShowErrorNotification(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.retail_unit_id) {
      setErrorMessage('El campo Sucursal es obligatorio.');
      setShowErrorNotification(true);
      return;
    }

    if (!formData.serial_number) {
      setErrorMessage('El campo Número de Serie es obligatorio.');
      setShowErrorNotification(true);
      return;
    }

    const dataToSend = {
      product_id: Number(productId),
      retail_unit_id: Number(formData.retail_unit_id),
      product_inventory_status_id: 1,
      serial_number: formData.serial_number,
      imei: formData.imei,
      cantidad: Number(1),
    };

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto max-h-[70vh]">
      <ErrorNotification isOpen={showErrorNotification} message={errorMessage} />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="retail_unit_id" className="text-sm font-medium text-gray-700">Sucursal</label>
          <select
            id="retail_unit_id"
            name="retail_unit_id"
            value={formData.retail_unit_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          >
            <option value="">--Seleccionar--</option>
            {retailUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="serial_number" className="text-sm font-medium text-gray-700">Número de Serie</label>
          <input
            type="text"
            id="serial_number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: SN123456789"
            required
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col">
          <label htmlFor="imei" className="text-sm font-medium text-gray-700">IMEI</label>
          <input
            type="text"
            id="imei"
            name="imei"
            value={formData.imei}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: 123456789012345"
          />
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
          className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer text-sm"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;