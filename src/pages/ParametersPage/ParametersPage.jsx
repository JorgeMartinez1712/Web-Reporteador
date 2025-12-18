import { useState } from 'react';
import ParameterCard from '../../components/Parameters/ParameterCard';
import ParameterManagementModal from '../../components/Parameters/ParameterManagementModal';
import UserTypesManagement from '../../components/Parameters/UserTypesManagement';
import CustomerTypeManagement from '../../components/Parameters/CustomerTypeManagement';
import CustomerStatusManagement from '../../components/Parameters/CustomerStatusManagement';
import UserStatusManagement from '../../components/Parameters/UserStatusManagement';
import DocumentTypeManagement from '../../components/Parameters/DocumentTypeManagement';
import FinancingPlanStatusManagement from '../../components/Parameters/FinancingPlanStatusManagement';
import ProductStatusManagement from '../../components/Parameters/ProductStatusManagement';
import InventoryStatusManagement from '../../components/Parameters/InventoryStatusManagement';
import CategoryManagement from '../../components/Parameters/CategoryManagement';
import PromotionStatusManagement from '../../components/Parameters/PromotionStatusManagement';
import SaleStatusManagement from '../../components/Parameters/SaleStatusManagement';
import PaymentStatusManagement from '../../components/Parameters/PaymentStatusManagement';
import PaymentMethodStatusManagement from '../../components/Parameters/PaymentMethodStatusManagement';
import PayoutStatusManagement from '../../components/Parameters/PayoutStatusManagement';
import DeviceLockStatusManagement from '../../components/Parameters/DeviceLockStatusManagement';
import BcvRatesManagement from '../../components/Parameters/BcvRatesManagement';
import CurrenciesManagement from '../../components/Parameters/CurrenciesManagement';
import BcvCurrenciesManagement from '../../components/Parameters/BcvCurrenciesManagement';
import LevelsManagement from '../../components/Parameters/LevelsManagement';
import PaymentMethodManagement from '../../components/Parameters/PaymentMethodManagement';
import BcvCurrenciesHistory from '../../components/Parameters/BcvCurrenciesHistory';

const ParametersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (contentComponent, title) => {
    setModalContent(contentComponent);
    setModalTitle(title);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  return (
    <div className="p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-emerald-700 tracking-tight">
          Parametrización
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ParameterCard
          title="Tipos de usuario"
          description="Gestiona los diferentes roles y tipos de usuarios."
          iconClass="bi bi-people-fill"
          onClick={() => openModal(<UserTypesManagement />, 'Gestionar tipos de usuario')}
        />
          <ParameterCard
          title="Estados de usuario"
          description="Define y gestiona los estados posibles para los usuarios del sistema."
          iconClass="bi bi-person-circle"
          onClick={() => openModal(<UserStatusManagement />, 'Gestionar estados de usuario')}
        />
        <ParameterCard
          title="Tipos de cliente"
          description="Gestiona los distintos tipos de clientes (Natural, Jurídico, etc.)."
          iconClass="bi bi-person-badge"
          onClick={() => openModal(<CustomerTypeManagement />, 'Gestionar tipos de cliente')}
        />
        <ParameterCard
          title="Estados de cliente"
          description="Administra los diferentes estados en los que puede encontrarse un cliente."
          iconClass="bi bi-person-check-fill"
          onClick={() => openModal(<CustomerStatusManagement />, 'Gestionar estados de cliente')}
        />
        <ParameterCard
          title="Tipos de documento"
          description="Configura los tipos de documentos válidos para registros."
          iconClass="bi bi-file-earmark-text-fill"
          onClick={() => openModal(<DocumentTypeManagement />, 'Gestionar tipos de documento')}
        />
        <ParameterCard
          title="Estados planes de financiamiento"
          description="Define y gestiona los estados de los planes de financiamiento."
          iconClass="bi bi-currency-dollar"
          onClick={() => openModal(<FinancingPlanStatusManagement />, 'Gestionar estados de planes de financiamiento')}
        />
        <ParameterCard
          title="Estados de producto"
          description="Gestiona los estados de disponibilidad y visibilidad de los productos."
          iconClass="bi bi-box-seam-fill"
          onClick={() => openModal(<ProductStatusManagement />, 'Gestionar estados de producto')}
        />
        <ParameterCard
          title="Estados de inventario"
          description="Administra los estados de existencia y disponibilidad del inventario."
          iconClass="bi bi-boxes"
          onClick={() => openModal(<InventoryStatusManagement />, 'Gestionar estados de inventario')}
        />
        
        <ParameterCard
          title="Estados de promoción"
          description="Define los estados de tus promociones (activa, expirada, etc.)."
          iconClass="bi bi-megaphone-fill"
          onClick={() => openModal(<PromotionStatusManagement />, 'Gestionar estados de promoción')}
        />
        <ParameterCard
          title="Estados de venta"
          description="Gestiona los diferentes estados en los que puede encontrarse una venta."
          iconClass="bi bi-cash-stack"
          onClick={() => openModal(<SaleStatusManagement />, 'Gestionar estados de venta')}
        />
        <ParameterCard
          title="Estados de pago"
          description="Define y gestiona los estados de los pagos (ej. Pendiente, Completado, Fallido)."
          iconClass="bi bi-credit-card-fill"
          onClick={() => openModal(<PaymentStatusManagement />, 'Gestionar estados de pago')}
        />
        <ParameterCard
          title="Estados de métodos de pago"
          description="Gestiona los estados de los métodos de pago disponibles."
          iconClass="bi bi-credit-card-2-front-fill"
          onClick={() => openModal(<PaymentMethodStatusManagement />, 'Gestionar estados de métodos de pago')}
        />
        <ParameterCard
          title="Métodos de pago"
          description="Gestiona los métodos de pago disponibles."
          iconClass="bi bi-credit-card"
          onClick={() => openModal(<PaymentMethodManagement />, 'Gestionar métodos de pago')}
        />
        <ParameterCard
          title="Estados de desembolso"
          description="Administra los estados de los pagos a financistas."
          iconClass="bi bi-cash-coin"
          onClick={() => openModal(<PayoutStatusManagement />, 'Gestionar estados de desembolso')}
        />
        <ParameterCard
          title="Estados de bloqueo dispositivo"
          description="Controla los estados de bloqueo de dispositivos asociados a la plataforma."
          iconClass="bi bi-lock-fill"
          onClick={() => openModal(<DeviceLockStatusManagement />, 'Gestionar estados de bloqueo de dispositivo')}
        />
        <ParameterCard
          title="Monedas"
          description="Gestiona las diferentes monedas utilizadas en el sistema."
          iconClass="bi bi-coin"
          onClick={() => openModal(<CurrenciesManagement />, 'Gestionar monedas')}
        />
        <ParameterCard
          title="Histórico tasa oficial BCV"
          description="Consulta el histórico de tasas oficiales publicadas por el BCV."
          iconClass="bi bi-graph-up-arrow"
          onClick={() => openModal(<BcvCurrenciesHistory />, 'Histórico tasa oficial BCV')}
        />
      
      </div>

      <ParameterManagementModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        {modalContent}
      </ParameterManagementModal>
    </div>
  );
};

export default ParametersPage;