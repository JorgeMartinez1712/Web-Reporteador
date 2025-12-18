import { FaSpinner } from 'react-icons/fa';

const DeletePlan = ({ planName, onConfirm, onCancel, loading, errorMessage }) => {
    return (
        <div>
            <p className="text-lg text-gray-700 mb-4">
                ¿Estás seguro de que quieres eliminar este plan?
            </p>
            {errorMessage && (
                <div className="text-red-500 text-sm mb-4">
                    {errorMessage}
                </div>
            )}
            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={onCancel}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 cursor-pointer"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 cursor-pointer"
                    disabled={loading}
                >
                    {loading ? <FaSpinner className="animate-spin" /> : 'Eliminar'}
                </button>
            </div>
        </div>
    );
};

export default DeletePlan;