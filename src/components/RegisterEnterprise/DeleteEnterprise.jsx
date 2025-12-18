const DeleteEnterprise = ({ onConfirm, onCancel }) => {
  return (
    <div>
      <p>¿Estás seguro de que deseas eliminar esta empresa?</p>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default DeleteEnterprise;