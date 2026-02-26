import { useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import '../PageComponents.css'

const RegisterBusiness = () => {
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const registerBusiness = async (e) => {
        e.preventDefault()
        
        // Simple validation
        if (!name || !type || !email || !phone) {
            setError("Please fill in all required fields")
            return
        }

        const payload = {
            name: name,
            type: type,
            email: email,
            phone: phone,
            location: location,
            contact_person: contactPerson,
            contact_phone: contactPhone,
        }

        setLoading(true)
        setError("")

        try {
            const resp = await axios.post(
                "https://edutele-pay-backend.onrender.com/api/businesses",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader(),
                    },
                }
            )

            console.log(resp.data)
            alert("Successful! Check your email for passwords")
            
            // Clear form
            setName("")
            setType("")
            setEmail("")
            setPhone("")
            setLocation("")
            setContactPerson("")
            setContactPhone("")
            
            setLoading(false)
        } catch (err) {
            console.log(err)
            setError("Failed to register business. Please try again.")
            setLoading(false)
        }
    }

    const fields = [
        { label: "Business Name", value: name, setter: setName, key: "name", required: true },
        { label: "Type", value: type, setter: setType, key: "type", placeholder: "eg school", required: true },
        { label: "Email", value: email, setter: setEmail, key: "email", type: "email", required: true },
        { label: "Phone", value: phone, setter: setPhone, key: "phone", placeholder: "Enter phone number", required: true },
        { label: "Location", value: location, setter: setLocation, key: "location", required: false },
        { label: "Contact Person", value: contactPerson, setter: setContactPerson, key: "contactPerson", required: false },
        { label: "Contact Phone", value: contactPhone, setter: setContactPhone, key: "contactPhone", required: false },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Create Business" showBack={true} backTo="/business" />

                <div className="flex items-start justify-center px-8 py-10">
                    <form className="w-full max-w-lg page-form-container" onSubmit={registerBusiness}>
                        
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {fields.map(({ label, value, setter, key, type = "text", placeholder, required }) => (
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
                                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
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
                                    Add Business
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

export default RegisterBusiness