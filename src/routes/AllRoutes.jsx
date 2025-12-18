import { Routes, Route } from 'react-router-dom';
import {
  RegisterEnterprisePage, RegisterBranchPage, LoginPage, RegisterPage, ForgotPasswordPage, NotFoundPage,
  RegisterSellerPage, HomePage, FinancierPage, UsersPage, SalesPage, CustomerPage, PlanPage, VerificactionCodePage, ProfilePage, ParametersPage, ProductPage, BrandsPage,
  DetailEnterprisePage, DetailProductPage, DetailPlanPage, CreatePlanPage, PromotionsPage, DetailUserPage, DetailCustomerPage, SaleWizardPage, VerificationCodePasswordPage,
  CreatePromotionPage, PromotionDetailPage, SaleDetailPage, SaleEditWizardPage, DevicesPage, PagosPage, ParametrosPage, ResetPasswordPage, RegisterPaymentPage, Levelspage,
  AccountsPage, OrdersPage, ShopPage, ProfitabilityPage,
  CategoriesPage,
  InitialPaymentsPage, InstallmentPaymentsPage,
  DetallePagoPage, Inventorypage

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
        path="/ventas/registrar"
        element={
          <PrivateRoute>
            <SaleWizardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/empresas"
        element={
          <PrivateRoute>
            <RegisterEnterprisePage />
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
      <Route
        path="/parametrizacion"
        element={
          <PrivateRoute>
            <ParametersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/niveles"
        element={
          <PrivateRoute>
            <Levelspage />
          </PrivateRoute>
        }
      />
      <Route
        path="/inventario"
        element={
          <PrivateRoute>
            <Inventorypage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <PrivateRoute>
            <CategoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/parametros"
        element={
          <PrivateRoute>
            <ParametrosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes/cuentas-por-cobrar"
        element={
          <PrivateRoute>
            <AccountsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes/ordenes"
        element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes/pagos-tiendas"
        element={
          <PrivateRoute>
            <ShopPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes/rentabilidad"
        element={
          <PrivateRoute>
            <ProfitabilityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/marcas"
        element={
          <PrivateRoute>
            <BrandsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/planes"
        element={
          <PrivateRoute>
            <PlanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dispositivos"
        element={
          <PrivateRoute>
            <DevicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/planes/nuevo"
        element={
          <PrivateRoute>
            <CreatePlanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/planes/:id"
        element={
          <PrivateRoute>
            <DetailPlanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <CustomerPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ventas"
        element={
          <PrivateRoute>
            <SalesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ventas/:id"
        element={
          <PrivateRoute>
            <SaleDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ventas/completar/:id"
        element={
          <PrivateRoute>
            <SaleEditWizardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/sucursales"
        element={
          <PrivateRoute>
            <RegisterBranchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/promociones"
        element={
          <PrivateRoute>
            <PromotionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/promociones/nuevo"
        element={
          <PrivateRoute>
            <CreatePromotionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/promociones/:id"
        element={
          <PrivateRoute>
            <PromotionDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/empresas/:id"
        element={
          <PrivateRoute>
            <DetailEnterprisePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/:id"
        element={
          <PrivateRoute>
            <DetailProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios/:id"
        element={
          <PrivateRoute>
            <DetailUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes/:id"
        element={
          <PrivateRoute>
            <DetailCustomerPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/financiamiento"
        element={
          <PrivateRoute>
            <FinancierPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagos"
        element={
          <PrivateRoute>
            <PagosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagos/iniciales"
        element={
          <PrivateRoute>
            <InitialPaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagos/cuotas"
        element={
          <PrivateRoute>
            <InstallmentPaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagos/registrar"
        element={
          <PrivateRoute>
            <RegisterPaymentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagos/detalle/:id"
        element={
          <PrivateRoute>
            <DetallePagoPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/vendedores"
        element={
          <PrivateRoute>
            <RegisterSellerPage />
          </PrivateRoute>
        }
      />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;