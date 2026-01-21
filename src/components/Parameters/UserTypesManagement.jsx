import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const UserTypesManagement = () => {
  const { data: apiResponse, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/user-types');
  const [userTypes, setUserTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    if (apiResponse && Array.isArray(apiResponse.data)) {
      setUserTypes(apiResponse.data);
    } else {
      setUserTypes([]);
    }
  }, [apiResponse]);

  useEffect(() => {
    if (currentType) {
      setFormData({
        name: currentType.name || '',
        code: currentType.code || '',
        description: currentType.description || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
      });
    }
  }, [currentType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.description.trim()) {
      alert('Por favor, completa todos los campos: Nombre, Código y Descripción.');
      return;
    }

    try {
      if (isEditing) {
        await updateItem(currentType.id, formData);
      } else {
        await createItem(formData);
      }
      setFormData({ name: '', code: '', description: '' });
      setIsEditing(false);
      setCurrentType(null);
      fetchData();
    } catch (err) {
      console.error('Error al guardar tipo de usuario:', err);
      alert(`Error al guardar tipo de usuario: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (type) => {
    setIsEditing(true);
    setCurrentType(type);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de usuario?')) {
      try {
        await deleteItem(id);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar tipo de usuario:', err);
        alert(`Error al eliminar tipo de usuario: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentType(null);
    setFormData({ name: '', code: '', description: '' });
  };

  if (loading) return <div className="flex justify-center items-center">
    <FaSpinner className="animate-spin text-fuchsia-900 text-4xl min-h-screen" />
  </div>;

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
              name="name"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Administrador, Cliente, Vendedor"
              required
            />
          </div>
          <div>
            <label htmlFor="typeCode" className="block text-gray-700 text-sm font-bold mb-2">
              Código:
            </label>
            <input
              type="text"
              id="typeCode"
              name="code"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={formData.code}
              onChange={handleChange}
              disabled={isEditing}
              placeholder="Ej: admin, client, seller"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="typeDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción:
          </label>
          <textarea
            id="typeDescription"
            name="description"
            rows="3"
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            value={formData.description}
            onChange={handleChange}
            placeholder="Breve descripción del tipo de usuario."
            required
          />
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
            className="bg-fuchsia-900 hover:bg-fuchsia-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar
          </button>
        </div>
      </form>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Código
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
              {userTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No hay tipos de usuario.
                  </td>
                </tr>
              ) : (
                userTypes.map((type, index) => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.code}</td>
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
    </div>
  );
};

export default UserTypesManagement;