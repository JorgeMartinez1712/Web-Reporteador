import { FaTimes } from 'react-icons/fa'; 

const ErrorNotification = ({ isOpen, message, onClose, zIndex = 99999 }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 animate-slideDown"
      style={{ zIndex: zIndex }}
    >
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <span className="font-medium flex-grow">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-red-500 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-200 flex-shrink-0" 
          aria-label="Cerrar notificación"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;