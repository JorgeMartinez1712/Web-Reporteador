import { useState } from 'react';
import UsersTable from "../../components/Users/UsersTable";
import RegisterUserModal from "../../components/Users/RegisterUserModal";
import { FaSpinner } from 'react-icons/fa';
import useUsers from '../../hooks/useUsers';
import SuccessNotification from '../../components/common/SuccessNotification';

const UsersPage = () => {
  const { users, userTypes, userStatuses, loading, fetchUsers, setUserStatus } = useUsers({
    autoFetchUsers: true,
    autoFetchTypes: false,
    autoFetchStatuses: false,
  });
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  const handleUserActionSuccess = () => {
    setShowEditSuccess(true);
    setTimeout(() => setShowEditSuccess(false), 3000);
    fetchUsers();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Gestión de Usuarios
        </h2>
        <RegisterUserModal onUserRegistered={fetchUsers} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl min-h-screen" />
        </div>
      ) : (
        <UsersTable
          users={users}
          userTypes={userTypes}
          userStatuses={userStatuses}
          setUserStatus={setUserStatus}
          loading={loading}
          fetchUsers={fetchUsers}
        />
      )}

      <SuccessNotification
        isOpen={showEditSuccess}
        message="¡Usuario editado exitosamente!"
      />
    </div>
  );
};

export default UsersPage;