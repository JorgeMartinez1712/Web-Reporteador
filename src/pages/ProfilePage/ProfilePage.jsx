import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileInfoCard from '../../components/Profile/ProfileInfoCard';
import ProfileForm from '../../components/Profile/ProfileForm';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from '../../components/common/SuccessNotification';

const ProfilePage = () => {
  const { user, authLoading, isAuthenticated } = useAuth();
  const { getUserTypeName } = useProfile();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showEmailSuccessNotification, setShowEmailSuccessNotification] = useState(false);

  const handleProfileSaveSuccess = () => {
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const handleEmailSendSuccess = () => {
    setShowEmailSuccessNotification(true);
    setTimeout(() => {
      setShowEmailSuccessNotification(false);
    }, 3000);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <FaSpinner className="animate-spin text-oscuro text-4xl" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <div className="text-center text-red-600 mt-10 text-xl font-semibold">Debes iniciar sesión para ver esta página.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-8 relative bg-gray-50">
      <SuccessNotification
        isOpen={showSuccessNotification}
        message="¡Perfil actualizado exitosamente!"
      />
      <SuccessNotification
        isOpen={showEmailSuccessNotification}
        message="¡Correo de restablecimiento enviado exitosamente!"
      />

      <h1 className="text-2xl font-extrabold text-hover tracking-tight text-left p-3">Mi Perfil</h1>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileHeader user={user} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInfoCard title="Detalles de Contacto">
                <p className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Correo:</span>
                  <span className="text-gray-600">{user.email}</span>
                </p>
                <p className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-700">Teléfono:</span>
                  <span className="text-gray-600">{user.phone_number || 'No especificado'}</span>
                </p>
              </ProfileInfoCard>
              <ProfileInfoCard title="Información de la Cuenta">
                <p className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Tipo de Usuario:</span>
                  <span className="text-gray-600">{getUserTypeName(user.user_type_id)}</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Miembro desde:</span>
                  <span className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</span>
                </p>
                <p className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-700">Última Actualización:</span>
                  <span className="text-gray-600">{new Date(user.updated_at).toLocaleDateString()}</span>
                </p>
              </ProfileInfoCard>
            </div>
            <ProfileForm onSaveSuccess={handleProfileSaveSuccess} onEmailSendSuccess={handleEmailSendSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;