import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCustomers from '../../hooks/useCustomers';
import CustomerHeader from '../../components/Customers/CustomerHeader';
import CustomerDetailForm from '../../components/Customers/CustomerDetailForm';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';

const DetailCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    customerTypes,
    documentTypes,
    customerStatuses,
    fetchCustomerDetails,
    updateCustomer,
    fetchCustomerScoring,
  } = useCustomers();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    birth_date: '',
    password: '',
    password_confirmation: '',
    customer_status_id: '',
  });

  const [passwordValidations, setPasswordValidations] = useState({
    hasUpperCase: true,
    hasNumber: true,
    minLength: true,
    passwordsMatch: true,
  });
  const [passwordTouched, setPasswordTouched] = useState(false);

  const loadCustomerData = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    setShowErrorNotification(false);
    try {
      const customerIdNum = parseInt(id);
      const details = await fetchCustomerDetails(customerIdNum);
      if (details) {
        setCustomer(details);
        setFormData({
          full_name: details.full_name || '',
          email: details.email || '',
          phone_number: details.phone_number || '',
          address: details.address || '',
          birth_date: details.birth_date ? details.birth_date.split('T')[0] : '',
          password: '',
          password_confirmation: '',
          customer_status_id: details.status_id || '',
        });
      } else {
        navigate('/404', { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al cargar los detalles del cliente.');
      setShowErrorNotification(true);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, fetchCustomerDetails]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  const validatePassword = useCallback((passwordValue, confirmPasswordValue) => {
    const validations = {
      hasUpperCase: /[A-Z]/.test(passwordValue),
      hasNumber: /\d/.test(passwordValue),
      minLength: passwordValue.length >= 8,
    };
    const passwordsMatch = passwordValue === confirmPasswordValue;
    setPasswordValidations((prev) => ({
      ...prev,
      ...validations,
      passwordsMatch: passwordsMatch,
    }));
    return Object.values(validations).every(Boolean) && passwordsMatch;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'password' || name === 'password_confirmation') {
        setPasswordTouched(true);
        validatePassword(newFormData.password, newFormData.password_confirmation);
      }
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);

    if (passwordTouched && formData.password) {
      if (!validatePassword(formData.password, formData.password_confirmation)) {
        setErrorMessage('Por favor, asegúrate de que la nueva contraseña cumpla con todos los requisitos.');
        setShowErrorNotification(true);
        setSaveLoading(false);
        return;
      }
    }

    const dataToSave = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      birth_date: formData.birth_date,
      status_id: Number(formData.customer_status_id),
    };

    if (passwordTouched && formData.password) {
      dataToSave.password = formData.password;
      dataToSave.password_confirmation = formData.password_confirmation;
    }

    try {
      await updateCustomer(id, dataToSave);
      setIsEditing(false);
      setPasswordTouched(false);
      setSuccessMessage('¡Cliente actualizado con éxito!');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      await loadCustomerData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al actualizar el cliente. Inténtalo de nuevo.');
      setShowErrorNotification(true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || '',
        email: customer.email || '',
        phone_number: customer.phone_number || '',
        address: customer.address || '',
        birth_date: customer.birth_date ? customer.birth_date.split('T')[0] : '',
        password: '',
        password_confirmation: '',
        customer_status_id: customer.status_id || '',
      });
    }
    setPasswordValidations({
      hasUpperCase: true,
      hasNumber: true,
      minLength: true,
      passwordsMatch: true,
    });
    setPasswordTouched(false);
    setIsEditing(false);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);
  };

  const handleVerifyIdentity = () => {
    setShowVerifyModal(true);
  };

  const isSaveDisabled = passwordTouched && !(
    passwordValidations.hasUpperCase &&
    passwordValidations.hasNumber &&
    passwordValidations.minLength &&
    passwordValidations.passwordsMatch
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const currentLevel = customer.levels && customer.levels.length > 0 ? customer.levels[0] : null;
  const pivot = currentLevel && currentLevel.pivot ? currentLevel.pivot : null;
  const creditTotal = pivot && pivot.credit ? Number(pivot.credit) : 0;
  const creditDisponible = pivot && pivot.credit_available ? Number(pivot.credit_available) : 0;
  const creditUsado = creditTotal - creditDisponible;
  const porcentajeDisponible = creditTotal > 0 ? (creditDisponible / creditTotal) * 100 : 0;
  const totalDeuda = customer.deuda_actual && typeof customer.deuda_actual.total_debt === 'number'
    ? customer.deuda_actual.total_debt
    : 0;

  return (
    <div className="p-8">
      <CustomerHeader
        customerName={customer.full_name}
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSubmit}
        onCancelClick={handleCancelEdit}
        onVerifyClick={handleVerifyIdentity}
        saveLoading={saveLoading}
        isSaveDisabled={isSaveDisabled}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white flex flex-col gap-2 rounded-xl border border-gray-200 border-l-4 border-l-emerald-500 px-6 py-4 text-left">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <i className="bi bi-cash-coin text-emerald-500" />
            <span>Línea de Financiamiento</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            ${creditTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-gray-500">Límite de crédito total</p>
        </div>

        <div className="bg-white flex flex-col gap-1.5 rounded-xl border border-gray-200 border-l-4 border-l-sky-500 px-4 py-3 text-left">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <i className="bi bi-graph-up text-sky-500" />
            <span>Deuda actual</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            ${totalDeuda.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-0.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full bg-sky-500"
              style={{ width: `${Math.min(Math.max(creditTotal > 0 ? (totalDeuda / creditTotal) * 100 : 0, 0), 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Relación entre deuda actual y línea de crédito</p>
        </div>

        <div className="bg-white flex flex-col gap-1.5 rounded-xl border border-gray-200 border-l-4 border-l-emerald-600 px-4 py-3 text-left">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <i className="bi bi-credit-card text-emerald-600" />
            <span>% Disponible</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {porcentajeDisponible.toFixed(1)}%
          </div>
          <div className="mt-0.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${Math.min(Math.max(porcentajeDisponible, 0), 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Porcentaje de crédito aún disponible</p>
        </div>
      </div>

      <ErrorNotification isOpen={showErrorNotification} message={errorMessage} onClose={() => setShowErrorNotification(false)} />
      <SuccessNotification isOpen={showSuccessNotification} message={successMessage} onClose={() => setShowSuccessNotification(false)} />

      <CustomerDetailForm
        customer={customer}
        formData={formData}
        handleChange={handleChange}
        customerTypes={customerTypes}
        documentTypes={documentTypes}
        customerStatuses={customerStatuses}
        fetchScoring={fetchCustomerScoring}
        isEditing={isEditing}
        passwordValidations={passwordValidations}
        passwordTouched={passwordTouched}
      />
    </div>
  );
};

export default DetailCustomerPage;