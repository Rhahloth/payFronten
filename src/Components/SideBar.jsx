import { useState } from 'react'
import { FaBars, FaCog, FaHome, FaSignOutAlt, FaUserAlt, FaBaby, FaUser, FaAccessibleIcon, FaAccusoft, FaAddressBook, FaBuilding, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { getRole, isAuthenticated } from '../utils/authHeader';



const Sidebar = () => {

    const sidebarItems = [
        {
            label: "Home",
            path: "/",
            icon: FaHome,
            roles: ["super_user", "agent_user", "business_user", "vendor"],
        },
        {
            label: "Cards",
            path: "/cards",
            icon: FaAddressBook,
            roles: ["super_user", "agent_user", "business_user"],
        },
        {
            label: "Businesses",
            path: "/business",
            icon: FaBuilding,
            roles: ["super_user", "agent_user"],
        },
        {
            label: "Vendors",
            path: "/vendors",
            icon: FaAccusoft,
            roles: ["super_user", "agent_user", "business_user"],
        },
        {
            label: "Customers",
            path: "/customer",
            icon: FaUserAlt,
            roles: ["super_user", "agent_user", "business_user"],
        },
        {
            label: "Account Admin",
            path: "/agent-admin",
            icon: FaUser,
            roles: ["super_user"],
        },
    ];


    const [isOpen, setIsOpen] = useState(false);
    const role = getRole()
    const loggedIn = isAuthenticated()

    return (
        <div className="flex">
            <div className={`fixed top-0 left-0 h-full md:w-64 bg-gray-800 transition-width duration-300 text-white ${isOpen ? "w-64" : "w-20"}`}>
                <div className="flex justify-between items-center p-4">
                    <h2 className={`text-xl font-bold md:block ${isOpen ? "block" : "hidden"}`}>Dashboard</h2>
                    <button onClick={() => { setIsOpen(!isOpen) }}>
                        {isOpen ? <FaBaby size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <nav className="mt-4">
                    <ul>
                        {loggedIn &&
                            sidebarItems
                                .filter(item => item.roles.includes(role))
                                .map(({ label, path, icon: Icon }) => (
                                    <Link to={path} key={path}>
                                        <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                            <Icon size={24} />
                                            <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>
                                                {label}
                                            </span>
                                        </li>
                                    </Link>
                                ))}
                        { loggedIn ? (
                            <Link to="/logout">
                                <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                    <FaSignOutAlt size={24} />
                                    <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>Logout</span>
                                </li>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                    <FaCog size={24} />
                                    <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>Login</span>
                                </li>
                            </Link>
                        )}
                        
                        
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar