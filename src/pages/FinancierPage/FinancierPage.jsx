import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useFinancier from '../../hooks/useFinancier';
import FinancierForm from '../../components/Financier/FinancierForm';
import SuccessNotification from '../../components/common/SuccessNotification';

const FinancierPage = () => {
    const { financier, docTypes, loading, error, fetchFinancier, updateFinancier } = useFinancier();

    const [isEditing, setIsEditing] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showFinancierSuccess, setShowFinancierSuccess] = useState(false);

    useEffect(() => {
        if (financier) {
            setIsEditing(false);
            setSaveError(null);
        }
    }, [financier]);

    const handleFinancierSave = async (formDataToSave) => {
        setSaveError(null);
        try {
            await updateFinancier(formDataToSave);
            setIsEditing(false);
            setShowFinancierSuccess(true);
            fetchFinancier();
            setTimeout(() => {
                setShowFinancierSuccess(false);
            }, 3000);
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Error al guardar la información del financista.');
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin text-oscuro text-4xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-600">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-8 relative">
            <SuccessNotification
                isOpen={showFinancierSuccess}
                message="¡Información del financista actualizada exitosamente!"
            />

            {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm shadow-md mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 z-20" role="alert">
                    {saveError}
                </div>
            )}
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-extrabold text-hover tracking-tight">
                    Información del Financista
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 rounded-lg font-semibold text-white bg-oscuro hover:bg-hover transition-colors duration-200 shadow-md"
                    >
                        Editar
                    </button>
                )}
            </div>

            <div className="w-full">
                <FinancierForm
                    initialFinancier={financier || {}}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSave={handleFinancierSave}
                    docTypes={docTypes}
                />
            </div>
        </div>
    );
};

export default FinancierPage;