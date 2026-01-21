import SaleWizard from '../../components/sales/SaleWizard';
import { FaSpinner } from 'react-icons/fa';
import { useState } from 'react';

const SaleWizardPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null); 

  if (isSubmitting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Procesando venta...</p>
      </div>
    );
  }

  if (submissionError) { 
    return <div className="min-h-screen p-8 flex justify-center items-center text-red-500">Error: {submissionError}</div>;
  }

  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Proceso de Venta
        </h2>
      </div>
      <div className="bg-white p-6 ">
        <SaleWizard
          onSaleSubmitStart={() => {
            setIsSubmitting(true);
            setSubmissionError(null);
          }}
          onSaleSubmitEnd={() => setIsSubmitting(false)}
          onSubmissionError={(message) => setSubmissionError(message)} 
        />
      </div>
    </div>
  );
};

export default SaleWizardPage;