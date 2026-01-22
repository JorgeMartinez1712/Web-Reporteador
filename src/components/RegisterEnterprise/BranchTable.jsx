import { useState } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import EditBranch from './EditBranch';
import DeleteBranch from './DeleteBranch';
import { FaSpinner } from 'react-icons/fa';

const BranchTable = ({
    branches,
    retails = [],
    financiers = [],
    unitStatuses = [],
    updateBranch,
    deleteBranch,
    loading = false,
    onBranchEdited,
    onOperationError,
    onBranchDeleted,
}) => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEdit = (row) => {
        setSelectedBranch(row);
        setIsEditModalOpen(true);
    };

    const handleDelete = (row) => {
        setSelectedBranch(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedBranch) {
                await deleteBranch(selectedBranch.id, selectedBranch);
                setIsDeleteModalOpen(false);
                setSelectedBranch(null);
                if (onBranchDeleted) {
                    onBranchDeleted();
                }
            }
        } catch (error) {
            if (onOperationError) {
                onOperationError(error);
            }
        }
    };

    const handleSaveEdit = async (id, updatedData) => {
        try {
            await updateBranch(id, updatedData);
            setIsEditModalOpen(false);
            if (onBranchEdited) {
                onBranchEdited();
            }
        } catch (error) {
            if (onOperationError) {
                onOperationError(error);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
    };

    const columns = [
        { field: 'name', headerName: 'Nombre', flex: 2, minWidth: 200 },
        { field: 'address', headerName: 'Dirección', flex: 3, minWidth: 300 },
        { field: 'phone', headerName: 'Teléfono', flex: 1, minWidth: 150 },
        { field: 'statusName', headerName: 'Estado', flex: 1, minWidth: 100 },
    ];

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-oscuro text-4xl" />
                </div>
            ) : (
                <DataTable
                    rows={branches}
                    columns={columns}
                    onEdit={handleEdit}
                    // onDelete={handleDelete}
                />
            )}
            <CustomModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Sucursal"
            >
                {selectedBranch && (
                    <EditBranch
                        branch={selectedBranch}
                        retails={retails}
                        financiers={financiers}
                        unitStatuses={unitStatuses}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        loading={loading}
                    />
                )}
            </CustomModal>

            <CustomModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Eliminación"
            >
                {selectedBranch && (
                    <DeleteBranch
                        branch={selectedBranch}
                        onConfirm={confirmDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                    />
                )}
            </CustomModal>
        </>
    );
};

export default BranchTable;