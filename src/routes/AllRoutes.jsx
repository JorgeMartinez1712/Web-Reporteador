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
  SetupWizardPage,
  SubscriptionDashboardPage,
  MultiCompanyPage,
  SecurityDevicesPage,
  BudgetApprovalsPage,
  OwnerSettingsPage,
  OwnerUsersPage,
  // Profile page
  ProfilePage,
  AnalystHomePage,
  ReportsPage,
  CurrenciesPage,
  AccountMappingPage,
  CurrencyPage,
  InpcVariablesPage,
  IncomeStatementPage,
  CashflowPage,
  ProjectionsSimulatorPage,
  BudgetsUploadPage,
  ComparativeReportPage,
  AdminHomePage,
  AdminRequestsPage,
  AdminClientsPage,
  AdminPlansPage,
  AdminAuditLogsPage,
} from '../pages';
import PrivateRoute from './PrivateRoute';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRouter = () => {
  const { user } = useAuth();
  const role = user?.role || 'INTERESADO';

  if (role === 'ADMIN') return <AdminHomePage />;
  if (role === 'ANALISTA') return <AnalystHomePage />;
  if (role === 'DUENO') return <OwnerHomePage />;
  return <InterestedHomePage />;
};

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
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'ANALISTA', 'DUENO', 'INTERESADO']}>
            <DashboardRouter />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-01"
        element={
          <PrivateRoute allowedRoles={['INTERESADO']}>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-02"
        element={
          <PrivateRoute allowedRoles={['DUENO']}>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-03"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        }
      />
      <Route
        path="/home-04"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <Navigate to="/dashboard" replace />
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
          <PrivateRoute allowedRoles={['INTERESADO', 'DUENO']}>
            <InterestedPaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/setup"
        element={
          <PrivateRoute allowedRoles={['DUENO']}>
            <SetupWizardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/ajustes"
        element={
          <PrivateRoute allowedRoles={['DUENO']}>
            <OwnerSettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/monedas"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <CurrenciesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
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

      <Route
        path="/perfil"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'ANALISTA', 'DUENO', 'INTERESADO']}>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/solicitudes"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminRequestsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminClientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/planes"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminPlansPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/auditoria"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminAuditLogsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/control"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <SubscriptionDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/multiempresa"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <MultiCompanyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dispositivos"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <SecurityDevicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aprobaciones"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'DUENO']}>
            <BudgetApprovalsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <PrivateRoute allowedRoles={['DUENO']}>
            <OwnerUsersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/mapeo-galac"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <AccountMappingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasas-monedas"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <CurrencyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/inpc"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <InpcVariablesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/estado-resultados"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <IncomeStatementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/flujo-caja"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <CashflowPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/proyecciones"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <ProjectionsSimulatorPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/presupuestos"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <BudgetsUploadPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/comparativo"
        element={
          <PrivateRoute allowedRoles={['ANALISTA']}>
            <ComparativeReportPage />
          </PrivateRoute>
        }
      />

      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/analista/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/analista/*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/suscripcion/control" element={<Navigate to="/control" replace />} />
      <Route path="/suscripcion/multiempresa" element={<Navigate to="/multiempresa" replace />} />
      <Route path="/suscripcion/dispositivos" element={<Navigate to="/dispositivos" replace />} />
      <Route path="/suscripcion/aprobaciones" element={<Navigate to="/aprobaciones" replace />} />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;
