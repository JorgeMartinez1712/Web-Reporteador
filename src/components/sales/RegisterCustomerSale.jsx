import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useCustomers from '../../hooks/useCustomers';
import WarningNotification from '../common/WarningNotification';
import ErrorNotification from '../common/ErrorNotification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const RegisterCustomerSale = ({ onCustomerCreated, onCancel, onShowSuccess }) => {
  const { registerCustomerOnly, loading, error, customerTypes, documentTypes } = useCustomers();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    customerTypeId: '',
    documentTypeId: '',
    documentNumber: '',
    birthDate: '',
  });

  const [selectedDocTypeCode, setSelectedDocTypeCode] = useState('');
  const [documentNumberError, setDocumentNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [filteredDocumentTypes, setFilteredDocumentTypes] = useState([]);

  useEffect(() => {
    if (customerTypes.length > 0 && !formData.customerTypeId) {
      setFormData(prev => ({ ...prev, customerTypeId: customerTypes[0].id }));
    }
  }, [customerTypes, formData.customerTypeId]);

  useEffect(() => {
    if (documentTypes.length > 0 && formData.customerTypeId) {
      const isNaturalCustomer = Number(formData.customerTypeId) === 1;
      let filteredDocs = documentTypes.filter(doc =>
        isNaturalCustomer ? ['V', 'E', 'P'].includes(doc.code) : ['J', 'G', 'C'].includes(doc.code)
      );

      if (isNaturalCustomer) {
        filteredDocs.sort((a, b) => {
          if (a.code === 'V') return -1;
          if (b.code === 'V') return 1;
          return 0;
        });
      }

      setFilteredDocumentTypes(filteredDocs);
      if (filteredDocs.length > 0) {
        const firstDocId = filteredDocs[0].id;
        setFormData(prev => ({ ...prev, documentTypeId: firstDocId }));
        setSelectedDocTypeCode(filteredDocs[0].code);
      }
    }
  }, [documentTypes, formData.customerTypeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name') {
      newValue = value.toUpperCase();
    } else if (name === 'documentNumber') {
      const re = /^[0-9-]*$/;
      if (!re.test(value)) {
        return;
      }
      setDocumentNumberError('');
    } else if (name === 'email') {
      if (emailError) {
        setEmailError('');
      }
    } else if (name === 'birthDate') {
      setBirthDateError('');
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleDocTypeChange = (e) => {
    const selectedId = e.target.value;
    const selectedDoc = documentTypes.find(type => type.id === parseInt(selectedId));
    if (selectedDoc) {
      setFormData(prev => ({ ...prev, documentTypeId: selectedDoc.id }));
      setSelectedDocTypeCode(selectedDoc.code);
      if (documentNumberError) {
        setDocumentNumberError('');
      }
    }
  };

  const handleCustomerTypeChange = (e) => {
    const selectedId = Number(e.target.value);
    setFormData(prev => ({ ...prev, customerTypeId: selectedId, documentNumber: '' }));
    setBirthDateError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isEighteenOrOlder = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const birthDateObj = new Date(dateString);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const documentNumberToSend = formData.documentNumber;
    const emailToSend = formData.email;
    const isNaturalCustomer = Number(formData.customerTypeId) === 1;

    if (!validateEmail(emailToSend)) {
      setEmailError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (isNaturalCustomer && !isEighteenOrOlder(formData.birthDate)) {
      setBirthDateError('El cliente debe ser mayor de 18 años.');
      return;
    }

    const documentRe = /^[0-9-]+$/;
    if (!documentRe.test(documentNumberToSend)) {
      setDocumentNumberError('El número de documento solo puede contener números y guiones.');
      return;
    }

    if (documentNumberToSend.length < 6 || documentNumberToSend.length > 10) {
      setDocumentNumberError('El número de documento debe tener entre 6 y 10 caracteres.');
      return;
    }

    try {
      const customerData = {
        customer_type_id: Number(formData.customerTypeId),
        full_name: formData.name,
        phone_number: formData.phone,
        email: emailToSend,
        address: formData.address,
        document_type_id: Number(formData.documentTypeId),
        document_number: documentNumberToSend,
        birth_date: formData.birthDate,
        status_id: 1,
      };

      const createdCustomerResponse = await registerCustomerOnly(customerData);

      if (createdCustomerResponse && onCustomerCreated) {
        onCustomerCreated();
      }

      if (onShowSuccess) {
        onShowSuccess('Cliente registrado exitosamente.');
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        customerTypeId: customerTypes[0]?.id || '',
        documentTypeId: documentTypes[0]?.id || '',
        documentNumber: '',
        birthDate: '',
      });
      setSelectedDocTypeCode(documentTypes[0]?.code || '');
      setDocumentNumberError('');
      setEmailError('');
      setBirthDateError('');
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        setApiError(Object.values(apiErrors).flat()[0]);
      } else {
        setApiError(err.response?.data?.message || 'Error al registrar el cliente. Intenta de nuevo.');
      }
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      customerTypeId: customerTypes[0]?.id || '',
      documentTypeId: documentTypes[0]?.id || '',
      documentNumber: '',
      birthDate: '',
    });
    setSelectedDocTypeCode(documentTypes[0]?.code || '');
    setDocumentNumberError('');
    setEmailError('');
    setApiError(null);
    setBirthDateError('');
  };

  const isNaturalCustomer = Number(formData.customerTypeId) === 1;
  const dateLabel = isNaturalCustomer ? 'Fecha de Nacimiento' : 'Fecha de Constitución de la Empresa';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto"
    >
      <WarningNotification
        isOpen={!!emailError || !!birthDateError}
        message={emailError || birthDateError}
        onClose={() => {
          setEmailError('');
          setBirthDateError('');
        }}
      />

      <ErrorNotification
        isOpen={!!apiError}
        message={apiError || error}
        onClose={() => setApiError(null)}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="customerTypeId" className="text-sm font-medium text-gray-700">
            Tipo de Cliente
          </label>
          <select
            id="customerTypeId"
            name="customerTypeId"
            value={formData.customerTypeId}
            onChange={handleCustomerTypeChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          >
            {customerTypes.length > 0 ? (
              customerTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))
            ) : (
              <option value="">Cargando...</option>
            )}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
            Tipo y Número de Documento
          </label>
          <div className="flex">
            <select
              id="documentTypeId"
              name="documentTypeId"
              value={formData.documentTypeId}
              onChange={handleDocTypeChange}
              className="border border-gray-300 rounded-l-lg p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              required
            >
              {filteredDocumentTypes.length > 0 ? (
                filteredDocumentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.code}
                  </option>
                ))
              ) : (
                <option value="">Cargando...</option>
              )}
            </select>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-r-lg p-2 w-full"
              placeholder="Ej: 12345678"
              maxLength="10"
              required
            />
          </div>
          {documentNumberError && <p className="text-red-500 text-sm mt-1">{documentNumberError}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: ANA MARÍA GARCÍA"
            maxLength="50"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Teléfono
          </label>
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
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: ana.garcia@example.com"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
            {dateLabel}
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
          {birthDateError && <p className="text-red-500 text-sm mt-1">{birthDateError}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Ej: Av. Principal, Edificio Central, Piso 5, Apto. 10, Ciudad"
            maxLength="100"
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

export default RegisterCustomerSale;