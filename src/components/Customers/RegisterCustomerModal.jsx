import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import RegisterCustomerForm from './RegisterCustomerForm'; 

const RegisterCustomerModal = ({ onCustomerRegistered }) => { 
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCustomerCreated = (message) => {
        toggleModal(); 
        if (onCustomerRegistered) {
            onCustomerRegistered(message); 
        }
    };
    const handleCancelForm = () => {
        toggleModal();
    };

    return (
        <>
            <button
                onClick={toggleModal}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
                Registrar
            </button>
            <CustomModal isOpen={isOpen} onClose={toggleModal} title="Registrar Cliente">
                <RegisterCustomerForm 
                    onCustomerCreated={handleCustomerCreated} 
                    onCancel={handleCancelForm} 
                /> 
            </CustomModal>
        </>
    );
};

export default RegisterCustomerModal;