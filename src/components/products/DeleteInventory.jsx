const DeleteInventory = ({ inventory, onConfirm, onCancel }) => {
  return (
    <div>
      <p className="text-lg text-gray-700 mb-4">
        ¿Estás seguro de que deseas eliminar el dispositivo?
      </p>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default DeleteInventory;