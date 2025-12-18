import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import axiosInstance from '../../api/axiosInstance';
import { FaSpinner } from 'react-icons/fa';

const CategoryManagement = () => {
  const { data: categories, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/categories');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryCode, setCategoryCode] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedRetailId, setSelectedRetailId] = useState('');
  const [retails, setRetails] = useState([]);
  const [loadingRetails, setLoadingRetails] = useState(true);
  const [errorRetails, setErrorRetails] = useState(null);

  useEffect(() => {
    const fetchRetails = async () => {
      setLoadingRetails(true);
      setErrorRetails(null);
      try {
        const response = await axiosInstance.post('/retails/index');
        setRetails(response.data || []);
      } catch (err) {
        setErrorRetails(err.response?.data?.message || 'Error al cargar empresas');
        console.error('Error al cargar empresas:', err);
      } finally {
        setLoadingRetails(false);
      }
    };
    fetchRetails();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setCategoryCode(currentCategory.code || '');
      setCategoryName(currentCategory.name || '');
      setCategoryDescription(currentCategory.description || '');
      setSelectedRetailId(currentCategory.retail_id || '');
    } else {
      setCategoryCode('');
      setCategoryName('');
      setCategoryDescription('');
      setSelectedRetailId('');
    }
  }, [currentCategory]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!categoryCode.trim() || !categoryName.trim() || !selectedRetailId) {
      alert('Por favor, completa todos los campos requeridos, incluyendo la Empresa.');
      return;
    }

    const categoryData = {
      code: categoryCode,
      name: categoryName,
      description: categoryDescription,
      retail_id: selectedRetailId,
    };

    try {
      if (isEditing) {
        await updateItem(currentCategory.id, categoryData);
      } else {
        await createItem(categoryData);
      }
      setCategoryCode('');
      setCategoryName('');
      setCategoryDescription('');
      setSelectedRetailId('');
      setIsEditing(false);
      setCurrentCategory(null);
      fetchData();
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      alert(`Error al guardar categoría: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await deleteItem(id);
        fetchData(); 
      } catch (err) {
        console.error('Error al eliminar categoría:', err);
        alert(`Error al eliminar categoría: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setCategoryCode('');
    setCategoryName('');
    setCategoryDescription('');
    setSelectedRetailId('');
  };

  if (loading || loadingRetails) return <div className="flex justify-center items-center">
    <FaSpinner className="animate-spin text-emerald-600 text-4xl min-h-screen" />
  </div>;
  if (error) return <div className="text-center py-4 text-red-600">Error en categorías: {error}</div>;
  if (errorRetails) return <div className="text-center py-4 text-red-600">Error en empresas: {errorRetails}</div>;

  return (
    <div className="p-4">
      <form onSubmit={handleCreateOrUpdate} className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="categoryCode" className="block text-gray-700 text-sm font-bold mb-2">
              Código:
            </label>
            <input
              type="text"
              id="categoryCode"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              disabled={isEditing}
              placeholder="Ej: CAT-1, ELEC"
              required
            />
          </div>
          <div>
            <label htmlFor="categoryName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="categoryName"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ej: Electrónicos, Ropa"
              required
            />
          </div>
          <div>
            <label htmlFor="retailSelect" className="block text-gray-700 text-sm font-bold mb-2">
              Empresa:
            </label>
            <select
              id="retailSelect"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedRetailId}
              onChange={(e) => setSelectedRetailId(e.target.value)}
              required
            >
              <option value="">--Seleccionar--</option>
              {retails.map((retail) => (
                <option key={retail.id} value={retail.id}>
                  {retail.comercial_name} ({retail.rif})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoryDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea
              id="categoryDescription"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-[42px]"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Una breve descripción de la categoría"
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
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories && categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No hay categorías.
                  </td>
                </tr>
              ) : (
                categories && categories.map((category, index) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.retail?.comercial_name || category.retail_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                      >
                        <i className="bi bi-pencil-square text-base"></i>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(category.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-red-200 hover:bg-red-300 text-red-500"
                      >
                        <i className="bi bi-trash text-base"></i>
                      </button> */}
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

export default CategoryManagement;