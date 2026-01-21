import { useState, useCallback } from 'react';
import { FaSpinner, FaUser, FaIdCard, FaMobileAlt, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useSales from '../../hooks/useSales';
import FinancingPlanDetails from './FinancingPlanDetails';

const Step2ClientLevel = ({ onNext, onPrev, clientData, saleId, saleData, onError, sale_date, onRedirectToSales }) => {
    const { verifySaleStepTwo } = useSales({ autoFetchSales: false });

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState(null);
    const [verifiedFinancingData, setVerifiedFinancingData] = useState(null);

    const handleVerify = useCallback(async () => {
        if (!saleId) {
            onError('Error: No se encontró el ID de la venta. Por favor, regresa al paso anterior.');
            return;
        }

        setIsVerifying(true);
        setVerificationMessage(null);
        setVerifiedFinancingData(null);
        try {
            const response = await verifySaleStepTwo(saleId);
            const respMessage = response?.message || response?.error || null;
            if (response && respMessage) {
                setVerificationMessage(respMessage);
                onError(respMessage);
                if (respMessage.includes("No se pudo determinar el nivel") || response.status === "RECHAZADA") {
                    onRedirectToSales(saleId);
                }
            } else if (response && response.financing_contract) {
                setVerifiedFinancingData({
                    saleDetails: { ...saleData.saleDetails, ...response },
                    financingContractId: response.financing_contract.id,
                    financingPlan: response.financing_contract.financing_plan
                });
            }
        } catch (err) {
            let errorMessage = 'Error al verificar la elegibilidad del cliente. Intenta de nuevo.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.friendlyMessage) {
                errorMessage = err.friendlyMessage;
            } else if (err.message) {
                errorMessage = err.message;
            }
            onError(errorMessage);
            setVerificationMessage(errorMessage);
            if (err.response?.data?.status === 'RECHAZADA') {
                onRedirectToSales(saleId);
            }
        } finally {
            setIsVerifying(false);
        }
    }, [saleId, saleData, verifySaleStepTwo, onError, onRedirectToSales]);

    const handleNextStep = useCallback(() => {
        const dataToPass = verifiedFinancingData || {
            saleDetails: saleData.saleDetails,
            financingContractId: saleData.financingContractId,
            financingPlan: financingPlan
        };
        onNext(dataToPass);
    }, [verifiedFinancingData, saleData, onNext]);


    const initialCreationError = saleData?.saleDetails?.error || saleData?.error || null;

    if (initialCreationError) {
        return (
            <div className="text-red-700 p-4 bg-red-100 rounded-lg border border-red-200 text-left">
                {initialCreationError}
            </div>
        );
    }

    if (!clientData) {
        return (
            <div className="text-red-700 p-4 bg-red-100 rounded-lg border border-red-200 text-left">
                Error: No se ha seleccionado un cliente. Por favor, regresa al paso anterior.
            </div>
        );
    }

    const financingPlan = verifiedFinancingData?.financingPlan || saleData.financingPlan || saleData.saleDetails?.financing_contract?.financing_plan;

    return (
        <div className="bg-white p-8 rounded-lg max-w-full space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 border-gray-200 text-left">
                Detalles del cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaUser className="text-fuchsia-900 text-xl" />
                    <p className="text-sm font-medium">{clientData.full_name || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaIdCard className="text-fuchsia-900 text-xl" />
                    <p className="text-sm">{`${clientData.document_type?.code || ''} ${clientData.document_number || 'N/A'}`}</p>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaMobileAlt className="text-fuchsia-900 text-xl" />
                    <p className="text-sm">{clientData.phone_number || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaEnvelope className="text-fuchsia-900 text-xl" />
                    <p className="text-sm">{clientData?.email || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaMapMarkerAlt className="text-fuchsia-900 text-xl" />
                    <p className="text-sm">{clientData.address || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                    <FaCalendarAlt className="text-fuchsia-900 text-xl" />
                    <p className="text-sm">{sale_date ? format(new Date(sale_date), 'dd MMMM yyyy', { locale: es }) : 'N/A'}</p>
                </div>
            </div>
            <div className="mt-6 pt-6 border-gray-200">
                {isVerifying ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-fuchsia-950 text-center flex items-center justify-center">
                        <FaSpinner className="animate-spin inline-block mr-2" />
                        Verificando elegibilidad del cliente...
                    </div>
                ) : verificationMessage ? (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 text-center">
                        <p className="font-semibold">Cliente no válido</p>
                        <p>{verificationMessage}</p>
                    </div>
                ) : financingPlan ? (
                    <FinancingPlanDetails financingPlan={financingPlan} />
                ) : (
                    <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">Haz clic en "Verificar" para validar la elegibilidad del cliente.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
                >
                    Anterior
                </button>
                <div>
                    {financingPlan ? (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg shadow hover:bg-fuchsia-950 transition duration-200"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleVerify}
                            className="border border-fuchsia-900 text-fuchsia-900 bg-white py-2 px-4 rounded-lg shadow hover:bg-fuchsia-100 transition duration-200 disabled:opacity-50"
                            disabled={isVerifying}
                        >
                            {isVerifying ? <FaSpinner className="animate-spin mr-2" /> : 'Verificar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step2ClientLevel;