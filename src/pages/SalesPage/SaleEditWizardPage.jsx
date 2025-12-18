import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSales from '../../hooks/useSales';
import SaleEditWizard from '../../components/sales/SaleEditWizard';
import { FaSpinner } from 'react-icons/fa';
import ErrorNotification from '../../components/common/ErrorNotification';

const SaleEditWizardPage = () => {
  const { id } = useParams();
  const { fetchSaleForEdit, saleToEdit, loading, error } = useSales({ autoFetchSales: false });

  useEffect(() => {
    if (id) {
      fetchSaleForEdit(id);
    }
  }, [id, fetchSaleForEdit]);

  if (loading || (!saleToEdit && !error)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorNotification
          isOpen={true}
          message={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Completar Venta
        </h2>
      </div>
      <div className="bg-white p-6">
        <SaleEditWizard initialSaleData={saleToEdit} />
      </div>
    </div>
  );
};

export default SaleEditWizardPage;