import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useParameters from '../../hooks/useParameters';
import axiosInstance from '../../api/axiosInstance';
import ErrorNotification from '../../components/common/ErrorNotification';
import SuccessNotification from '../../components/common/SuccessNotification';
import CategoriesTable from '../../components/categories/CategoriesTable';

const CategoriesPage = () => {
  const { data: categoriesData, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/categories');

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryCode, setCategoryCode] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedRetailId, setSelectedRetailId] = useState('');
  const [retails, setRetails] = useState([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (Array.isArray(categoriesData)) setCategories(categoriesData);
    else setCategories([]);
  }, [categoriesData]);

  useEffect(() => {
    const fetchRetails = async () => {
      try {
        const resp = await axiosInstance.post('/retails/index');
        setRetails(resp.data || []);
      } catch (err) {
        console.error('Error fetching retails', err);
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

  const closeNotifications = () => {
    setShowError(false);
    setErrorMessage('');
    setShowSuccess(false);
    setSuccessMessage('');
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    closeNotifications();

    if (!categoryCode.trim() || !categoryName.trim() || !selectedRetailId) {
      setErrorMessage('Por favor completa los campos obligatorios.');
      setShowError(true);
      return;
    }

    const payload = {
      code: categoryCode,
      name: categoryName,
      description: categoryDescription,
      retail_id: selectedRetailId,
    };

    try {
      if (isEditing && currentCategory?.id) {
        await updateItem(currentCategory.id, payload);
        setSuccessMessage('Categoría actualizada correctamente.');
      } else {
        await createItem(payload);
        setSuccessMessage('Categoría creada correctamente.');
      }
      setShowSuccess(true);
      handleCancelEdit();
      fetchData();
      setTimeout(closeNotifications, 3000);
    } catch (err) {
      console.error('Error saving category', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Error desconocido');
      setShowError(true);
    }
  };

  const handleEdit = (row) => {
    const cat = categories.find((c) => c.id === row.id);
    if (cat) setCurrentCategory(cat);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setCategoryCode('');
    setCategoryName('');
    setCategoryDescription('');
    setSelectedRetailId('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 relative">
      <ErrorNotification isOpen={showError} message={errorMessage} onClose={closeNotifications} />
      <SuccessNotification isOpen={showSuccess} message={successMessage} />

      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-xl font-extrabold text-emerald-700 tracking-tight text-left">Gestión de Categorías</h1>
      </div>

      <form onSubmit={handleCreateOrUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="categoryCode" className="block text-gray-700 text-sm font-medium mb-1 text-left">Código: <span className="text-red-500">*</span></label>
            <input
              id="categoryCode"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>
          <div>
            <label htmlFor="categoryName" className="block text-gray-700 text-sm font-medium mb-1 text-left">Nombre: <span className="text-red-500">*</span></label>
            <input
              id="categoryName"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="retailSelect" className="block text-gray-700 text-sm font-medium mb-1 text-left">Empresa: <span className="text-red-500">*</span></label>
            <select
              id="retailSelect"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedRetailId}
              onChange={(e) => setSelectedRetailId(e.target.value)}
              required
            >
              <option value="">--Seleccionar--</option>
              {retails.map((r) => (
                <option key={r.id} value={r.id}>{r.comercial_name} ({r.rif})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryDescription" className="block text-gray-700 text-sm font-medium mb-1 text-left">Descripción:</label>
            <textarea
              id="categoryDescription"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-[42px]"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isEditing ? 'Guardar' : 'Registrar'}
          </button>
        </div>
      </form>

      <div className="bg-white text-left">
        <CategoriesTable categories={categories} onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default CategoriesPage;
