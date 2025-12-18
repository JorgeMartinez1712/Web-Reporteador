const DeleteUser = ({ onConfirm, onCancel }) => {
  return (
    <div className="p-4">
      <p className="mb-4">¿Estás seguro de que deseas eliminar este usuario?</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
        <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Eliminar</button>
      </div>
    </div>
  );
};

export default DeleteUser;