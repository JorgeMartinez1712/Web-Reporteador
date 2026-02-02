import { Routes, Route } from 'react-router-dom';
import {
  LoginPage, RegisterPage, ForgotPasswordPage, NotFoundPage, HomePage, VerificactionCodePage,
  ResetPasswordPage, CurrenciesPage, ReportsPage, SubscriptionsPage,
} from '../pages';
import PrivateRoute from './PrivateRoute';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<VerificactionCodePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/monedas"
        element={
          <PrivateRoute>
            <CurrenciesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/suscripciones"
        element={
          <PrivateRoute>
            <SubscriptionsPage />
          </PrivateRoute>
        }
      />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;