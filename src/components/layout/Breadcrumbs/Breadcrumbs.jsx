import { Link, useLocation } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Breadcrumbs = ({ isSidebarOpen, isCollapsed }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  let sectionName = pathnames[0] ? pathnames[0].toUpperCase() : 'HOME';
  let currentItem = pathnames[1] ? pathnames[1] : null;

  if (currentItem && !isNaN(Number(currentItem)) && currentItem.length > 0) {
    currentItem = 'DETALLE';
  } else {
    currentItem = currentItem ? currentItem.toUpperCase() : null;
  }

  let sectionLink = `/${pathnames[0] || ''}`;

  if (pathnames[0] === 'pagos') {
    let category = null;
    if (pathnames[1] === 'iniciales') category = 'iniciales';
    if (pathnames[1] === 'cuotas') category = 'cuotas';
    if (pathnames[1] === 'detalle') {
      const stateCategory = location.state?.paymentCategory;
      const storedCategory = typeof window !== 'undefined' ? sessionStorage.getItem('lastPaymentCategory') : null;
      category = stateCategory || storedCategory || null;
      if (category) {
        sectionName = `PAGOS ${category === 'iniciales' ? 'INICIALES' : 'CUOTAS'}`;
      }
    }
    if (category === 'iniciales' || category === 'cuotas') {
      sectionLink = `/pagos/${category}`;
    }
  }

  return (
    <nav
      className={`text-sm text-fuchsia-900 transition-all duration-300 ${isSidebarOpen && !isCollapsed ? 'ml-64' : isCollapsed ? 'ml-16' : 'ml-0'
        }`}
    >
      <ul className="flex space-x-2">
        <li>
          <Tippy content="Ir al Inicio" placement="bottom">
            <Link to="/" className="hover:underline text-fuchsia-900 font-bold text-lg">
              INICIO
            </Link>
          </Tippy>
        </li>
        {sectionName && sectionName !== 'HOME' && (
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Tippy content={`Ir a ${sectionName.toLowerCase()}`} placement="bottom">
              <Link to={sectionLink} className="hover:underline text-fuchsia-900 text-lg">
                {sectionName}
              </Link>
            </Tippy>
          </li>
        )}
        {currentItem && (
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-fuchsia-900 text-lg">{currentItem}</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;