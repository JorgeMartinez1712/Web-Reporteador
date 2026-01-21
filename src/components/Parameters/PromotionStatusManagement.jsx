import { useState, useEffect } from 'react';
import useParameters from '../../hooks/useParameters';
import { FaSpinner } from 'react-icons/fa';

const PromotionStatusManagement = () => {
  const { data: statuses, loading, error, fetchData, createItem, updateItem2, deleteItem } = useParameters('/promotion-statuses', 'data');
  const [IS_EDITING, SET_IS_EDITING] = useState(false);
  const [CURRENT_STATUS, SET_CURRENT_STATUS] = useState(null);
  const [STATUS_CODE, SET_STATUS_CODE] = useState('');
  const [STATUS_NAME, SET_STATUS_NAME] = useState('');
  const [STATUS_DESCRIPTION, SET_STATUS_DESCRIPTION] = useState('');

  useEffect(() => {
    if (CURRENT_STATUS) {
      SET_STATUS_CODE(CURRENT_STATUS.code || '');
      SET_STATUS_NAME(CURRENT_STATUS.name || '');
      SET_STATUS_DESCRIPTION(CURRENT_STATUS.description || '');
    } else {
      SET_STATUS_CODE('');
      SET_STATUS_NAME('');
      SET_STATUS_DESCRIPTION('');
    }
  }, [CURRENT_STATUS]);

  const HANDLE_CREATE_OR_UPDATE = async (e) => {
    e.preventDefault();
    if (!STATUS_CODE.trim() || !STATUS_NAME.trim()) {
      alert('Por favor, completa el Código y el Nombre del estado de promoción.');
      return;
    }

    try {
      if (IS_EDITING) {
        await updateItem2('/promotion-statuses/update', { id: CURRENT_STATUS.id, code: STATUS_CODE, name: STATUS_NAME, description: STATUS_DESCRIPTION });
      } else {
        await createItem({ code: STATUS_CODE, name: STATUS_NAME, description: STATUS_DESCRIPTION });
      }
      SET_STATUS_CODE('');
      SET_STATUS_NAME('');
      SET_STATUS_DESCRIPTION('');
      SET_IS_EDITING(false);
      SET_CURRENT_STATUS(null);
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const HANDLE_EDIT = (status) => {
    SET_IS_EDITING(true);
    SET_CURRENT_STATUS(status);
  };

  const HANDLE_DELETE = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estado de promoción?')) {
      try {
        await deleteItem(id);
        fetchData();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const HANDLE_CANCEL_EDIT = () => {
    SET_IS_EDITING(false);
    SET_CURRENT_STATUS(null);
    SET_STATUS_CODE('');
    SET_STATUS_NAME('');
    SET_STATUS_DESCRIPTION('');
  };

  if (loading) return <div className="flex justify-center items-center">
    <FaSpinner className="animate-spin text-fuchsia-900 text-4xl min-h-screen" />
  </div>;

  return (
    <div className="p-4">
      <form onSubmit={HANDLE_CREATE_OR_UPDATE} className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="statusCode" className="block text-gray-700 text-sm font-bold mb-2">
              Código:
            </label>
            <input
              type="text"
              id="statusCode"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={STATUS_CODE}
              onChange={(e) => SET_STATUS_CODE(e.target.value.toUpperCase())}
              disabled={IS_EDITING}
              placeholder="Ej: ACTIVE, EXPIRED"
              required
            />
          </div>
          <div>
            <label htmlFor="statusName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="statusName"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={STATUS_NAME}
              onChange={(e) => SET_STATUS_NAME(e.target.value)}
              placeholder="Ej: Activa, Finalizada"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="statusDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea
              id="statusDescription"
              className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none h-[42px]"
              value={STATUS_DESCRIPTION}
              onChange={(e) => SET_STATUS_DESCRIPTION(e.target.value)}
              placeholder="Una breve descripción del estado de la promoción"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {IS_EDITING && (
            <button
              type="button"
              onClick={HANDLE_CANCEL_EDIT}
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
              {statuses && statuses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No hay estados de promoción.
                  </td>
                </tr>
              ) : (
                statuses && statuses.map((status, index) => (
                  <tr key={status.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                      <button
                        onClick={() => HANDLE_EDIT(status)}
                        className="w-6 h-6 flex items-center justify-center rounded-full p-0 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-500"
                      >
                        <i className="bi bi-pencil-square text-base"></i>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(status.id)}
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

export default PromotionStatusManagement;