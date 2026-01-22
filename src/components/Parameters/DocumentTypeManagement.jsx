import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const DocumentTypeManagement = () => {
  const { data: documentTypes, loading, error, fetchData, createItem, updateItem2, deleteItem } = useParameters('/doc-type');
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');

  useEffect(() => {
    if (currentType) {
      setTypeName(currentType.name || '');
      setTypeDescription(currentType.description || '');
    } else {
      setTypeName('');
      setTypeDescription('');
    }
  }, [currentType]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!typeName.trim()) {
      alert('Por favor, completa el nombre del tipo de documento.');
      return;
    }

    try {
      if (isEditing) {
        await updateItem2('/doc-type/update', { id: currentType.id, name: typeName, description: typeDescription });
      } else {
        await createItem({ name: typeName, description: typeDescription });
      }
      setTypeName('');
      setTypeDescription('');
      setIsEditing(false);
      setCurrentType(null);
      fetchData();
    } catch (err) {
      console.error('Error al guardar tipo de documento:', err);
      alert(`Error al guardar tipo de documento: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (type) => {
    setIsEditing(true);
    setCurrentType(type);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de documento?')) {
      try {
        await deleteItem(id);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar tipo de documento:', err);
        alert(`Error al eliminar tipo de documento: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentType(null);
    setTypeName('');
    setTypeDescription('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-oscuro text-4xl" />
      </div>
    );
  }

  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="typeName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="typeName"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-claro"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Ej: Cédula de Identidad, Pasaporte"
              required
            />
          </div>
          <div>
            <label htmlFor="typeDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea
              id="typeDescription"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-claro resize-none h-[42px]"
              value={typeDescription}
              onChange={(e) => setTypeDescription(e.target.value)}
              placeholder="Descripción del tipo de documento"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-oscuro hover:bg-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar
          </button>
        </div>
      </form>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentTypes && documentTypes.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No hay tipos de documento.
                </td>
              </tr>
            ) : (
              documentTypes && documentTypes.map((type, index) => (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(type)}
                      className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                    >
                      <i className="bi bi-pencil-square text-base"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTypeManagement;