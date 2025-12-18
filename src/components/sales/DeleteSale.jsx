const DeleteSale = ({ sale, onConfirm, onCancel }) => {
  if (!sale) return null;

  return (
    <div className="p-4">
      <p className="mb-4">
        ¿Estás seguro de que quieres eliminar esta venta?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default DeleteSale;