import { useState } from 'react'
import { FaBars, FaCog, FaHome, FaSignOutAlt, FaUserAlt, FaBaby, FaUser, FaAccessibleIcon, FaAccusoft, FaAddressBook } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';


const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const { role } = useContext(AuthContext) 

    console.log("Sidebar role ==>", role)

    return (
        <div className="flex">
            <div className={`fixed top-0 left-0 h-full md:w-64 bg-gray-800 transition-width duration-300 text-white ${isOpen ? "w-64" : "w-20"}`}>
                <div className="flex justify-between items-center p-4">
                    <h2 className={`text-xl font-bold md:block ${isOpen ? "block" : "hidden"}`}>Dashboard</h2>
                    <button onClick={() => { setIsOpen(!isOpen)}}>
                        {isOpen ? <FaBaby size={24}/> : <FaBars size={24}/> }
                    </button>
                </div>
                <nav className="mt-4">
                    <ul>
                        <Link to="/">
                            <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                <FaHome size={24}/>
                                <span className={`ml-4 md:block ${isOpen ? "block": "hidden"}`}>Home</span>
                            </li>
                        </Link>
                        <Link to="/cards">
                            <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                <FaAddressBook size={24}/>
                                <span className={`ml-4 md:block ${isOpen ? "block": "hidden"}`}>Cards</span>
                            </li>
                        </Link>
                       
                        <Link to="/institution">
                            <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                <FaAccessibleIcon size={24} />
                                <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>Institutions</span>
                            </li>
                        </Link>

                        <Link to="/vendors">
                            <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                <FaAccusoft size={24} />
                                <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>Vendors</span>
                            </li>
                        </Link>

                        <Link to="/login">
                            <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                                <FaCog size={24}/>
                                <span className={`ml-4 md:block ${isOpen ? "block": "hidden"}`}>Login as Super Admin</span>
                            </li>
                        </Link>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar