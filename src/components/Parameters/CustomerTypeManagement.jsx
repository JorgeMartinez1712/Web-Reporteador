import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const CustomerTypeManagement = () => {
  const { data, loading, error, fetchData, createItem, postUpdateItem, deleteItem } = useParameters('/custo-type');
  const [customerTypes, setCustomerTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    if (data && Array.isArray(data)) setCustomerTypes(data);
    else setCustomerTypes([]);
  }, [data]);

  useEffect(() => {
    if (currentType) {
      setFormData({
        code: currentType.code || '',
        name: currentType.name || '',
        description: currentType.description || '',
      });
    } else {
      setFormData({ code: '', name: '', description: '' });
    }
  }, [currentType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.description.trim()) {
      alert('Por favor, completa todos los campos: Código, Nombre y Descripción.');
      return;
    }

    try {
      if (isEditing && currentType?.id) {
        const payload = { id: currentType.id, ...formData };
        await postUpdateItem('/custo-type/update', payload);
      } else {
        await createItem(formData);
      }
      setFormData({ code: '', name: '', description: '' });
      setIsEditing(false);
      setCurrentType(null);
      fetchData();
    } catch (err) {
      console.error('Error al guardar tipo de cliente:', err);
      alert(`Error al guardar tipo de cliente: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (type) => {
    setIsEditing(true);
    setCurrentType(type);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de cliente?')) {
      try {
        await deleteItem(id);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar tipo de cliente:', err);
        alert(`Error al eliminar tipo de cliente: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentType(null);
    setFormData({ code: '', name: '', description: '' });
  };

  if (loading) return (
    <div className="flex justify-center items-center">
      <FaSpinner className="animate-spin text-emerald-600 text-4xl min-h-screen" />
    </div>
  );

  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="typeCode" className="block text-gray-700 text-sm font-bold mb-2">Código:</label>
            <input
              type="text"
              id="typeCode"
              name="code"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.code}
              onChange={handleChange}
              disabled={isEditing}
              placeholder="Ej: Natural"
              required
            />
          </div>
          <div>
            <label htmlFor="typeName" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
            <input
              type="text"
              id="typeName"
              name="name"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Natural"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="typeDescription" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
          <textarea
            id="typeDescription"
            name="description"
            rows="3"
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.description}
            onChange={handleChange}
            placeholder="Breve descripción del tipo de cliente."
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerTypes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">No hay tipos de cliente.</td>
                </tr>
              ) : (
                customerTypes.map((type, index) => (
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

export default CustomerTypeManagement;
