import { useState } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeleteEnterprise from './DeleteEnterprise';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const EnterpriseTable = ({
    enterprises,
    loading: pageLoading,
    fetchEnterprises,
    deleteEnterprise,
}) => {
    const navigate = useNavigate();
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleViewDetails = (row) => {
        navigate(`/empresas/${row.id}`);
    };

    const handleDelete = (row) => {
        setSelectedEnterprise(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedEnterprise) {
                await deleteEnterprise(selectedEnterprise.id, selectedEnterprise);
                setIsDeleteModalOpen(false);
                setSelectedEnterprise(null);
                await fetchEnterprises();
            }
        } catch (error) {
            console.error('Error al eliminar la empresa:', error);
        }
    };

    const processedEnterprises = enterprises.map(enterprise => ({
        ...enterprise,
        status_name: enterprise.status?.name || 'Desconocido',
    }));

    const columns = [
        {
            field: 'icon_url',
            headerName: 'Logo',
            flex: 0.5,
            minWidth: 80,
            headerClassName: 'justify-start',
            renderCell: ({ row }) => {
                const baseLogoUrl = row.icon_url
                    ? (row.icon_url.startsWith('http')
                        ? row.icon_url
                        : `${IMAGE_BASE_URL}${row.icon_url.startsWith('/') ? row.icon_url.substring(1) : row.icon_url}`)
                    : '/assets/no-image.svg';

                const finalLogoUrl = row.icon_url ? baseLogoUrl : '/assets/no-image.svg';

                return (
                    <div className="flex items-center justify-center w-full h-12">
                        <img
                            src={finalLogoUrl}
                            alt="Logo"
                            className="max-h-full max-w-full"
                            onError={(e) => { e.target.src = '/assets/no-image.svg'; }}
                        />
                    </div>
                );
            },
            sortable: false,
            filterable: false,
        },
        { field: 'rif', headerName: 'RIF', flex: 1, minWidth: 150 },
        { field: 'legal_name', headerName: 'Razón social', flex: 2, minWidth: 200 },
        { field: 'email', headerName: 'Correo', flex: 2, minWidth: 200 },
        { field: 'phone', headerName: 'Teléfono', flex: 1, minWidth: 150 },
    ];

    return (
        <>
            {pageLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
                </div>
            ) : (
                <DataTable
                    rows={processedEnterprises}
                    columns={columns}
                    onViewDetails={handleViewDetails}
                />
            )}

            <CustomModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Eliminación"
            >
                {selectedEnterprise && (
                    <DeleteEnterprise
                        onConfirm={confirmDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                    />
                )}
            </CustomModal>
        </>
    );
};

export default EnterpriseTable;