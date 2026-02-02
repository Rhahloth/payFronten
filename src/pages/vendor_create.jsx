import { useState } from "react"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import axios from "axios"
import { authHeader } from "../utils/authHeader"



const CreateVendor = () =>{

    // {
    //     "name": "string",
    //     "email": "user@example.com",
    //     "type": "canteen",
    //     "location": "string",
    //     "contact_person": "string",
    //     "contact_phone": "string"
    // }

    const [vendorName, setVendorName] = useState("")
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorType, setVendorType] = useState("")
    const [vendorLocation, setVendorLocation] = useState()
    const [vendorContactPerson, setVendorContactPerson] = useState()
    const [vendorContactPhone, setVendorContactPhone] = useState()

    const CreateVendor = async(e) => {
        e.preventDefault()

        const payload = {
            name: vendorName,
            email: vendorEmail,
            type: vendorType,
            location: vendorLocation,
            contact_person: vendorContactPerson,
            contact_phone: vendorContactPhone
        }
        try{
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/vendors", payload, {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": authHeader()
                }
            })
            
            console.log(resp.data)
            alert("Vendor created successfully")

        }catch(err){
            console.log(err)
        }

    }

    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Create New Vendor" />

                <div className="p-10 w-full flex items-center justify-center">
                    <form className="bg-white p-6 rounded shadow-md w-3/4" onSubmit={CreateVendor}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Vendor Name</label>
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
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Vendor</button>
                    </form>
                </div>

            </MainContent>

        </div>
    )
}

export default CreateVendor