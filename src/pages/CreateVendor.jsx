import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/Sidebar"



const CreateVendor = () =>{
    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Create New Vendor" />

                <div className="p-10 w-full flex items-center justify-center">
                    <form className="bg-white p-6 rounded shadow-md w-3/4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Vendor Name</label>
                            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter vendors name" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"> Location</label>
                            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter your location" />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Vendor</button>
                    </form>
                </div>

            </MainContent>

        </div>
    )
}

export default CreateVendor