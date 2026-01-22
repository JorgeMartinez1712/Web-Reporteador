import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PromotionsTable from '../../components/Promotions/PromotionsTable';
import usePromotions from '../../hooks/usePromotions';

const PromotionsPage = () => {
  const { promotions, loading, fetchPromotions } = usePromotions({ includeRelated: false });
  
  const navigate = useNavigate();

  const handlePromotionDeleted = () => {
    fetchPromotions();
  };

  const handleNavigateToCreate = () => {
    navigate('/promociones/nuevo');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-hover tracking-tight">
          Gestión de Promociones
        </h2>
        <button
          onClick={handleNavigateToCreate}
          className="bg-oscuro text-white py-2 px-4 rounded-lg shadow-md hover:bg-hover transition-colors duration-200"
        >
          Registrar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
      ) : (
        <PromotionsTable
          promotions={promotions}
          onPromotionDeleted={handlePromotionDeleted}
        />
      )}
    </div>
  );
};

export default PromotionsPage;