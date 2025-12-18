import { Link } from 'react-router-dom';

const SidebarHeader = ({ isCollapsed }) => {
  return (
    <div className="p-4 flex justify-center items-center">
      <Link to="/">
        <img
          src={isCollapsed ? '/assets/sin_texto.png' : '/assets/sin_bordes.png'}
          alt="Logo"
          className={`transition-all duration-300 ${isCollapsed ? 'h-9' : 'h-14'}`}
        />
      </Link>
    </div>
  );
};

export default SidebarHeader;