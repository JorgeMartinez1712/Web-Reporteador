import { useState, useEffect, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useRegisterBranch from '../../hooks/useRegisterBranch';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification';
import RegisterBranchModal from './RegisterBranchModal';
import BranchTable from './BranchTable';

const BranchesSection = ({ retailId, retails, financiers, unitStatuses }) => {
    const {
        branches,
        loading: branchesLoading,
        error: branchesError,
        fetchBranches,
        registerBranch,
        updateBranch,
        deleteBranch,
    } = useRegisterBranch({
        autoFetchRetails: false,
        autoFetchFinanciers: false,
        autoFetchUnitStatuses: false,
    });

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const didFetchBranchesRef = useRef(false);
    useEffect(() => {
        if (retailId && !didFetchBranchesRef.current) {
            didFetchBranchesRef.current = true;
            fetchBranches(retailId);
        }
    }, [retailId, fetchBranches]);

    const handleShowSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessNotification(true);
        setTimeout(() => {
            setShowSuccessNotification(false);
            setSuccessMessage('');
        }, 3000);
    };

    const handleShowError = (message) => {
        setErrorMessage(message);
        setShowErrorNotification(true);
    };

    const handleBranchOperationSuccess = (message) => {
        fetchBranches(retailId);
        handleShowSuccess(message);
    };

    const handleBranchOperationError = (error) => {
        const apiErrorMessage = error.response?.data?.message || 'Error en la operación de sucursal.';
        const validationErrors = error.response?.data?.errors;

        if (validationErrors) {
            const fieldErrors = Object.values(validationErrors).flat().join(' ');
            handleShowError(`${apiErrorMessage}: ${fieldErrors}`);
        } else {
            handleShowError(apiErrorMessage);
        }
    };

    const processedBranches = branches.map((branch) => ({
        ...branch,
        statusName: branch.status ? branch.status.name : 'Desconocido',
    }));

    return (
        <div>
            <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />
            <ErrorNotification isOpen={showErrorNotification} message={errorMessage || branchesError} onClose={() => setShowErrorNotification(false)} />

            <div className="w-full flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-emerald-700">Sucursales</h3>
                <RegisterBranchModal
                    retails={retails}
                    financiers={financiers}
                    unitStatuses={unitStatuses}
                    registerBranch={registerBranch}
                    loading={branchesLoading}
                    retailId={retailId}
                    onRegisterSuccess={() => handleBranchOperationSuccess('¡Sucursal registrada exitosamente!')}
                    onRegisterError={handleBranchOperationError}
                />
            </div>

            {branchesLoading ? (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-emerald-600 text-3xl" />
                </div>
            ) : (
                <BranchTable
                    branches={processedBranches}
                    retails={retails}
                    financiers={financiers}
                    unitStatuses={unitStatuses}
                    updateBranch={updateBranch}
                    deleteBranch={deleteBranch}
                    loading={branchesLoading}
                    onBranchEdited={() => handleBranchOperationSuccess('¡Sucursal editada exitosamente!')}
                    onBranchDeleted={() => handleBranchOperationSuccess('¡Sucursal eliminada exitosamente!')}
                    onOperationError={handleBranchOperationError}
                />
            )}
        </div>
    );
};

export default BranchesSection;