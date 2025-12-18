import { FaExclamationTriangle } from 'react-icons/fa';

const WarningNotification = ({ isOpen, message, onClose, zIndex = 99999 }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 animate-slideDown"
      style={{ zIndex: zIndex }}
    >
      <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <FaExclamationTriangle className="w-5 h-5 text-orange-500" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto text-orange-700 hover:text-orange-900 focus:outline-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WarningNotification;