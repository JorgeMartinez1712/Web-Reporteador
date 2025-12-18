const calculateFinancingDetails = (totalAmount, selectedFinancingPlan, dataConditions, customerCreditAvailable) => {
    if (!selectedFinancingPlan) {
        return null;
    }

    const {
        id,
        cuotas,
        min_down_payment_rate,
        max_financing_amount,
        block_penalty_rate,
    } = selectedFinancingPlan;

    const initialProductCost = totalAmount;

    const finalFinancingPlan = {
        ...selectedFinancingPlan,
        cuotas: dataConditions?.installments || cuotas,
        min_down_payment_rate: dataConditions?.down_payment || min_down_payment_rate,
        max_financing_amount: dataConditions?.credit_limit || max_financing_amount,
    };

    const downPaymentRate = parseFloat(finalFinancingPlan.min_down_payment_rate || 0) / 100;
    const downPaymentFixed = parseFloat(finalFinancingPlan.min_down_payment_fixed || 0);
    const processingFeeRate = parseFloat(finalFinancingPlan.processing_fee_rate || 0) / 100;
    const processingFeeFixed = parseFloat(finalFinancingPlan.processing_fee_fixed || 0);
    const interestRate = parseFloat(finalFinancingPlan.interest_rate || 0) / 100;
    const maxFinancingAllowed = parseFloat(finalFinancingPlan.max_financing_amount || Infinity);
    const parsedCustomerCredit = customerCreditAvailable !== undefined && customerCreditAvailable !== null
        ? parseFloat(customerCreditAvailable)
        : Infinity;
    const effectiveMaxFinancing = Math.min(
        isNaN(maxFinancingAllowed) ? Infinity : maxFinancingAllowed,
        isNaN(parsedCustomerCredit) ? Infinity : parsedCustomerCredit
    );

    let calculatedDownPayment = Math.max(
        initialProductCost * downPaymentRate,
        downPaymentFixed
    );
    calculatedDownPayment = parseFloat(calculatedDownPayment.toFixed(3));

    let financedAmountBase = initialProductCost - calculatedDownPayment;
    if (financedAmountBase > effectiveMaxFinancing) {
        financedAmountBase = effectiveMaxFinancing;
        calculatedDownPayment = initialProductCost - financedAmountBase;
    }

    const amountFinanced = parseFloat(financedAmountBase.toFixed(3));

    const calculatedProcessingFee = parseFloat(
        (initialProductCost * processingFeeRate + processingFeeFixed).toFixed(3)
    );

    const interestAmount = parseFloat((amountFinanced * interestRate).toFixed(3));

    const installmentCount = parseInt(finalFinancingPlan.cuotas, 10);

    const totalAmountToRepay = parseFloat((amountFinanced + interestAmount + calculatedProcessingFee).toFixed(3));

    const installmentAmount = parseFloat((amountFinanced / installmentCount).toFixed(3));

    const finalProductCost = parseFloat(
        (calculatedDownPayment + totalAmountToRepay).toFixed(3)
    );

    const totalAmountFinanced = amountFinanced;

    const getInstallmentDates = (numInstallments) => {
        const dates = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 14);
        for (let i = 0; i < numInstallments; i++) {
            dates.push(new Date(currentDate).toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 14);
        }
        return dates;
    };

    const installmentDates = getInstallmentDates(installmentCount);

    const blockPenaltyAmount = parseFloat((totalAmount * parseFloat(block_penalty_rate || 0) / 100).toFixed(3));

    return {
        planId: id,
        totalProductCost: initialProductCost,
        calculatedDownPayment: calculatedDownPayment,
        financedAmount: amountFinanced,
        processingFee: calculatedProcessingFee,
        interestAmount: interestAmount,
        totalAmountToRepay: totalAmountToRepay,
        installmentCount: installmentCount,
        installmentAmount: installmentAmount,
        finalProductCost: finalProductCost,
        installmentDates: installmentDates,
        totalAmountFinanced: totalAmountFinanced,
        blockPenaltyAmount: blockPenaltyAmount,
        selectedFinancingPlan: finalFinancingPlan
    };
};

export default calculateFinancingDetails;