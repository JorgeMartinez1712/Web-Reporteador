import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlansGrid from "../../components/Plans/PlansGrid";
import { FaSpinner } from 'react-icons/fa';
import usePlans from '../../hooks/usePlans';
import ErrorNotification from "../../components/common/ErrorNotification";
import SuccessNotification from "../../components/common/SuccessNotification";

const PlanPage = () => {
  const { plans, loading, error, fetchPlans, levels } = usePlans({ initial: ['plans', 'levels'] });
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState(null);
  const [globalErrorMessage, setGlobalErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (globalSuccessMessage) {
      const timer = setTimeout(() => {
        setGlobalSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (globalErrorMessage) {
      const timer = setTimeout(() => {
        setGlobalErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalSuccessMessage, globalErrorMessage]);

  const handleRegisterPlanClick = () => {
    navigate('/planes/nuevo');
  };

  const handlePlanClick = (planId) => {
    navigate(`/planes/${planId}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Gestión de Planes
        </h2>
        <button
          onClick={handleRegisterPlanClick}
          className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 transition duration-200 ease-in-out"
        >
          Registrar
        </button>
      </div>
      {globalSuccessMessage && <SuccessNotification isOpen={true} message={globalSuccessMessage} />}
      {globalErrorMessage && <ErrorNotification isOpen={true} message={globalErrorMessage} />}
      {error && <ErrorNotification isOpen={true} message={error} />}
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-fuchsia-900 text-4xl min-h-screen" />
        </div>
      ) : (
        <PlansGrid
          plans={plans}
          fetchPlans={fetchPlans}
          setGlobalSuccessMessage={setGlobalSuccessMessage}
          setGlobalErrorMessage={setGlobalErrorMessage}
          onPlanClick={handlePlanClick}
          levels={levels}
          loading={loading}
          hookError={error}
        />
      )}
    </div>
  );
};

export default PlanPage;