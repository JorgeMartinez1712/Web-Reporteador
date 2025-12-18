import SidebarHeader from './SidebarHeader';
import SidebarSection from './SidebarSection';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, isCollapsed, toggleCollapse }) => {
    const location = useLocation();

    const sections = [
        {
            title: 'Operaciones',
            icon: 'bi bi-cart',
            titleIcon: 'bi bi-cart-fill',
            items: [
                { to: '/ventas', icon: 'bi bi-cart-check', label: 'Ventas' },
                { to: '/pagos/iniciales', icon: 'bi bi-cash-coin', label: 'Pagos iniciales' },
                { to: '/pagos/cuotas', icon: 'bi bi-cash-stack', label: 'Pagos cuotas' },
                { to: '/dispositivos', icon: 'bi bi-phone', label: 'Dispositivos' },
            ].map(item => ({
                ...item,
                isActive: location.pathname.startsWith(item.to),
            })),
        },
        {
            title: 'Gestión',
            icon: 'bi bi-people',
            titleIcon: 'bi bi-people-fill',
            items: [
                { to: '/niveles', icon: 'bi bi-bar-chart-line-fill', label: 'Niveles' },
                { to: '/categorias', icon: 'bi bi-tags-fill', label: 'Categorías' },
                { to: '/planes', icon: 'bi bi-list-check', label: 'Planes' },
                { to: '/marcas', icon: 'bi bi-tags', label: 'Marcas' },
                { to: '/productos', icon: 'bi bi-box-seam', label: 'Productos' },
                { to: '/inventario', icon: 'bi bi-list-ul', label: 'Inventario' },
                { to: '/promociones', icon: 'bi bi-megaphone', label: 'Promociones' },
                { to: '/clientes', icon: 'bi bi-person-lines-fill', label: 'Clientes' },
            ].map(item => ({
                ...item,
                isActive: location.pathname.startsWith(item.to),
            })),
        },
        {
            title: 'Reportes',
            icon: 'bi bi-clipboard-data',
            titleIcon: 'bi bi-clipboard2-data-fill',
            items: [
                { to: '/reportes/cuentas-por-cobrar', icon: 'bi bi-receipt', label: 'Cuentas por cobrar' },
                { to: '/reportes/ordenes', icon: 'bi bi-clipboard-data', label: 'Ordenes' },
                { to: '/reportes/pagos-tiendas', icon: 'bi bi-shop', label: 'Pagos en tiendas' },
                { to: '/reportes/rentabilidad', icon: 'bi bi-graph-up', label: 'Rentabilidad' },
            ].map(item => ({
                ...item,
                isActive: location.pathname.startsWith(item.to),
            })),
        },
        {
            title: 'Configuraciones',
            icon: 'bi bi-gear',
            titleIcon: 'bi bi-gear-fill',
            items: [
                { to: '/empresas', icon: 'bi bi-building', label: 'Empresas' },
                { to: '/financiamiento', icon: 'bi bi-cash', label: 'Financistas' },
                { to: '/parametrizacion', icon: 'bi bi-sliders', label: 'Parametrización' },
                { to: '/usuarios', icon: 'bi bi-person-bounding-box', label: 'Usuarios' },
            ].map(item => ({
                ...item,
                isActive: location.pathname.startsWith(item.to),
            })),
        },
    ];

    return (
        <div
            className={`fixed top-0 left-0 h-full flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-100 text-gray-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out z-50 border-r border-gray-300`}
        >
            <SidebarHeader isCollapsed={isCollapsed} />
            <div className="p-4 pt-0 flex-1 overflow-y-auto">
                {sections.map((section, index) => (
                    <SidebarSection
                        key={index}
                        title={section.title}
                        items={section.items}
                        isCollapsed={isCollapsed}
                        icon={section.icon}
                        titleIcon={section.titleIcon}
                    />
                ))}
            </div>
            <button
                onClick={toggleCollapse}
                className="absolute top-1/2 -right-5 transform -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-2 shadow-md cursor-pointer"
            >
                <i className={`bi ${isCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
            </button>
        </div>
    );
};

export default Sidebar;