import { FaSpinner } from 'react-icons/fa';

const UserHeader = ({
  userName,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  saveLoading,
  isSaveDisabled
}) => {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
        Detalles del Usuario: {userName}
      </h2>
      <div className="flex gap-4">
        {!isEditing ? (
          <button
            onClick={onEditClick}
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg shadow hover:bg-emerald-700 transition duration-200"
          >
            Editar
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancelClick}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-400 transition duration-200"
              disabled={saveLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={onSaveClick}
              className={`bg-emerald-600 text-white py-2 px-4 rounded-lg shadow hover:bg-emerald-700 transition duration-200 flex items-center justify-center ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={saveLoading || isSaveDisabled}
            >
              {saveLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHeader;