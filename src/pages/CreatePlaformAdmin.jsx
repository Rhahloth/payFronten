import Sidebar from "../Components/Sidebar"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import { Link } from "react-router-dom"


const CreatePlatformAdmin = () => {

    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Create Platform Admin" />

                <div className="p-10 w-full flex items-center justify-center">
                    <form className="bg-white p-6 rounded shadow-md w-3/4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Admin Name</label>
                            <input type="text" onChange={(e) => setVendorName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter vendors name" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" onChange={(e) => setVendorEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter vendor email" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"> Type</label>
                            <input type="text" onChange={(e) => setVendorType(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter vendor type" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"> Location</label>
                            <input type="text" onChange={(e) => setVendorLocation} className="w-full px-3 py-2 border rounded" placeholder="Enter your location" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"> Contact Person</label>
                            <input type="text" onChange={(e) => setVendorContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter contact person" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"> Contact Phone</label>
                            <input type="text" onChange={(e) => setVendorContactPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter contact phone" />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Vendor</button>
                    </form>
                </div>

            </MainContent>

        </div>
    )
}

export default CreatePlatformAdmin