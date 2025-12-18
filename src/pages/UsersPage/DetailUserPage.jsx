import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import UserForm from '../../components/Users/UserForm';
import UserHeader from '../../components/Users/UserHeader';
import UserLoading from '../../components/Users/UserLoading';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import { useRegisterBranch } from '../../hooks/useRegisterBranch';
import useFinancier from '../../hooks/useFinancier';

const DetailUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    users,
    userTypes,
    userStatuses,
    loading: hookLoading,
    error: hookError,
    updateUser,
    fetchUserById,
  } = useUsers({ autoFetchUsers: false, autoFetchTypes: true, autoFetchStatuses: true });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    user_type_id: '',
    status_id: '',
    password: '',
    password_confirmation: '',
    financier_id: '',
    retail_id: '',
    retail_unit_id: '',
    document_type_id: '',
    document_number: '',
    address: '',
  });

  const [passwordValidations, setPasswordValidations] = useState({
    hasUpperCase: false,
    hasNumber: false,
    minLength: false,
    passwordsMatch: false,
  });

  const [passwordTouched, setPasswordTouched] = useState(false);

  const { retails, branches, fetchBranches } = useRegisterBranch({
    autoFetchRetails: true,
    autoFetchFinanciers: false,
    autoFetchUnitStatuses: false,
  });
  const { docTypes, financier } = useFinancier();
  const [selectedRetailId, setSelectedRetailId] = useState('');
  

  useEffect(() => {
    let isMounted = true;
    const loadDetail = async () => {
      if (hookError) {
        if (!isMounted) return;
        setErrorMessage('Error al cargar datos iniciales del sistema.');
        setShowErrorNotification(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      const detailed = await fetchUserById(id);
      if (!isMounted) return;
      if (detailed && detailed.id) {
        setUser(detailed);
        const isSeller = parseInt(detailed.user_type_id || 0, 10) === 5;
        const seller = detailed.seller || {};
        const assignment = detailed.assignment || {};
        const retailUnit = assignment.assignable || {};
        const retailFromUnit = retailUnit.retail || {};
        const computedRetailId = retailUnit.retail_id || retailFromUnit.id || detailed.retail_id || '';
        const nextForm = {
          name: detailed.name || '',
          email: detailed.email || '',
          phone_number: detailed.phone_number || '',
          user_type_id: detailed.user_type_id || '',
          status_id: detailed.status_id || '',
          password: '',
          password_confirmation: '',
          financier_id: detailed.financier_id || '',
          retail_id: isSeller ? computedRetailId || '' : (detailed.retail_id || ''),
          retail_unit_id: isSeller ? (seller.retail_unit_id || '') : (detailed.retail_unit_id || ''),
          document_type_id: isSeller ? (seller.document_type_id || seller.document_type?.id || '') : (detailed.document_type_id || ''),
          document_number: isSeller ? (seller.document_number || '') : (detailed.document_number || ''),
          address: isSeller ? (seller.address || '') : (detailed.address || ''),
        };
        setFormData(nextForm);
        if (isSeller) {
          if (computedRetailId) {
            setSelectedRetailId(String(computedRetailId));
            await fetchBranches(computedRetailId);
          } else if (seller.retail_unit_id) {
            await fetchBranches();
          }
        } else if (detailed.retail_id) {
          setSelectedRetailId(String(detailed.retail_id));
        }
        setLoading(false);
      } else {
        navigate('/404', { replace: true });
      }
    };
    loadDetail();
    return () => { isMounted = false; };
  }, [id, hookError, navigate, fetchUserById]);

  const validatePassword = (passwordValue, confirmPasswordValue) => {
    const validations = {
      hasUpperCase: /[A-Z]/.test(passwordValue),
      hasNumber: /\d/.test(passwordValue),
      minLength: passwordValue.length >= 8,
    };
    setPasswordValidations((prev) => ({
      ...prev,
      ...validations,
      passwordsMatch: passwordValue === confirmPasswordValue,
    }));
  };

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
    if (name === 'retail_id') {
      setSelectedRetailId(value);
    }
  };

  useEffect(() => {
    if (selectedRetailId) {
      fetchBranches(selectedRetailId);
    }
  }, [selectedRetailId, fetchBranches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);

    if (passwordTouched && formData.password) {
      if (
        !(
          passwordValidations.hasUpperCase &&
          passwordValidations.hasNumber &&
          passwordValidations.minLength &&
          passwordValidations.passwordsMatch
        )
      ) {
        setErrorMessage('Por favor, asegúrate de que la nueva contraseña cumpla con todos los requisitos.');
        setShowErrorNotification(true);
        setSaveLoading(false);
        return;
      }
    }

    const dataToSave = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      user_type_id: Number(formData.user_type_id),
      status_id: Number(formData.status_id), 
    };

    switch (parseInt(formData.user_type_id || 0, 10)) {
      case 2:
        dataToSave.financier_id = Number(formData.financier_id || financier?.id || 1);
        break;
      case 3:
        dataToSave.retail_id = Number(formData.retail_id);
        break;
      case 4:
        dataToSave.retail_unit_id = Number(formData.retail_unit_id);
        break;
      case 5:
        dataToSave.document_number = formData.document_number;
        dataToSave.document_type_id = Number(formData.document_type_id);
        dataToSave.address = formData.address;
        dataToSave.retail_id = Number(formData.retail_id);
        dataToSave.retail_unit_id = Number(formData.retail_unit_id);
        break;
      default:
        break;
    }

    if (passwordTouched && formData.password) {
      dataToSave.password = formData.password;
      dataToSave.password_confirmation = formData.password_confirmation;
    }

    try {
      await updateUser(id, dataToSave);
      setIsEditing(false);
      setPasswordTouched(false);
      setSuccessMessage('¡Usuario actualizado con éxito!');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      setErrorMessage('Error al actualizar el usuario. Inténtalo de nuevo.');
      setShowErrorNotification(true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      const isSeller = parseInt(user.user_type_id || 0, 10) === 5;
      const seller = user.seller || {};
      const assignment = user.assignment || {};
      const retailUnit = assignment.assignable || {};
      const retailFromUnit = retailUnit.retail || {};
      const computedRetailId = retailUnit.retail_id || retailFromUnit.id || user.retail_id || '';

      const resetForm = {
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        user_type_id: user.user_type_id || '',
        status_id: user.status_id || '',
        password: '',
        password_confirmation: '',
        financier_id: user.financier_id || '',
        retail_id: isSeller ? (computedRetailId || '') : (user.retail_id || ''),
        retail_unit_id: isSeller ? (seller.retail_unit_id || '') : (user.retail_unit_id || ''),
        document_type_id: isSeller ? (seller.document_type_id || seller.document_type?.id || '') : (user.document_type_id || ''),
        document_number: isSeller ? (seller.document_number || '') : (user.document_number || ''),
        address: isSeller ? (seller.address || '') : (user.address || ''),
      };
      setFormData(resetForm);
      if (isSeller && computedRetailId) {
        setSelectedRetailId(String(computedRetailId));
      } else if (!isSeller && user.retail_id) {
        setSelectedRetailId(String(user.retail_id));
      }
    }
    setPasswordValidations({
      hasUpperCase: false,
      hasNumber: false,
      minLength: false,
      passwordsMatch: false,
    });
    setPasswordTouched(false);
    setIsEditing(false);
    setErrorMessage('');
    setShowErrorNotification(false);
    setSuccessMessage('');
    setShowSuccessNotification(false);
  };

  const isSaveDisabled = passwordTouched && !(
    passwordValidations.hasUpperCase &&
    passwordValidations.hasNumber &&
    passwordValidations.minLength &&
    passwordValidations.passwordsMatch
  );

  if (loading) {
    return <UserLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <UserHeader
        userName={user.name}
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSubmit}
        onCancelClick={handleCancelEdit}
        saveLoading={saveLoading}
        isSaveDisabled={isSaveDisabled}
      />

  <ErrorNotification isOpen={showErrorNotification} message={errorMessage} onClose={() => setShowErrorNotification(false)} />
      <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />

      <UserForm
        formData={formData}
        handleChange={handleChange}
        userTypes={userTypes}
        userStatuses={userStatuses}
        isEditing={isEditing}
        passwordValidations={passwordValidations}
        passwordTouched={passwordTouched}
        retails={retails}
        branches={branches}
        docTypes={docTypes}
        financier={financier}
      />
    </div>
  );
};

export default DetailUserPage;