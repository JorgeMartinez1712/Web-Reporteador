import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import { useLocation } from 'react-router-dom';

const SidebarSection = ({ title, items, isCollapsed, icon, titleIcon }) => {
    const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
    const titleIconColor = 'text-fuchsia-900';
    const activeSectionColor = 'text-fuchsia-900';
    const location = useLocation();
    const isAnyItemActive = items.some(item => location.pathname.startsWith(item.to));

    const sectionIconClass = isAnyItemActive ? `${titleIcon} ${activeSectionColor} ${isCollapsed ? 'text-lg' : 'mr-2'}` : `${icon} ${titleIconColor} ${isCollapsed ? 'text-lg' : 'mr-2'}`;

    useEffect(() => {
        if (!isAnyItemActive) {
            setIsSectionCollapsed(false);
        }
    }, [location.pathname, isAnyItemActive]);

    return (
        <div className="mt-4">
            <div
                className={`group flex items-center cursor-pointer p-2 rounded-md hover:bg-fuchsia-200 transition-colors duration-200 ${
                    isCollapsed ? 'justify-center' : 'justify-between'
                }`}
                onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
            >
                <i className={sectionIconClass}></i>
                {!isCollapsed && <h3 className="text-base font-medium text-fuchsia-900 flex-grow">{title}</h3>}
                {!isCollapsed && <i
                    className={`bi text-fuchsia-900 text-sm transition-transform duration-200 ${
                        isSectionCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'
                    }`}
                >
                </i>}
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isSectionCollapsed ? 'max-h-0' : 'max-h-96'
                }`}
            >
                <ul className={`mt-2 space-y-1 ${isCollapsed ? 'text-center' : ''}`}>
                    {items.map((item, index) => (
                        <SidebarItem
                            key={index}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidebarSection;