import Modal from 'react-modal';
import PropTypes from 'prop-types';

const CustomModal = ({ isOpen, onClose, children, title }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]"
      className="bg-white w-full max-w-[90%] md:max-w-2xl lg:max-w-4xl rounded-lg shadow-lg p-4 relative z-[70] mx-4 md:mx-0"
    >
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        {title && <h2 className="text-lg font-semibold text-gray-700">{title}</h2>}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 bi bi-x text-2xl"
        >
        </button>
      </div>
      <div className="mt-4 max-h-[80vh] overflow-y-auto">
        {children}
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default CustomModal;