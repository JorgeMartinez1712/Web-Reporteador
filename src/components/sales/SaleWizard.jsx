import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Step1ClientData from './Step1ClientData';
import Step2ClientLevel from './Step2ClientLevel';
import Step3ProductSelection from './Step3ProductSelection';
import Step4Details from './Step4Details';
import Step5PaymentPlan from './Step5PaymentPlan';
import SuccessNotification from '../common/SuccessNotification';
import WarningNotification from '../common/WarningNotification';
import ErrorNotification from '../common/ErrorNotification';
import { FaUser, FaAward, FaBoxes, FaClipboardList, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import useSales from '../../hooks/useSales';
import CancelSaleModal from './CancelSaleModal';

const SaleWizard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saleData, setSaleData] = useState({ dataConditions: {}, payments: [], initialPaymentAmount: 0 });
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isEnrollmentReady, setIsEnrollmentReady] = useState(false);
  const [isProductSelectionLocked, setIsProductSelectionLocked] = useState(false);
  const { user: currentUser } = useAuth();
  const { createSaleItemStepThree, fetchPlanConditions, fetchSaleById, cancelSale } = useSales({ autoFetchSales: false });
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

  useEffect(() => {
    if (location.state?.sale) {
      const sale = location.state.sale;
      let initialStep = 2;
      if (sale.sale_status_id === 4) initialStep = 3;
      if (sale.sale_status_id >= 5) initialStep = 4;
      if (sale.sale_status_id === 6) initialStep = 5;

      const financingContractId = sale.financing_contract?.id || null;
      const isLocked = !!sale.sale_items?.[0] && initialStep >= 3;

      setSaleData({
        ...sale,
        client: sale.customer,
        saleDetails: sale,
        dataConditions: {},
        initialPaymentAmount: 0,
        saleId: sale.id,
        financingContractId: financingContractId,
        product: sale.sale_items?.[0]?.product,
        inventoryUnit: sale.sale_items?.[0]?.product_inventory,
        totalAmount: sale.sale_items?.[0]?.total_price,
        financingPlan: sale.financing_contract?.financing_plan,
      });

      setCurrentStep(initialStep);
      setIsProductSelectionLocked(isLocked);
    }
  }, [location.state?.sale]);

  useEffect(() => {
    const loadSaleDetailsForStep5 = async () => {
      if (currentStep === 5 && saleData.saleId) {
        try {
          const completeSale = await fetchSaleById(saleData.saleId);
          const initialSaleItem = completeSale.sale_items?.[0];
          const initialProduct = initialSaleItem?.product;

          let payments = [];
          let initialPaymentAmount = 0;
          const initialInstallment = completeSale.financing_contract?.installments?.find(inst => inst.is_inicial);
          if (initialInstallment) {
            payments = initialInstallment.payments || [];
            initialPaymentAmount = parseFloat(initialInstallment.amount);
          }

          setSaleData(prevData => ({
            ...prevData,
            saleDetails: completeSale,
            product: initialProduct,
            totalAmount: initialSaleItem?.total_price,
            financingPlan: completeSale.financing_contract?.financing_plan,
            payments: payments,
            financingContractId: completeSale.financing_contract?.id,
            initialPaymentAmount: initialPaymentAmount,
          }));

          if (completeSale.sale_status_id === 6) {
            setIsEnrollmentReady(true);
          }
        } catch (error) {
          console.error("Error fetching complete sale data for step 5:", error);
          handleShowNotification('error', 'Error al cargar los datos completos de la venta.');
        }
      }
    };
    loadSaleDetailsForStep5();
  }, [currentStep, saleData.saleId, fetchSaleById, handleShowNotification]);

  const handleRedirectToSales = useCallback((saleId) => {
    setTimeout(() => {
      if (saleId) {
        navigate(`/ventas/${saleId}`);
      } else {
        navigate('/ventas');
      }
    }, 2000);
  }, [navigate]);

  const handleStep1Complete = useCallback((clientData, newSale) => {
    setSaleData((prevData) => ({
      ...prevData,
      ...newSale,
      client: clientData,
      saleId: newSale.id,
      saleDetails: newSale,
    }));
    setCurrentStep(2);
  }, []);

  const handleStep2Complete = useCallback((data) => {
    setSaleData((prevData) => {
      const newSaleData = {
        ...prevData,
        ...data,
      };
      if (newSaleData.saleDetails?.financing_contract?.financing_plan) {
        newSaleData.financingPlan = newSaleData.saleDetails.financing_contract.financing_plan;
        newSaleData.financingContractId = newSaleData.saleDetails.financing_contract.id;
        if (newSaleData.saleDetails?.customer) {
          newSaleData.client = newSaleData.saleDetails.customer;
        }
      }
      return newSaleData;
    });
    setCurrentStep(3);
  }, []);

  const handleStep3Complete = useCallback(async (data) => {
    setSaleData((prevData) => ({
      ...prevData,
      ...data,
    }));

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
      const brandId = data.product.brand_id;
      const financingPlanId = saleData.financingPlan?.id;

      if (!financingPlanId) {
        throw new Error("ID de Plan de Financiamiento no encontrado. Regrese al paso de Nivel de Cliente.");
      }

      const planConditionsPayload = {
        financing_plan_id: financingPlanId,
        brand_id: brandId,
      };
      const planConditionsResponse = await fetchPlanConditions(planConditionsPayload);

      setSaleData((prevData) => {
        const updatedSaleDetails = saleItemResponse.sale;
        const updatedState = {
          ...prevData,
          saleDetails: updatedSaleDetails,
          dataConditions: planConditionsResponse?.dataConditions || {},
        };
        return updatedState;
      });

      setIsProductSelectionLocked(true);
      setCurrentStep(4);
    } catch (err) {
      setIsProductSelectionLocked(false);
      setSaleData((prevData) => ({
        ...prevData,
        product: null,
        inventoryUnit: null,
        totalAmount: 0,
        dataConditions: {},
      }));

      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar el ítem de venta o al obtener las condiciones del plan.';
      handleShowNotification('error', errorMessage);
    }
  }, [saleData.saleId, saleData.financingPlan, createSaleItemStepThree, fetchPlanConditions, handleShowNotification]);

  const handleStep4Complete = useCallback(async (data, apiResponse) => {
    const installments = apiResponse.financing_contract?.installments || [];
    const initialInstallment = installments.find(inst => inst.is_inicial);
    const payments = initialInstallment?.payments || [];

    const initialPaymentAmount = initialInstallment ? parseFloat(initialInstallment.amount) : parseFloat(apiResponse.financing_contract?.amount_financed) || 0;

    setSaleData((prevData) => {
      const newState = {
        ...prevData,
        ...data,
        installments: installments,
        saleDetails: apiResponse,
        financingContract: apiResponse.financing_contract,
        payments: payments,
        initialPaymentAmount: initialPaymentAmount,
      };
      return newState;
    });
    setCurrentStep(5);
  }, []);

  const handleStep5Complete = useCallback(async (finalSaleData, isCompleted) => {
    if (!finalSaleData.financingPlan) {
      handleShowNotification('error', 'No se ha podido asignar un plan de financiamiento. Por favor, verifica el nivel del cliente.');
      return;
    }

    setSaleData(prevData => {
      const updatedPayments = finalSaleData.payments || [];
      return {
        ...finalSaleData,
        payments: updatedPayments
      };
    });
    setIsEnrollmentReady(isCompleted);
    handleShowNotification('success', isCompleted ? 'Pago completado. Dispositivo listo para enrrolar.' : 'Pago registrado exitosamente.');
  }, [handleShowNotification]);

  const handlePaymentRegistered = useCallback((newPayment) => {
    setSaleData(prevData => {
      const updatedPayments = [...prevData.payments, newPayment];
      return { ...prevData, payments: updatedPayments };
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (currentStep === 4) {
      setIsProductSelectionLocked(false);
    }
    setCurrentStep((prevStep) => prevStep - 1);
  }, [currentStep]);

  const steps = useMemo(() => [
    { name: 'INFO CLIENTE', icon: FaUser, text: 'Cliente', component: Step1ClientData, onNext: handleStep1Complete, onPrev: null },
    { name: 'NIVEL CLIENTE', icon: FaAward, text: 'Nivel', component: Step2ClientLevel, onNext: handleStep2Complete, onPrev: handlePrev },
    { name: 'SELECCIÓN PRODUCTOS', icon: FaBoxes, text: 'Productos', component: Step3ProductSelection, onNext: handleStep3Complete, onPrev: handlePrev },
    { name: 'DETALLES', icon: FaClipboardList, text: 'Detalles', component: Step4Details, onNext: handleStep4Complete, onPrev: handlePrev },
    { name: 'PLAN DE PAGO', icon: FaCreditCard, text: 'Pago', component: Step5PaymentPlan, onNext: handleStep5Complete, onPrev: handlePrev },
  ], [handleStep1Complete, handleStep2Complete, handleStep3Complete, handleStep4Complete, handleStep5Complete, handlePrev]);

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
        return <StepComponent {...commonProps} initialData={saleData} />;
      case 2:
        return <StepComponent {...commonProps} clientData={saleData.client} saleId={saleData.saleId} saleData={saleData} initialFinancingPlan={saleData.financingPlan} sale_date={saleData.sale_date} onRedirectToSales={handleRedirectToSales} />;
      case 3:
        const retailUnitId = currentUser?.seller?.retail_unit_id;
        return (
          <StepComponent
            {...commonProps}
            initialData={saleData}
            saleId={saleData.saleId}
            retailUnitId={retailUnitId}
            onSetProductSaved={isProductSelectionLocked}
          />
        );
      case 4:
        return <StepComponent {...commonProps} saleId={saleData.saleId} financingContractId={saleData.financingContractId} dataConditions={saleData.dataConditions} initialPaymentAmount={saleData.initialPaymentAmount} />;
      case 5:
        return (
          <StepComponent
            {...commonProps}
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
                className={`flex md:w-full items-center ${currentStep > index + 1 ? 'text-oscuro' : ''} ${currentStep === index + 1 ? 'text-claro' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-400">
                  {currentStep > index + 1 ? (
                    <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 me-2.5" />
                  ) : (
                    <span className={`me-2 ${currentStep === index + 1 ? 'text-claro' : ''}`}>
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
          <h2 className="text-xl font-bold text-gray-900">Proceso de Venta</h2>
          <div className="flex items-center gap-3">
            {saleData.sale_code && (
              <span className="text-md font-bold text-oscuro">
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
        {renderStep()}
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

export default SaleWizard;