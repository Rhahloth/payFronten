
import Navbar from '../Components/NavBar'
import DataCard from '../Components/DataCard'
import SectionHeader from '../Components/SectionHeader'
import { FaAddressBook, FaUser } from 'react-icons/fa'
import MainContent from '../Components/MainContent'
import Sidebar from '../Components/SideBar'

const CustomerPage = () => {
    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <Navbar />
                <SectionHeader title="Quick Overview" />
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <div className="bg-white shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-[480px] rounded-lg p-4 items-center">
                        <div className="text-3xl text-blue-500 mt-4">
                            
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mt-4">Card Number - EDU-001</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-4">Balance - $</p>
                        </div>
                    </div>
                </div>
                <SectionHeader title="Recent Activities" />
                <div className="p-10 w-full">
                    <table className="bg-white w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Activity</th>
                                <th className="py-2 px-4 border-b border-gray-200">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">User John Doe signed up</td>
                                <td className="py-2 px-4 border-b border-gray-200">2024-10-01</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Payment of $100 processed</td>
                                <td className="py-2 px-4 border-b border-gray-200">2024-10-02</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Payment of $100 processed</td>
                                <td className="py-2 px-4 border-b border-gray-200">2024-10-02</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Payment of $100 processed</td>
                                <td className="py-2 px-4 border-b border-gray-200">2024-10-02</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Payment of $100 processed</td>
                                <td className="py-2 px-4 border-b border-gray-200">2024-10-02</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </MainContent>
        </div>
    )

}

export default CustomerPage