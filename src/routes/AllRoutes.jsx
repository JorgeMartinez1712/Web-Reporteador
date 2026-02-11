import { Routes, Route } from 'react-router-dom';
import {
  PublicHomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerificactionCodePage,
  NotFoundPage,
  InterestedHomePage,
  RequirementsChecklistPage,
  InterestedReviewPage,
  InterestedPaymentPage,
  OwnerHomePage,
  SubscriptionsPage,
  AnalystHomePage,
  ReportsPage,
  CurrenciesPage,
  SuperAdminHomePage,
} from '../pages';
import PrivateRoute from './PrivateRoute';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<VerificactionCodePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/home-01"
        element={
          <PrivateRoute allowedRoles={['INTERESADO']}>
            <InterestedHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-02"
        element={
          <PrivateRoute allowedRoles={['DUENO']}>
            <OwnerHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-03"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <AnalystHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-04"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <SuperAdminHomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/requisitos"
        element={
          <PrivateRoute allowedRoles={['INTERESADO']}>
            <RequirementsChecklistPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/revision"
        element={
          <PrivateRoute allowedRoles={['INTERESADO']}>
            <InterestedReviewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pago"
        element={
          <PrivateRoute allowedRoles={['INTERESADO']}>
            <InterestedPaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/monedas"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO', 'ANALISTA']}>
            <CurrenciesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO', 'ANALISTA']}>
            <ReportsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suscripciones"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <SubscriptionsPage />
          </PrivateRoute>
        }
      />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;
