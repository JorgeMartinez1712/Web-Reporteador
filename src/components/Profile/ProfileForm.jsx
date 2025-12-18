import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';
import ProfileInfoCard from './ProfileInfoCard';
import { FaSpinner } from 'react-icons/fa';

const ProfileForm = ({ onSaveSuccess, onEmailSendSuccess }) => {
  const { user, updateUser } = useAuth();
  const { updateProfile, sendPasswordResetEmail, loading, error, emailLoading } = useProfile();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [sendEmailError, setSendEmailError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSaveError(null);
    if (user) {
      setFormData({
        name: user.name || '',
        phone_number: user.phone_number || '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    try {
      const dataToUpdate = {
        name: formData.name,
        phone_number: formData.phone_number,
      };

      const updatedUserFromApi = await updateProfile(dataToUpdate);
      updateUser(updatedUserFromApi);
      setIsEditing(false);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setSaveError(error || 'Error al guardar la información del perfil.');
    }
  };

  const handleSendPasswordResetEmail = async () => {
    setSendEmailError(null);
    try {
      if (user?.email) {
        await sendPasswordResetEmail(user.email);
        if (onEmailSendSuccess) {
          onEmailSendSuccess();
        }
      } else {
        setSendEmailError('El email del usuario no está disponible.');
      }
    } catch (err) {
      setSendEmailError(err.message || 'Error al enviar el correo de restablecimiento de contraseña.');
    }
  };

  return (
    <ProfileInfoCard title="Editar Información">
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left
                ${isEditing ? 'focus:outline-none focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 text-left">Número de Teléfono</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left
                ${isEditing ? 'focus:outline-none focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 cursor-not-allowed'}`}
            />
          </div>
        </div>
      </form>

      <div className="flex justify-end mt-6 space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200
                ${loading ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-md'}`}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancelClick}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold text-gray-700 transition-colors duration-200
                ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 shadow-md'}`}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="px-6 py-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 shadow-md"
            >
              Editar
            </button>
            <button
              onClick={handleSendPasswordResetEmail}
              disabled={emailLoading}
              className={`px-6 py-2 rounded-lg font-semibold text-emerald-600 border border-emerald-600 bg-white hover:bg-emerald-100 hover:text-emerald-700 transition-colors duration-200 shadow-md
                ${emailLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {emailLoading ? <FaSpinner className="animate-spin" /> : 'Cambiar Contraseña'}
            </button>
          </>
        )}
      </div>

      {(saveError || sendEmailError) && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm shadow-md" role="alert">
          {saveError || sendEmailError}
        </div>
      )}
    </ProfileInfoCard>
  );
};

export default ProfileForm;