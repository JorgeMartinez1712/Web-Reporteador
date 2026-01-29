import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomModal from '../../common/CustomModal';

const Header = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950">
      <div className="flex items-center justify-between gap-6 px-8 py-4">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[11px] font-semibold tracking-[0.35em] text-white/40">CONTROL DE RECLUTAMIENTO</span>
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-3">
          <Tippy content="Ir a Perfil" placement="bottom">
            <Link
              to="/perfil"
              className="flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              <i className="bi bi-person-circle text-lg text-white" />
              <span>PERFIL</span>
            </Link>
          </Tippy>

          <Tippy content="Cerrar Sesión" placement="bottom">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              <i className="bi bi-box-arrow-right text-lg" />
              <span>SALIR</span>
            </button>
          </Tippy>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar Cierre de Sesión"
      >
        <div className="mb-4 flex items-center space-x-3">
          <p className="text-gray-200">¿Estás seguro de que quieres cerrar sesión?</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="rounded bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setIsModalOpen(false);
              logout();
            }}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
          >
            Confirmar
          </button>
        </div>
      </CustomModal>
    </header>
  );
};

export default Header;