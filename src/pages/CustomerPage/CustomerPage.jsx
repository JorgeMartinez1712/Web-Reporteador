import { useState, useEffect } from 'react'; 
import CustomersTable from "../../components/Customers/CustomersTable";
import RegisterCustomerModal from "../../components/Customers/RegisterCustomerModal";
import { FaSpinner } from 'react-icons/fa';
import useCustomers from '../../hooks/useCustomers';
import SuccessNotification from '../../components/common/SuccessNotification';

const CustomerPage = () => {
    const { customers, loading, fetchCustomers } = useCustomers({ autoFetchLookups: false, fetchStatuses: false });
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]); 

    const handleEditSuccess = (message) => {
        setShowSuccessNotification(true);
        setSuccessMessage(message);
        fetchCustomers(); 
        setTimeout(() => {
            setShowSuccessNotification(false);
            setSuccessMessage('');
        }, 3000);
    };

    return (
        <div className="min-h-screen p-8">
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-extrabold text-hover tracking-tight">
                    Gestión de Clientes
                </h2>
                <RegisterCustomerModal onCustomerRegistered={handleEditSuccess} />
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-oscuro text-4xl min-h-screen" />
                </div>
            ) : (
                <CustomersTable customers={customers} onEditSuccess={handleEditSuccess} />
            )}

            <SuccessNotification
                isOpen={showSuccessNotification}
                message={successMessage}
            />
        </div>
    );
};

export default CustomerPage;