import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomModal from '../../common/CustomModal';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return document.documentElement.dataset.theme || localStorage.getItem('preferred-theme') || 'dark';
};

const Header = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const logoutButtonClasses =
    theme === 'dark'
      ? 'flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20'
      : 'flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/15';

  return (
    <header className="sticky top-0 z-40 border-b border-glass-border bg-app-bg">
      <div className="flex items-center justify-between gap-6 px-8 py-4">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[11px] font-semibold tracking-[0.35em] text-text-muted">SISTEMA DE REPORTES</span>
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-3">
          <Tippy content={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} placement="bottom">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-card px-4 py-2 text-xs font-semibold text-text-base transition hover:border-brand-secondary"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-lg`} />
              <span>{theme === 'dark' ? 'MODO CLARO' : 'MODO OSCURO'}</span>
            </button>
          </Tippy>
          <Tippy content="Ir a Perfil" placement="bottom">
            <Link
              to="/perfil"
              className="flex items-center gap-2 rounded-2xl border border-glass-border bg-transparent px-4 py-2 text-xs font-semibold text-text-muted transition hover:bg-glass-card"
            >
              <i className="bi bi-person-circle text-lg text-text-base" />
              <span>PERFIL</span>
            </Link>
          </Tippy>

          <Tippy content="Cerrar Sesión" placement="bottom">
            <button onClick={() => setIsModalOpen(true)} className={logoutButtonClasses}>
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
          <p className="text-text-base">¿Estás seguro de que quieres cerrar sesión?</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="rounded border border-glass-border bg-transparent px-4 py-2 text-text-base transition hover:bg-glass-card"
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