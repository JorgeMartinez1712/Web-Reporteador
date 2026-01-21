import { Link } from 'react-router-dom';

const SidebarHeader = ({ isCollapsed }) => {
  return (
    <div className="p-4 flex justify-center items-center">
      <Link to="/">
        <img
          src={isCollapsed ? '/assets/logo_pequeño.png' : '/assets/logo_cisneros.png'}
          alt="Logo"
          className={`transition-all duration-300 ${isCollapsed ? 'h-6' : 'h-10'}`}
        />
      </Link>
    </div>
  );
};

export default SidebarHeader;