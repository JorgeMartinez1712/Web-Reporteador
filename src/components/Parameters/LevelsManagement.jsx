import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const LevelsManagement = () => {
  const { data: levelsData, loading, error, fetchData, createItem, updateItem, deleteItem } = useParameters('/niveles');
  const [isEditing, setIsEditing] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [nivel, setNivel] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [amount, setAmount] = useState('');
  const [pointFrom, setPointFrom] = useState('');
  const [scoreFrom, setScoreFrom] = useState('');
  const [creditTo, setCreditTo] = useState('');

  const levels = levelsData?.data || [];

  useEffect(() => {
    if (currentLevel) {
      setNivel(currentLevel.nivel || '');
      setDescripcion(currentLevel.descripcion || '');
      setAmount(currentLevel.amount || '');
      setPointFrom(currentLevel.point_from || '');
      setScoreFrom(currentLevel.score_from != null ? String(currentLevel.score_from) : '');
      setCreditTo(currentLevel.credit_to || '');
    } else {
      setNivel('');
      setDescripcion('');
      setAmount('');
      setPointFrom('');
      setScoreFrom('');
      setCreditTo('');
    }
  }, [currentLevel]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!nivel || !amount || !pointFrom || !scoreFrom || !creditTo) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      nivel: nivel,
      descripcion: descripcion,
      amount: parseFloat(amount),
      point_from: parseInt(pointFrom),
      score_from: parseInt(scoreFrom),
      credit_to: parseFloat(creditTo),
    };

    try {
      if (isEditing) {
        await updateItem(currentLevel.id, payload);
      } else {
        await createItem(payload);
      }
      handleCancelEdit();
      fetchData();
    } catch (err) {
      console.error('Error al guardar nivel:', err);
      alert(`Error al guardar nivel: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (levelItem) => {
    setIsEditing(true);
    setCurrentLevel(levelItem);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este nivel?')) {
      try {
        await deleteItem(id);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar nivel:', err);
        alert(`Error al eliminar nivel: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentLevel(null);
    setNivel('');
    setDescripcion('');
    setAmount('');
    setPointFrom('');
    setScoreFrom('');
    setCreditTo('');
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
            <label htmlFor="nivel" className="block text-gray-700 text-sm font-bold mb-2">
              Nivel:
            </label>
            <input
              type="text"
              id="nivel"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              placeholder="Ej: Nivel 1"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
              Cantidad:
            </label>
            <input
              type="number"
              id="amount"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 1000"
              required
            />
          </div>
          <div>
            <label htmlFor="pointFrom" className="block text-gray-700 text-sm font-bold mb-2">
              Puntos:
            </label>
            <input
              type="number"
              id="pointFrom"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={pointFrom}
              onChange={(e) => setPointFrom(e.target.value)}
              placeholder="Ej: 500"
              required
            />
          </div>
          <div>
            <label htmlFor="scoreFrom" className="block text-gray-700 text-sm font-bold mb-2">
              Score:
            </label>
            <input
              type="number"
              id="scoreFrom"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={scoreFrom}
              onChange={(e) => setScoreFrom(e.target.value)}
              placeholder="Ej: 500"
              required
            />
          </div>
          <div>
            <label htmlFor="creditTo" className="block text-gray-700 text-sm font-bold mb-2">
              Límite de crédito:
            </label>
            <input
              type="number"
              id="creditTo"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={creditTo}
              onChange={(e) => setCreditTo(e.target.value)}
              placeholder="Ej: 5000"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea
              id="descripcion"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none h-[42px]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Una breve descripción del nivel"
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
                  Nivel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Puntos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Límite de crédito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {levels.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No hay niveles.
                  </td>
                </tr>
              ) : (
                levels.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nivel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.descripcion || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.point_from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.credit_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                      >
                        <i className="bi bi-pencil-square text-base"></i>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(item.id)}
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

export default LevelsManagement;