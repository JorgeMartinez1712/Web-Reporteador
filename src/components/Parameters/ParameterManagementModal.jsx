import PropTypes from 'prop-types';
import CustomModal from '../common/CustomModal';

const ParameterManagementModal = ({ isOpen, onClose, title, children }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </CustomModal>
  );
};

ParameterManagementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ParameterManagementModal;