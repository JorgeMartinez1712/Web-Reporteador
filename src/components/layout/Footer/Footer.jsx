const Footer = ({ isSidebarOpen, isCollapsed }) => {
  return (
    <footer
      className={`bg-gray-100 shadow-sm border-t border-gray-300 transition-all duration-300 ${
        isSidebarOpen && !isCollapsed ? 'ml-64' : isCollapsed ? 'ml-16' : 'ml-0'
      }`}
    >
      <div className="container mx-auto p-3 flex justify-end items-center">
        <div className="text-right">
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} Administrador. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;