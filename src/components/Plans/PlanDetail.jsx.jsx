import { FaSpinner } from 'react-icons/fa';

const PlanDetail = ({
  title,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  saveLoading,
  showSaveButton = true,
  showCancelButton = false
}) => {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
        {title}
      </h2>
      <div className="flex gap-4">
        {showSaveButton && !isEditing && (
          <button
            onClick={onEditClick}
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg shadow hover:bg-emerald-700 transition duration-200"
          >
            Editar
          </button>
        )}
        {isEditing && showSaveButton && (
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
              className="bg-emerald-600 text-white py-2 px-4 rounded-lg shadow hover:bg-emerald-700 transition duration-200 flex items-center justify-center"
              disabled={saveLoading}
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
        {showCancelButton && !isEditing && (
          <button
            type="button"
            onClick={onCancelClick}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-400 transition duration-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanDetail;