import { FaCheckCircle } from 'react-icons/fa';

const SuccessNotification = ({ isOpen, message, zIndex = 99999 }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-5 left-1/2 transform -translate-x-1/2 animate-slideDown"
      style={{ zIndex: zIndex }}
    >
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <FaCheckCircle className="w-5 h-5 text-green-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessNotification;