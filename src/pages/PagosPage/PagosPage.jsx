import { FaSpinner } from 'react-icons/fa';
import usePagos from '../../hooks/usePagos';
import PagosTable from '../../components/Pagos/PagosTable';
import { Link } from 'react-router-dom';


const PagosPage = () => {
  const { pagos, loading } = usePagos();

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Historial de Pagos
        </h2>
         <Link to="/pagos/registrar" className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer">
          Registrar
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : (
        <PagosTable
          pagos={pagos}
          loading={loading}
        />
      )}
    </div>
  );
};

export default PagosPage;