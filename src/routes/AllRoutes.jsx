import { Routes, Route } from 'react-router-dom';
import {
  LoginPage, RegisterPage, ForgotPasswordPage, NotFoundPage,
  HomePage, VerificactionCodePage, ProfilePage, VerificationCodePasswordPage,
  ResetPasswordPage, CreateVacancyPage, CandidatesPage, SelectionFilterPage,
  ActiveVacanciesPage, ReportsPage,
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
        path="/vacantes/crear"
        element={
          <PrivateRoute>
            <CreateVacancyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidatos"
        element={
          <PrivateRoute>
            <CandidatesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/Filtros"
        element={
          <PrivateRoute>
            <SelectionFilterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vacantes"
        element={
          <PrivateRoute>
            <ActiveVacanciesPage />
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
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil/verificacion"
        element={
          <PrivateRoute>
            <VerificationCodePasswordPage />
          </PrivateRoute>
        }
      />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;