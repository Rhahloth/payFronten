import { useState, useEffect, useCallback, useRef } from 'react'
import { 
    FaCog, 
    FaHome, 
    FaSignOutAlt, 
    FaUserAlt, 
    FaUser, 
    FaAccusoft, 
    FaAddressBook, 
    FaBuilding, 
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom';
import { getRole, isAuthenticated } from '../utils/authHeader';
import '../PageComponents.css';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef(null);
    const role = getRole();
    const loggedIn = isAuthenticated();

    const sidebarItems = [
        { label: "Home",       path: "/",           icon: FaHome,        roles: ["super_user", "agent_user", "business_user", "vendor"] },
        { label: "Admins",     path: "/agent-admin", icon: FaUser,       roles: ["super_user", "agent_user", "business_user"] },
        { label: "Businesses", path: "/business",    icon: FaBuilding,   roles: ["super_user", "agent_user"] },
        { label: "Vendors",    path: "/vendors",     icon: FaAccusoft,   roles: ["business_user"] },
        { label: "Cards",      path: "/cards",       icon: FaAddressBook, roles: ["super_user", "agent_user"] },
        { label: "Customers",  path: "/customer",    icon: FaUserAlt,    roles: ["super_user", "agent_user"] },
    ];

    useEffect(() => {
        let timeoutId;
        const checkScreenSize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const mobile = window.innerWidth < 768;
                setIsMobile(mobile);
                if (mobile) setIsOpen(false);
            }, 100);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => { clearTimeout(timeoutId); window.removeEventListener('resize', checkScreenSize); };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, isOpen]);

    const toggleSidebar = useCallback(() => setIsOpen(prev => !prev), []);
    const isActivePath = useCallback((path) => location.pathname === path, [location.pathname]);

    const navLinkClass = (isActive, extra = '') => `
        relative flex items-center px-3 py-3 rounded-lg
        transition-all duration-200 group
        ${isActive ? 'sidebar-link-active' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
        ${!isOpen ? 'justify-center' : ''}
        ${extra}
    `

    const labelClass = `ml-4 transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                data-sidebar="true"
                className={`
                    fixed top-0 left-0 h-full flex flex-col
                    bg-gray-900 text-white shadow-2xl z-50
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
                `}
                aria-label="Sidebar navigation"
            >
                {/* ── Header ── */}
                <div className="flex items-center h-16 px-4 border-b border-gray-700 flex-shrink-0">
                    <div className={`flex-1 transition-all duration-300 overflow-hidden ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        <h2 className="text-xl font-bold text-white truncate">Dashboard</h2>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className={`
                            flex items-center justify-center w-8 h-8 rounded-lg
                            bg-gray-700 hover:bg-gray-600 text-white
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${isOpen ? 'ml-auto' : 'mx-auto'}
                        `}
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
                    </button>
                </div>

                {/* ── Nav items — scrollable, grows to fill space ── */}
                <nav className="sidebar-nav flex-1 mt-6 px-3 overflow-y-auto">
                    <ul className="space-y-2">
                        {loggedIn && sidebarItems
                            .filter(item => item.roles.includes(role))
                            .map(({ label, path, icon: Icon }) => {
                                const isActive = isActivePath(path);
                                return (
                                    <li key={path} className="sidebar-item">
                                        <Link to={path} className={navLinkClass(isActive)}>
                                            <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                            <span className={labelClass}>{label}</span>
                                            {!isOpen && <span className="sidebar-tooltip">{label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </nav>

                {/* ── Bottom: Logout / Login + footer ── */}
                <div className="flex-shrink-0 border-t border-gray-700">
                    <div className="px-3 py-3">
                        {loggedIn ? (
                            <div className="sidebar-item">
                                <Link
                                    to="/logout"
                                    className={navLinkClass(false, 'hover:!bg-red-600')}
                                >
                                    <FaSignOutAlt size={20} className="flex-shrink-0 text-gray-400 group-hover:text-white" />
                                    <span className={labelClass}>Logout</span>
                                    {!isOpen && <span className="sidebar-tooltip">Logout</span>}
                                </Link>
                            </div>
                        ) : (
                            <div className="sidebar-item">
                                <Link
                                    to="/login"
                                    className={navLinkClass(false, 'hover:!bg-blue-600')}
                                >
                                    <FaCog size={20} className="flex-shrink-0 text-gray-400 group-hover:text-white" />
                                    <span className={labelClass}>Login</span>
                                    {!isOpen && <span className="sidebar-tooltip">Login</span>}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Footer text */}
                    {isOpen && (
                        <div className="px-4 pb-4 text-xs text-gray-400 text-center">
                            <p>© 2026 Edutele Pay</p>
                            <p className="mt-1">Version 1.0.0</p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;