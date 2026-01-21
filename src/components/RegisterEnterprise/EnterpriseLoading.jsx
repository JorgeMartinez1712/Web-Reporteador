import { FaSpinner } from 'react-icons/fa';

const EnterpriseLoading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
    </div>
  );
};

export default EnterpriseLoading;