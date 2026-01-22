import { Link, useLocation } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const SidebarItem = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)

  if (isCollapsed) {
    const collapsedClass = `flex items-center justify-center p-1 transition-all duration-200 ${
      isActive
        ? 'bg-claro shadow-md shadow-gray-300 text-oscuro font-medium rounded-full'
        : 'text-oscuro hover:bg-claro rounded-full'
    } focus:outline-none focus-visible:ring-2 focus-visible:ring-oscuro focus-visible:ring-offset-2 focus-visible:ring-offset-white`

    return (
      <li className="mb-1">
        <Tippy content={label} placement="right">
          <Link to={to} className={collapsedClass}>
            <i className={`${icon} ${isActive ? 'text-oscuro' : ''}`} />
          </Link>
        </Tippy>
      </li>
    )
  }

  const baseClass = 'flex items-center w-full p-2 rounded-md transition-all duration-200 text-left'
  const stateClass = isActive
    ? 'bg-claro shadow-md shadow-claro/50 text-oscuro font-medium'
    : 'text-oscuro hover:bg-claro'

  return (
    <li className="mb-1">
      <Link to={to} className={`${baseClass} ${stateClass}`}>
        <i className={`${icon} ${isActive ? 'text-oscuro' : 'text-hover'}`} />
        <span className={`ml-2 truncate ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      </Link>
    </li>
  )
}

export default SidebarItem