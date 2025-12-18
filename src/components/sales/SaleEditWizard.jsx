import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaBoxes, FaClipboardList, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Step2ClientLevel from './Step2ClientLevel';
import Step3ProductSelection from './Step3ProductSelection';
import Step4Details from './Step4Details';
import Step5PaymentPlan from './Step5PaymentPlan';
import useSales from '../../hooks/useSales';
import { useAuth } from '../../context/AuthContext';
import SuccessNotification from '../common/SuccessNotification';
import WarningNotification from '../common/WarningNotification';
import ErrorNotification from '../common/ErrorNotification';
import CancelSaleModal from './CancelSaleModal';

const SaleEditWizard = ({ initialSaleData }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    createSaleItemStepThree,
    fetchPlanConditions,
    cancelSale,
  } = useSales({ autoFetchSales: false });

  const getInitialState = (data) => {
    const saleStatusId = data.sale_status_id;
    let initialStep = 1;
    let initialIsStep4Completed = false;

    if (saleStatusId === 3) {
      initialStep = 2;
    } else if (saleStatusId === 4) {
      initialStep = 3;
    } else if (saleStatusId === 5 || saleStatusId === 6) {
      initialStep = 4;
      initialIsStep4Completed = true;
    } else if (data.financing_contract) {
      initialStep = 2;
    }

    const initialInstallment = data.financing_contract?.installments?.find(inst => inst.is_inicial);
    const payments = initialInstallment?.payments || [];
    const initialPaymentAmount = initialInstallment ? parseFloat(initialInstallment.amount) : 0;
    const product = data.sale_items?.[0]?.product;
    const inventoryUnit = data.sale_items?.[0]?.product_inventory;
    const totalAmount = data.sale_items?.[0]?.total_price;
    const clientData = data.customer;
    const rawFinancingContract = data.financing_contract || null;

    const hasContractAmounts = rawFinancingContract && (
      rawFinancingContract.amount_sale !== null ||
      rawFinancingContract.amount_financed !== null ||
      rawFinancingContract.total_amount_pay !== null ||
      rawFinancingContract.installment_number !== null
    );
    const financingContract = hasContractAmounts ? rawFinancingContract : null;
    const financingPlan = rawFinancingContract?.financing_plan || data.financing_plan || null;

    const isProductPreSelected = !!product && !!inventoryUnit && (saleStatusId >= 3);

    return {
      currentStep: initialStep,
      saleData: {
        ...data,
        client: clientData,
        saleDetails: { ...data, financing_contract: financingContract },
        dataConditions: {},
        payments: payments,
        installments: rawFinancingContract?.installments || [],
        initialPaymentAmount: initialPaymentAmount,
        saleId: data.id,
        financingContractId: rawFinancingContract?.id || null,
        financingPlan: financingPlan,
        product: product,
        inventoryUnit: inventoryUnit,
        totalAmount: totalAmount,
        clientData: clientData,
        sale_date: data.sale_date,
      },
      isEnrollmentReady: saleStatusId === 6,
      isProductPreSelected: isProductPreSelected,
      isStep4Completed: initialIsStep4Completed,
    };
  };

  const {
    currentStep: initialCurrentStep,
    saleData: initialSaleDataState,
    isEnrollmentReady: initialIsEnrollmentReady,
    isProductPreSelected: initialIsProductPreSelected,
    isStep4Completed: initialIsStep4Completed,
  } = useMemo(() => getInitialState(initialSaleData), [initialSaleData]);

  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const [saleData, setSaleData] = useState(initialSaleDataState);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isEnrollmentReady, setIsEnrollmentReady] = useState(initialIsEnrollmentReady);
  const [isProductSaved, setIsProductSaved] = useState(initialIsProductPreSelected);
  const [isStep4Completed, setIsStep4Completed] = useState(initialIsStep4Completed);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleShowNotification = useCallback((type, message) => {
    setNotificationMessage(message);
    setShowSuccessNotification(false);
    setShowWarningNotification(false);
    setShowErrorNotification(false);

    if (type === 'success') {
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
        setNotificationMessage('');
      }, 3000);
    }
    if (type === 'warning') setShowWarningNotification(true);
    if (type === 'error') setShowErrorNotification(true);
  }, []);

  const handleCloseError = useCallback(() => {
    setShowErrorNotification(false);
    setNotificationMessage('');
  }, []);

  const handleCloseWarning = useCallback(() => {
    setShowWarningNotification(false);
    setNotificationMessage('');
  }, []);

  const openCancelModal = useCallback(() => {
    setShowCancelModal(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    if (!isCancelling) setShowCancelModal(false);
  }, [isCancelling]);

  const handleConfirmCancel = useCallback(async (notes) => {
    if (!saleData?.saleId) return;
    try {
      setIsCancelling(true);
      await cancelSale(saleData.saleId, notes);
      setShowCancelModal(false);
      handleShowNotification('success', 'Orden cancelada correctamente.');
      setTimeout(() => {
        navigate('/ventas');
      }, 2000);
    } catch (err) {
      const message = err?.friendlyMessage || err?.response?.data?.message || err?.message || 'Error al cancelar la orden';
      handleShowNotification('error', message);
    } finally {
      setIsCancelling(false);
    }
  }, [saleData?.saleId, cancelSale, navigate, handleShowNotification]);

  const handleRedirectToSales = useCallback((saleId) => {
    setTimeout(() => {
      if (saleId) {
        navigate(`/ventas/${saleId}`);
      } else {
        navigate('/ventas');
      }
    }, 2000);
  }, [navigate]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  }, []);

  const handleStep1Complete = useCallback((data) => {
    setSaleData((prevData) => {
      const newSaleData = {
        ...prevData,
        ...data,
      };
      if (newSaleData.saleDetails?.financing_contract?.financing_plan) {
        newSaleData.financingPlan = newSaleData.saleDetails.financing_contract.financing_plan;
        newSaleData.financingContractId = newSaleData.saleDetails.financing_contract.id;
      }
      return newSaleData;
    });
    setCurrentStep(2);
  }, []);

  const loadPlanConditions = useCallback(async (product, financingPlan) => {
    if (!product || !financingPlan) return;

    const brandId = product.brand_id || product.brand?.id;
    const financingPlanId = financingPlan.id;

    if (!brandId || !financingPlanId) {
      handleShowNotification('warning', 'Faltan datos (ID de marca o ID de plan) para obtener las condiciones.');
      return;
    }

    try {
      const planConditionsPayload = {
        financing_plan_id: financingPlanId,
        brand_id: brandId,
      };
      const planConditionsResponse = await fetchPlanConditions(planConditionsPayload);

      setSaleData((prevData) => {
        const updatedState = {
          ...prevData,
          dataConditions: planConditionsResponse?.dataConditions || {},
        };
        return updatedState;
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener las condiciones del plan.';
      handleShowNotification('error', errorMessage);
      setSaleData((prevData) => ({
        ...prevData,
        dataConditions: {},
      }));
    }
  }, [fetchPlanConditions, handleShowNotification]);

  useEffect(() => {
    if (initialIsProductPreSelected && initialCurrentStep >= 3 && !initialSaleDataState.dataConditions.installments) {
      setIsInitialLoading(true);

      const productData = initialSaleDataState.product;

      if (productData && initialSaleDataState.financingPlan) {
        loadPlanConditions(productData, initialSaleDataState.financingPlan)
          .finally(() => {
            setIsInitialLoading(false);
          });
      } else {
        setIsInitialLoading(false);
      }
    }
  }, [initialIsProductPreSelected, initialCurrentStep, initialSaleDataState.product, initialSaleDataState.financingPlan, loadPlanConditions]);


  const handleStep2Complete = useCallback(async (data) => {
    setSaleData((prevData) => ({
      ...prevData,
      ...data,
    }));

    if (isProductSaved) {
      await loadPlanConditions(data.product, saleData.financingPlan);
      setCurrentStep(3);
      return;
    }

    try {
      const payload = {
        id: saleData.saleId,
        sale_item: {
          product_id: data.product.product_id,
          product_inventory_id: data.inventoryUnit.id,
          quantity: 1,
          unit_price: parseFloat(data.product.base_price),
          total_price: data.totalAmount,
        },
      };
      const saleItemResponse = await createSaleItemStepThree(payload);

      setIsProductSaved(true);

      await loadPlanConditions(data.product, saleData.financingPlan);

      setSaleData((prevData) => {
        const updatedSaleDetails = saleItemResponse.sale;
        const updatedState = {
          ...prevData,
          saleDetails: updatedSaleDetails,
        };
        return updatedState;
      });

      setCurrentStep(3);
    } catch (err) {
      setIsProductSaved(false);
      setSaleData((prevData) => ({
        ...prevData,
        product: null,
        inventoryUnit: null,
        dataConditions: {},
      }));

      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar el ítem de venta o al obtener las condiciones del plan.';
      handleShowNotification('error', errorMessage);
    }
  }, [isProductSaved, saleData.saleId, saleData.financingPlan, createSaleItemStepThree, handleShowNotification, loadPlanConditions]);

  const handleStep3Complete = useCallback(async (data, apiResponse) => {
    const installments = apiResponse.financing_contract?.installments || [];
    const initialInstallment = installments.find(inst => inst.is_inicial);
    const payments = initialInstallment?.payments || [];

    const initialPaymentAmount = initialInstallment ? parseFloat(initialInstallment.amount) : 0;

    setSaleData((prevData) => {
      const newState = {
        ...prevData,
        ...data,
        installments: installments,
        saleDetails: {
          ...prevData.saleDetails,
          ...apiResponse,
        },
        financingContract: apiResponse.financing_contract,
        payments: payments,
        initialPaymentAmount: initialPaymentAmount,
      };
      return newState;
    });
    setIsStep4Completed(true);
    setCurrentStep(4);
  }, []);

  const handleStep4Complete = useCallback(async (finalSaleData, isCompleted) => {
    if (!finalSaleData.financingPlan) {
      handleShowNotification('error', 'No se ha podido asignar un plan de financiamiento. Por favor, verifica el nivel del cliente.');
      return;
    }

    setSaleData(finalSaleData);

    setIsEnrollmentReady(isCompleted);
    handleShowNotification('success', isCompleted ? 'Pago completado. Dispositivo listo para enrrolar.' : 'Pago registrado exitosamente.');
  }, [handleShowNotification]);

  const handlePaymentRegistered = useCallback((newPayment) => {
    setSaleData(prevData => {
      const updatedPayments = [...prevData.payments, newPayment];
      return { ...prevData, payments: updatedPayments };
    });
  }, []);


  const steps = useMemo(() => [
    { name: 'NIVEL CLIENTE', icon: FaAward, text: 'Nivel', component: Step2ClientLevel, onNext: handleStep1Complete, onPrev: null },
    { name: 'SELECCIÓN PRODUCTOS', icon: FaBoxes, text: 'Productos', component: Step3ProductSelection, onNext: handleStep2Complete, onPrev: handlePrev },
    { name: 'DETALLES', icon: FaClipboardList, text: 'Detalles', component: Step4Details, onNext: handleStep3Complete, onPrev: handlePrev },
    { name: 'PLAN DE PAGO', icon: FaCreditCard, text: 'Pago', component: Step5PaymentPlan, onNext: handleStep4Complete, onPrev: handlePrev },
  ], [handleStep1Complete, handleStep2Complete, handleStep3Complete, handleStep4Complete, handlePrev]);

  const renderStep = () => {
    const step = steps[currentStep - 1];
    if (!step) {
      return null;
    }
    const StepComponent = step.component;
    const commonProps = {
      onNext: step.onNext,
      onPrev: step.onPrev,
      saleData: saleData,
      currentUser: currentUser,
      onError: (message) => handleShowNotification('error', message),
      onShowSuccess: (message) => handleShowNotification('success', message),
      onShowWarning: (message) => handleShowNotification('warning', message),
    };

    switch (currentStep) {
      case 1:
        return <StepComponent
          clientData={saleData.clientData}
          saleId={saleData.saleId}
          sale_date={saleData.sale_date}
          onRedirectToSales={handleRedirectToSales}
          {...commonProps}
        />;
      case 2:
        const retailUnitId = currentUser?.seller?.retail_unit_id;
        return <StepComponent
          {...commonProps}
          initialData={saleData}
          saleId={saleData.saleId}
          retailUnitId={retailUnitId}
          onSetProductSaved={isProductSaved}
        />;
      case 3:
        return <StepComponent
          {...commonProps}
          saleId={saleData.saleId}
          financingContractId={saleData.financingContractId}
          dataConditions={saleData.dataConditions}
          initialPaymentAmount={saleData.initialPaymentAmount}
          isCompleted={isStep4Completed}
        />;
      case 4:
        return (
          <Step5PaymentPlan
            {...commonProps}
            saleData={saleData}
            onConfirm={step.onNext}
            isEnrollmentReady={isEnrollmentReady}
            installments={saleData.installments}
            payments={saleData.payments}
            onPaymentRegistered={handlePaymentRegistered}
            initialPaymentAmount={saleData.initialPaymentAmount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <SuccessNotification isOpen={showSuccessNotification} message={notificationMessage} />
      <WarningNotification isOpen={showWarningNotification} message={notificationMessage} onClose={handleCloseWarning} zIndex={200} />
      <ErrorNotification isOpen={showErrorNotification} message={notificationMessage} onClose={handleCloseError} />
      <div className="w-full bg-white rounded-lg shadow-xl mb-8 p-4">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-700 sm:text-base">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <li
                key={index}
                className={`flex md:w-full items-center ${currentStep > index + 1 ? 'text-emerald-600' : ''} ${currentStep === index + 1 ? 'text-emerald-500 font-bold' : 'text-gray-500'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-400">
                  {currentStep > index + 1 ? (
                    <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 me-2.5 text-emerald-500" />
                  ) : (
                    <span className={`me-2 ${currentStep === index + 1 ? 'text-emerald-500' : ''}`}>
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
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Continuar Venta</h2>
          <div className="flex items-center gap-3">
            {saleData.sale_code && (
              <span className="text-md font-bold text-emerald-600">
                Código de venta: {saleData.sale_code}
              </span>
            )}
            {currentStep >= 2 && currentStep <= 4 && !!saleData?.saleId && (saleData.payments?.length === 0) && !saleData?.saleDetails?.error && !!saleData?.financingPlan && (
              <button
                type="button"
                onClick={openCancelModal}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Cancelar orden
              </button>
            )}
          </div>
        </div>
        {isInitialLoading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-emerald-500 w-8 h-8 mr-2" />
            <span className="text-lg text-gray-600">Cargando condiciones del plan...</span>
          </div>
        ) : renderStep()}
      </div>
      <CancelSaleModal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        onSubmit={handleConfirmCancel}
        isSubmitting={isCancelling}
      />
    </div>
  );
};

export default SaleEditWizard;