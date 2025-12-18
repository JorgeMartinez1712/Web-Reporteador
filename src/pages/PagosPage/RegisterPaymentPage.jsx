import React, { useState, useMemo, useCallback } from 'react';
import ClientSearch from '../../components/Pagos/ClientSearch';
import SaleSelection from '../../components/Pagos/SaleSelection';
import PaymentForm from '../../components/Pagos/PaymentForm';
import PaymentsTable from '../../components/Pagos/PaymentsTable';
import { FaUser, FaCheckCircle, FaCreditCard, FaArrowLeft, FaArrowRight, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import useRegisterPayment from '../../hooks/useRegisterPayment';
import { useAuth } from '../../context/AuthContext';

const RegisterPaymentPage = () => {
    const { user, authLoading } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [sales, setSales] = useState([]);
    const [selectedSaleOption, setSelectedSaleOption] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [paymentOptions, setPaymentOptions] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentFormData, setPaymentFormData] = useState({});
    const [paymentFormValid, setPaymentFormValid] = useState(false);
    const [paymentResponseData, setPaymentResponseData] = useState(null);
    const { loading: hookLoading, error: hookError, findClientAndSales, fetchPaymentOptions, registerPayment, fetchCustomers, customers, requestPaymentMobileToken } = useRegisterPayment();

    const sellerId = user?.seller?.id || null;
    const retailUnitId = user?.seller?.retail_unit_id || null;
    const canRegisterPayments = !!sellerId && !!retailUnitId;

    const registerPaymentRef = React.useRef(null);

    const handleClientFound = ({ customer, sales }) => {
        setCustomer(customer);
        setSales(sales);
        setSelectedSaleOption(null);
        setSelectedSale(null);
        setPaymentOptions(null);
        setCurrentStep(2);
    };

    const handleSaleOptionSelected = (sale) => {
        setSelectedSaleOption(sale);
    };

    const handleNext = async () => {
        if (currentStep === 2) {
            if (!selectedSaleOption) return;

            const optionsData = await fetchPaymentOptions(selectedSaleOption.id);
            if (optionsData) {
                setPaymentOptions(optionsData);
                setSelectedSale({ ...selectedSaleOption, options: optionsData });
                setPaymentFormData({});
                setPaymentFormValid(false);
                setPaymentResponseData(null);
                setCurrentStep(3);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep === 2) {
            setCustomer(null);
            setSales([]);
            setSelectedSaleOption(null);
            setSelectedSale(null);
            setPaymentOptions(null);
            setCurrentStep(1);
        } else if (currentStep === 3) {
            setPaymentResponseData(null);
            setCurrentStep(2);
        }
    };

    const handleBackToSalesAfterPayment = () => {
        setSelectedSale(null);
        setPaymentOptions(null);
        setSelectedSaleOption(null);
        setPaymentFormData({});
        setPaymentFormValid(false);
        setPaymentResponseData(null);
        setCurrentStep(2);
    };

    const handlePaymentFormChange = useCallback((data, isValid) => {
        setPaymentFormData(data);
        setPaymentFormValid(isValid);
        if (data.paymentSuccess && data.paymentResponse) {
            setPaymentResponseData(data.paymentResponse);
        } else if (data.paymentSuccess === false) {
            setPaymentResponseData(null);
        }
    }, []);

    const handleRegisterPayment = async () => {
        if (!paymentFormValid) {
            alert('Por favor, complete todos los campos requeridos y corrija los errores de validación.');
            return;
        }

        const selectedMethod = selectedSale.options.payment_methods.find(m => m.id === parseInt(paymentFormData.selectedMethodId));

        if (!selectedMethod || !paymentFormData.amount) return;

        const amountToPay = parseFloat(paymentFormData.amount);

        if (amountToPay > selectedSale.outstanding) {
            alert(`El monto a pagar ($${amountToPay.toFixed(2)}) supera el saldo pendiente ($${selectedSale.outstanding.toFixed(2)}).`);
            return;
        }

        const payload = {
            sale_id: selectedSale.id,
            payment_method_id: selectedMethod.id,
            currency: selectedMethod.currency,
            amount: amountToPay,
            ...paymentFormData,
        };

        if (selectedMethod.currency === 'VES' && selectedSale.options.tasa_bcv && selectedSale.options.tasa_bcv.rate) {
            payload.bcv_rate = selectedSale.options.tasa_bcv.rate;
        }

        if (registerPaymentRef.current) {
            await registerPaymentRef.current(payload);
        }
    };

    const steps = useMemo(() => [
        { name: 'INFO CLIENTE', icon: FaUser, text: 'Cliente' },
        { name: 'SELECCIÓN VENTA', icon: FaCheckCircle, text: 'Venta' },
        { name: 'REGISTRAR PAGO', icon: FaCreditCard, text: 'Pago' },
    ], []);

    const renderStepContent = () => {
        if (authLoading || hookLoading && currentStep < 3) {
            return (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
                    <p className="ml-3 text-lg text-gray-700">Cargando...</p>
                </div>
            );
        }

        if (!canRegisterPayments) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <FaTimesCircle className="text-red-500 text-5xl mb-4" />
                    <p className="text-xl font-semibold text-red-700">Acceso Denegado</p>
                    <p className="mt-2 text-gray-600">Su cuenta de usuario no tiene el perfil de vendedor asociado para registrar pagos.</p>
                </div>
            );
        }

        if (currentStep === 1) {
            return (
                <ClientSearch
                    onClientFound={handleClientFound}
                    findClientAndSales={findClientAndSales}
                    hookError={hookError}
                    fetchCustomers={fetchCustomers}
                    allCustomers={customers}
                    customersLoading={hookLoading}
                />
            );
        }

        if (currentStep === 2) {
            return (
                <SaleSelection
                    customer={customer}
                    sales={sales}
                    onSaleSelected={handleSaleOptionSelected}
                    selectedSale={selectedSaleOption}
                    hookError={hookError}
                />
            );
        }

        if (currentStep === 3) {
            return (
                <PaymentForm
                    sale={selectedSale}
                    registerPayment={registerPayment}
                            requestPaymentMobileToken={requestPaymentMobileToken}
                            customerId={customer?.id}
                    onBackToSales={handleBackToSalesAfterPayment}
                    onFormChange={handlePaymentFormChange}
                    registerPaymentRef={registerPaymentRef}
                    sellerId={sellerId}
                    retailUnitId={retailUnitId}
                />
            );
        }
    };

    const isStepContentComponent = currentStep === 1 || currentStep === 2 || currentStep === 3;

    return (
        <div className="min-h-screen p-8 relative">
            <div className="w-full flex items-center mb-8">
                <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
                    Registro de Pago
                </h2>
            </div>
            <div className='p-8'>
                <div className="w-full bg-white rounded-lg shadow-xl mb-8 p-4">
                    <ol className="flex items-center w-full text-sm font-medium text-left text-gray-700 sm:text-base">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <li
                                    key={index}
                                    className={`flex md:w-full items-center ${currentStep > index + 1 ? 'text-emerald-600' : ''} ${currentStep === index + 1 ? 'text-emerald-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
                                >
                                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-400">
                                        {currentStep > index + 1 ? (
                                            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 me-2.5" />
                                        ) : (
                                            <span className={`me-2 ${currentStep === index + 1 ? 'text-emerald-500' : 'text-gray-500'}`}>
                                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </span>
                                        )}
                                        {step.text}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="w-full bg-white p-6 rounded-lg shadow-md max-w-full mx-auto">
                    {renderStepContent()}

                    {paymentResponseData && (
                        <div className="mt-6">
                            <PaymentsTable paymentResponseData={paymentResponseData} />
                        </div>
                    )}

                    {isStepContentComponent && currentStep !== 1 && canRegisterPayments && (
                        <div className="pt-6 border-t mt-6 flex justify-between border-gray-200">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={hookLoading}
                                className="inline-flex items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 disabled:opacity-50"
                            >
                                <FaArrowLeft className="-ml-1 mr-2 h-4 w-4" />
                                Anterior
                            </button>

                            {currentStep === 2 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={hookLoading || !selectedSaleOption}
                                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 disabled:opacity-50"
                                >
                                    Siguiente
                                    <FaArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            )}

                            {currentStep === 3 && (
                                <button
                                    type="button"
                                    onClick={handleRegisterPayment}
                                    disabled={hookLoading || !paymentFormValid}
                                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 disabled:opacity-50"
                                >
                                    {hookLoading ? (
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    ) : (
                                        <FaCheckCircle className="-ml-1 mr-2 h-5 w-5" />
                                    )}
                                    {hookLoading ? 'Procesando...' : 'Registrar Pago'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPaymentPage;