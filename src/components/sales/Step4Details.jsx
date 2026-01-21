import { useState, useMemo } from 'react';
import useSales from '../../hooks/useSales';
import calculateFinancingDetails from './CalculateFinancingDetails';
import PaymentDetailsCard from './PaymentDetailsCard';

const Step4Details = ({ onNext, onPrev, saleData, currentUser, financingContractId, saleId, onError, dataConditions, initialPaymentAmount, isCompleted }) => {
    const { submitSaleStepFour } = useSales({ autoFetchSales: false });

    const existingFinancingContract = saleData.saleDetails?.financing_contract || null;

    if (!saleData) {
        return <div>Cargando datos de la venta...</div>;
    }

    const financingPlan = saleData.financingPlan || null;
    const creditAvailable = useMemo(() => {
        const levels = saleData?.client?.active_levels || [];
        const planLevelId = financingPlan?.level_id;
        let level = null;
        if (planLevelId) {
            level = levels.find(l => l?.id === planLevelId && (l?.pivot?.estatus === true || l?.pivot?.estatus === 1));
        }
        if (!level) {
            level = levels.find(l => l?.pivot?.estatus === true || l?.pivot?.estatus === 1) || null;
        }
        const val = level?.pivot?.credit_available;
        const parsed = val !== undefined && val !== null ? parseFloat(val) : null;
        return isNaN(parsed) ? null : parsed;
    }, [saleData?.client?.active_levels, financingPlan?.level_id]);
    const [saleNotes, setSaleNotes] = useState(saleData.notes || '');
    const totalAmount = parseFloat(saleData.totalAmount || 0);

    const handleNext = async () => {
        if (existingFinancingContract) {
            onNext(
                {
                    ...saleData,
                    notes: saleNotes,
                },
                {
                    financing_contract: {
                        installments: existingFinancingContract.installments || saleData.installments,
                        ...existingFinancingContract,
                    }
                }
            );
            return;
        }

        try {
            const financingDetails = calculateFinancingDetails(totalAmount, financingPlan, dataConditions, creditAvailable);
            const calculatedDownPayment = initialPaymentAmount > 0 ? initialPaymentAmount : financingDetails.calculatedDownPayment;

            const financingContractPayload = {
                financing_contract_id: financingContractId,
                amountSale: totalAmount,
                amountProcessingFee: financingDetails.processingFee,
                amountInitial: calculatedDownPayment,
                amountFinanced: financingDetails.financedAmount,
                amountFee: financingDetails.interestAmount,
                totalAmountFinanced: financingDetails.financedAmount,
                totalAmountPay: financingDetails.totalProductCost,
                installmentNumber: financingDetails.installmentCount,
                installmentFrecuency: financingDetails.selectedFinancingPlan.installment_frecuency,
            };

            const installments = [
                {
                    number: 0,
                    due_date: new Date().toISOString().split('T')[0],
                    amount: calculatedDownPayment,
                    is_inicial: true,
                },
            ];

            financingDetails.installmentDates.forEach((date, index) => {
                installments.push({
                    number: index + 1,
                    due_date: date,
                    amount: financingDetails.installmentAmount,
                    is_inicial: false,
                });
            });

            const apiResponse = await submitSaleStepFour({
                id: saleId,
                notes: saleNotes,
                financingContract: financingContractPayload,
                installments: installments,
            });

            onNext(
                {
                    ...saleData,
                    notes: saleNotes,
                    financingDetails: financingDetails,
                },
                apiResponse
            );
        } catch (error) {
            let errorMessage = 'Error al registrar el contrato de financiamiento.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            onError(errorMessage);
        }
    };

    const calculatedDetails = useMemo(() => {
        if (existingFinancingContract) {
            const initialInstalment = existingFinancingContract.installments?.find(inst => inst.is_inicial);

            return {
                totalProductCost: parseFloat(existingFinancingContract.amount_sale),
                processingFee: parseFloat(existingFinancingContract.amount_processing_fee),
                calculatedDownPayment: initialInstalment ? parseFloat(initialInstalment.amount) : 0,
                financedAmount: parseFloat(existingFinancingContract.amount_financed),
                interestAmount: parseFloat(existingFinancingContract.amount_financed_fee),
                totalAmountFinanced: parseFloat(existingFinancingContract.total_amount_pay) - (initialInstalment ? parseFloat(initialInstalment.amount) : 0), 
                installmentCount: existingFinancingContract.installment_number,

                installmentAmount: existingFinancingContract.installments?.find(inst => !inst.is_inicial)?.amount ?
                    parseFloat(existingFinancingContract.installments.find(inst => !inst.is_inicial).amount) : 0,

                installmentsFromApi: existingFinancingContract.installments,
                blockPenaltyAmount: parseFloat(existingFinancingContract.amount_penalty) || 0,
            };
        }

        if (!financingPlan) {
            return null;
        }
        const details = calculateFinancingDetails(totalAmount, financingPlan, dataConditions, creditAvailable);
        const calculatedDownPayment = initialPaymentAmount > 0 ? initialPaymentAmount : details.calculatedDownPayment;
        return {
            ...details,
            calculatedDownPayment: calculatedDownPayment,
            installmentsFromApi: null,
        };
    }, [totalAmount, financingPlan, dataConditions, initialPaymentAmount, existingFinancingContract, creditAvailable]);
    const displayInstallments = existingFinancingContract?.installment_number || dataConditions?.installments || financingPlan?.cuotas;
    const displayMaxFinancing = useMemo(() => {
        const planMax = dataConditions?.credit_limit || financingPlan?.max_financing_amount;
        const planMaxNum = planMax !== undefined && planMax !== null ? parseFloat(planMax) : null;
        if (creditAvailable !== null && creditAvailable !== undefined && !isNaN(planMaxNum)) {
            return Math.min(planMaxNum, creditAvailable);
        }
        return creditAvailable !== null && creditAvailable !== undefined ? creditAvailable : planMaxNum;
    }, [dataConditions?.credit_limit, financingPlan?.max_financing_amount, creditAvailable]);

    return (
        <div className="bg-white p-8 rounded-lg max-w-full mx-auto space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200 text-left">Resumen y plan de pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
                <div className="rounded-lg border-gray-200 text-left flex flex-col h-full">
                    <label className="block text-xl font-semibold text-gray-800 mb-4 text-left">
                        Plan de financiamiento asignado
                    </label>
                    {financingPlan ? (
                        <div className="text-left flex-1 flex flex-col justify-between">
                            <div>
                                <p className="font-semibold text-gray-800 text-lg mb-1">{financingPlan.name}</p>
                                <p className="text-gray-800 text-sm mb-2">{financingPlan.description}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-700 text-sm">
                                    <p>Cuotas: <span className="font-semibold">{displayInstallments}</span></p>
                                    {financingPlan.min_down_payment_rate && (
                                        <p>Inicial: {parseFloat(financingPlan.min_down_payment_rate).toFixed(0)}%</p>
                                    )}
                                    {(financingPlan.interest_rate && parseFloat(financingPlan.interest_rate) > 0) || (existingFinancingContract?.amount_financed_fee && parseFloat(existingFinancingContract.amount_financed_fee) > 0) ? (
                                        <p>Interés: {parseFloat(existingFinancingContract?.amount_financed_fee || financingPlan.interest_rate).toFixed(3)}%</p>
                                    ) : (
                                        <p>Interés: 0.00%</p>
                                    )}
                                    {displayMaxFinancing && parseFloat(displayMaxFinancing) > 0 && (
                                        <p>Financiamiento máximo: $<span className="font-semibold">{parseFloat(displayMaxFinancing).toFixed(2)}</span></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left text-gray-600 flex-1 flex items-center justify-center">
                            No se ha encontrado un plan de financiamiento para el nivel del cliente.
                        </div>
                    )}
                </div>
                <div className=''>
                    <label className="block text-xl font-semibold text-gray-800 mb-4 text-left">
                        Datos del vendedor
                    </label>
                    <div className="text-left flex-1 bg-white flex flex-col justify-between">
                        {currentUser ? (
                            <div>
                                <p className="font-semibold text-gray-800 text-lg">{currentUser.name || 'N/A'}</p>
                                <p className="text-gray-700 text-sm">Correo electrónico: {currentUser.email || 'N/A'}</p>
                                <p className="text-gray-700 text-sm">Teléfono: {currentUser.phone_number || 'N/A'}</p>
                            </div>
                        ) : (
                            <div className="text-gray-500">No se pudieron cargar los datos del vendedor.</div>
                        )}
                    </div>
                </div>
            </div>
            <PaymentDetailsCard
                totalAmount={totalAmount}
                selectedFinancingPlan={financingPlan}
                calculatedDetails={calculatedDetails}
                initialPaymentAmount={initialPaymentAmount}
            />
            <div>
                <label htmlFor="saleNotes" className="block text-xl font-semibold text-gray-800 mb-4 mt-6 text-left">
                    Notas de la venta
                </label>
                <textarea
                    id="saleNotes"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 text-gray-800 resize-y"
                    rows="4"
                    placeholder="Añade cualquier nota relevante sobre esta venta aquí..."
                    value={saleNotes}
                    onChange={(e) => setSaleNotes(e.target.value)}
                    disabled={isCompleted}
                ></textarea>
            </div>
            <div className="flex justify-between mt-6 pt-6 border-gray-200">
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
                >
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-fuchsia-900 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-950 transition duration-300 font-medium"
                >
                    {isCompleted ? 'Continuar' : 'Siguiente'}
                </button>
            </div>
        </div>
    );
};

export default Step4Details;