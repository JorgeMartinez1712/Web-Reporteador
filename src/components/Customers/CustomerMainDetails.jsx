import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomerMainDetails = ({
  customer,
  formData,
  handleChange,
  customerTypes,
  documentTypes,
  customerStatuses,
  isEditing,
}) => {
  const getCustomerTypeName = (id) => {
    const type = customerTypes.find(type => type.id === id);
    return type ? type.name : 'Desconocido';
  };

  const handlePhoneChange = (value) => {
    handleChange({
      target: {
        name: 'phone_number',
        value: value
      }
    });
  };

  const handleFullNameChange = (e) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: value.toUpperCase()
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div>
        <label htmlFor="customer_type_id" className="block text-sm font-medium text-gray-700 text-left">Tipo de Cliente</label>
        <input
          type="text"
          id="customer_type_id"
          name="customer_type_id"
          value={getCustomerTypeName(customer.customer_type_id)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 sm:text-sm"
          disabled
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="document_number" className="block text-sm font-medium text-gray-700 text-left">Tipo y Número de Documento</label>
        <div className="flex mt-1">
          <select
            id="document_type_id"
            name="document_type_id"
            value={customer.document_type_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-100"
            disabled
          >
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.code}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="document_number"
            name="document_number"
            value={customer.document_number}
            className="flex-1 border border-gray-300 rounded-r-md shadow-sm p-2 bg-gray-100 sm:text-sm"
            disabled
          />
        </div>
      </div>
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 text-left">Nombre Completo</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleFullNameChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm uppercase"
          maxLength="50"
          required
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 text-left">Teléfono</label>
        <PhoneInput
          country={'ve'}
          value={formData.phone_number}
          onChange={handlePhoneChange}
          containerClass="w-full"
          inputClass="!w-full p-2 !rounded-lg !h-10"
          buttonClass="!border !border-gray-300 !rounded-l-lg"
          inputProps={{
            name: 'phone_number',
            required: true,
            disabled: !isEditing,
          }}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="ejemplo@correo.com"
          maxLength="50"
          required
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 text-left">Fecha de Nacimiento</label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          required
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left">Dirección</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Ingrese la dirección"
          maxLength="100"
          required
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor="customer_status_id" className="block text-sm font-medium text-gray-700 text-left">Estado del Cliente</label>
        <select
          id="customer_status_id"
          name="customer_status_id"
          value={formData.customer_status_id}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          required
          disabled={!isEditing}
        >
          {customerStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomerMainDetails;