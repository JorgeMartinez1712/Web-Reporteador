import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomModal from '../../common/CustomModal'; 

const Header = ({ isSidebarOpen, isCollapsed }) => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header
      className={`bg-gray-100 p-4 flex justify-between items-center transition-all duration-300 ${
        isSidebarOpen && !isCollapsed ? 'ml-64' : isCollapsed ? 'ml-16' : 'ml-0'
      }`}
    >
      <div className="pl-4 py-2">
        <Breadcrumbs isSidebarOpen={isSidebarOpen} isCollapsed={isCollapsed} />
      </div>

      <div className="flex items-center gap-4 pr-10">
        <Tippy content="Ir a Perfil" placement="bottom">
          <Link
            to="/perfil"
            className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <i className="bi bi-person-circle text-2xl"></i>
          </Link>
        </Tippy>

        <Tippy content="Cerrar Sesión" placement="bottom">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <i className="bi bi-box-arrow-right text-2xl"></i>
          </button>
        </Tippy>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar Cierre de Sesión"
      >
        <div className="flex items-center space-x-3 mb-4">
          <p className="text-gray-700">¿Estás seguro de que quieres cerrar sesión?</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setIsModalOpen(false);
              logout();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </CustomModal>
    </header>
  );
};

export default Header;