import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/Sidebar"
import { Link } from "react-router-dom"


const PlatformAdmin = () => {
    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="View All Platform Admin" />
                <div className="ml-20">
                    <h2>Available Platform Admin <span className="ml-20 text-blue-700"> <Link to="/create-platform-admin">Create Platform Admin</Link> </span> </h2>
                </div>
                <div className="p-10 w-full">
                    <table className=" bg-white mt-6 w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Card Number</th>
                                <th className="py-2 px-4 border-b border-gray-200">Card Holder</th>
                                <th className="py-2 px-4 border-b border-gray-200">Expiry Date</th>
                                <th className="py-2 px-4 border-b border-gray-200">Status</th>
                                <th className="py-2 px-4 border-b border-gray-200">Edit</th>
                                <th className="py-2 px-4 border-b border-gray-200">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">**** **** **** 1234</td>
                                <td className="py-2 px-4 border-b border-gray-200">John Doe</td>
                                <td className="py-2 px-4 border-b border-gray-200">12/24</td>
                                <td className="py-2 px-4 border-b border-gray-200">Active</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer">Edit</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer">Delete</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">**** **** **** 5678</td>
                                <td className="py-2 px-4 border-b border-gray-200">Jane Smith</td>
                                <td className="py-2 px-4 border-b border-gray-200">11/23</td>
                                <td className="py-2 px-4 border-b border-gray-200">Inactive</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer">Edit</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer">Delete</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </MainContent>
        </div>
    )
}

export default PlatformAdmin