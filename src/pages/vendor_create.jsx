import { useState } from "react"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import '../PageComponents.css'

const CreateVendor = () => {
    const [vendorName, setVendorName] = useState("")
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorType, setVendorType] = useState("")
    const [vendorLocation, setVendorLocation] = useState("")
    const [vendorContactPerson, setVendorContactPerson] = useState("")
    const [vendorContactPhone, setVendorContactPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const CreateVendor = async (e) => {
        e.preventDefault()

        // Simple validation
        if (!vendorName || !vendorEmail || !vendorType) {
            setError("Please fill in all required fields")
            return
        }

        const payload = {
            name: vendorName,
            type: vendorType,
            email: vendorEmail,
            location: vendorLocation,
            contact_person: vendorContactPerson,
            contact_phone: vendorContactPhone
        }
        
        setLoading(true)
        setError("")
        
        try {
            const resp = await axios.post(
                "https://edutele-pay-backend.onrender.com/api/vendors", 
                payload, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader()
                    }
                }
            )
            
            console.log(resp.data)
            alert("Vendor created successfully")
            
            // Clear form
            setVendorName("")
            setVendorEmail("")
            setVendorType("")
            setVendorLocation("")
            setVendorContactPerson("")
            setVendorContactPhone("")
            
            setLoading(false)
        } catch (err) {
            console.log(err)
            setError(err?.response?.data?.detail || "Failed to create vendor")
            setLoading(false)
        }
    }

    const fields = [
        { label: "Vendor Name", value: vendorName, setter: setVendorName, key: "name", type: "text", placeholder: "Enter vendor name", required: true },
        { label: "Email", value: vendorEmail, setter: setVendorEmail, key: "email", type: "email", placeholder: "Enter vendor email", required: true },
        { label: "Type", value: vendorType, setter: setVendorType, key: "type", type: "text", placeholder: "Enter vendor type (e.g., canteen)", required: true },
        { label: "Location", value: vendorLocation, setter: setVendorLocation, key: "location", type: "text", placeholder: "Enter location", required: false },
        { label: "Contact Person", value: vendorContactPerson, setter: setVendorContactPerson, key: "contactPerson", type: "text", placeholder: "Enter contact person", required: false },
        { label: "Contact Phone", value: vendorContactPhone, setter: setVendorContactPhone, key: "contactPhone", type: "tel", placeholder: "Enter contact phone", required: false },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Create New Vendor" showBack={true} backTo="/vendors" />

                <div className="flex items-start justify-center px-8 py-10">
                    <form className="w-full max-w-lg page-form-container" onSubmit={CreateVendor}>
                        
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {fields.map(({ label, value, setter, key, type, placeholder, required }) => (
                            <div key={key} className="mb-6">
                                <label className="block mb-1 page-form-label">
                                    {label}
                                    {required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <input
                                    type={type}
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                    className="w-full px-3 py-2 page-form-input"
                                    placeholder={placeholder}
                                    required={required}
                                />
                            </div>
                        ))}

                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-2">
                                    <div className="h-5 w-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-6 py-2 page-btn-save"
                                >
                                    Add Vendor
                                </button>
                            )}
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            <span className="text-red-500">*</span> Required fields
                        </p>
                    </form>
                </div>

            </MainContent>
        </div>
    )
}

export default CreateVendor