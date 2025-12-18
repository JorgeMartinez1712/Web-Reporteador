import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SaleWizard from '../../components/sales/SaleWizard';

const RegisterSellerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.sale) {
      const today = new Date();
      const sale = {
        id: 999999,
        sale_status_id: 3,
        customer: { id: 1, name: 'Demo' },
        sale_date: today.toISOString().split('T')[0],
      };
      navigate(location.pathname, { replace: true, state: { sale } });
    }
  }, [location.state?.sale, navigate, location.pathname]);

  return (
    <div className="p-4">
      <SaleWizard />
    </div>
  );
};

export default RegisterSellerPage;