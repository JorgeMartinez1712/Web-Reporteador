import { Link, useLocation } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const SidebarItem = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)

  if (isCollapsed) {
    return (
      <li className="mb-1">
        <Tippy content={label} placement="right">
          <Link
            to={to}
            className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-gray-200 shadow-md shadow-gray-300/50 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className={`${icon} ${isActive ? 'text-emerald-600' : ''}`} />
          </Link>
        </Tippy>
      </li>
    )
  }

  const baseClass = 'flex items-center w-full p-2 rounded-md transition-all duration-200 text-left'
  const stateClass = isActive
    ? 'bg-gray-200 shadow-md shadow-gray-300/50 text-gray-900 font-medium'
    : 'text-gray-600 hover:bg-gray-200'

  return (
    <li className="mb-1">
      <Link to={to} className={`${baseClass} ${stateClass}`}>
        <i className={`${icon} ${isActive ? 'text-emerald-600' : 'text-gray-600'}`} />
        <span className={`ml-2 truncate ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      </Link>
    </li>
  )
}

export default SidebarItem