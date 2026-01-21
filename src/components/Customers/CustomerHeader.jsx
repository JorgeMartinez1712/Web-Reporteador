const CustomerHeader = ({
  customerName,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  saveLoading,
  isSaveDisabled
}) => {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
        Detalles del Cliente: {customerName}
      </h2>
      <div className="flex gap-4">
        {!isEditing ? (
          <button
            onClick={onEditClick}
            className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg shadow hover:bg-fuchsia-950 transition duration-200"
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
              className={`bg-fuchsia-900 text-white py-2 px-4 rounded-lg shadow hover:bg-fuchsia-950 transition duration-200 flex items-center justify-center ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={saveLoading || isSaveDisabled}
            >
              {saveLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
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

export default CustomerHeader;