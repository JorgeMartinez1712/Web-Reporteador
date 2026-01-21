import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import WarningNotification from '../common/WarningNotification';

const RegisterBranchForm = ({
  onSubmit,
  loading,
  retailId,
  onCancel,
  financiers = [],
}) => {
  const [formData, setFormData] = useState({
    retail_id: retailId || '',
    name: '',
    address: '',
    phone: '',
    email: '',
    financiers_id: 1,
    status_id: 1,
  });

  const [showPhoneWarning, setShowPhoneWarning] = useState(false);

  useEffect(() => {
    if (retailId) {
      setFormData((prev) => ({ ...prev, retail_id: retailId }));
    }
  }, [retailId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (showPhoneWarning) {
      setShowPhoneWarning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      retail_id: Number(formData.retail_id),
      financiers_id: Number(formData.financiers_id),
      status_id: Number(formData.status_id),
    });
    setShowPhoneWarning(false);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto">
      <WarningNotification
        isOpen={showPhoneWarning}
        message="El número de teléfono solo debe contener dígitos."
        onClose={() => setShowPhoneWarning(false)}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: Sucursal Principal"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono</label>
          <PhoneInput
            country={'ve'}
            value={formData.phone}
            onChange={handlePhoneChange}
            containerClass="w-full"
            inputClass="!w-full p-2 !rounded-lg !h-10"
            buttonClass="!border !border-gray-300 !rounded-l-lg"
            inputProps={{
              name: 'phone',
              required: true,
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 resize-none"
            placeholder="Ej: Calle Las Flores, Edificio Sol, Piso 1"
            required
            rows="1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: sucursal@ejemplo.com"
            required
          />
        </div>
      </div>
      <div className="w-full flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleCancelClick}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer text-sm"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default RegisterBranchForm;