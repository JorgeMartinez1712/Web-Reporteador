import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeleteUser from './DeleteUser';
import { FaSpinner } from 'react-icons/fa';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const UsersTable = ({
  users = [],
  userTypes = [],
  userStatuses = [],
  setUserStatus,
  loading = false,
  fetchUsers = () => { },
}) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const processedUsers = users.map((user) => ({
    ...user,
    user_type_name: user.user_types?.name || 'Desconocido',
    status_name: user.status?.name || 'Desconocido',
    registration_date: formatDate(user.created_at),
  }));

  const handleViewDetails = (row) => {
    navigate(`/usuarios/${row.id}`);
  };

  const handleDelete = (row) => {
    setSelectedUser(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await setUserStatus(selectedUser.id, 3);
      setIsDeleteModalOpen(false);
      await fetchUsers();
    } catch (err) {
      console.error('Error al cambiar el estado del usuario:', err);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Correo', flex: 2, minWidth: 200 },
    { field: 'phone_number', headerName: 'Teléfono', flex: 2, minWidth: 200 },
    {
      field: 'user_type_name',
      headerName: 'TIPO DE USUARIO',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'status_name',
      headerName: 'Estado',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'registration_date',
      headerName: 'Registro',
      flex: 1,
      minWidth: 100,
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <DataTable
          rows={processedUsers}
          columns={columns}
          onViewDetails={handleViewDetails}
          onEdit={null}
          onDelete={null}
        />
      )}

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Desactivación de Usuario"
      >
        {selectedUser && (
          <DeleteUser
            user={selectedUser}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default UsersTable;