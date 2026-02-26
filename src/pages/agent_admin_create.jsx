import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import { useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import '../PageComponents.css'

const CreateAgentAdmin = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Simple validation
        if (!username || !email || !phone) {
            setError("Please fill in all required fields")
            return
        }

        const payload = {
            username,
            email,
            phone,
            role: "agent_user",
            business_public_id: null,
            vendor_public_id: null,
        }

        setLoading(true)
        setError("")

        try {
            await axios.post("https://edutele-pay-backend.onrender.com/api/users", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader(),
                },
            })

            // Clear form
            setUsername("")
            setEmail("")
            setPhone("")
            alert("Agent admin created successfully")
            setLoading(false)
        } catch (error) {
            console.error("Failed to create agent admin:", error)
            console.log("Response:", error?.response?.data)
            setError(error?.response?.data?.detail || "Failed to create agent admin")
            setLoading(false)
        }
    }

    const fields = [
        { label: "Username", value: username, setter: setUsername, key: "username", type: "text", placeholder: "Enter username", required: true },
        { label: "Email", value: email, setter: setEmail, key: "email", type: "email", placeholder: "Enter email", required: true },
        { label: "Phone", value: phone, setter: setPhone, key: "phone", type: "tel", placeholder: "Enter phone number", required: true },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Add New Agent Admin" showBack={true} backTo="/agent-admin" />

                <div className="flex items-start justify-center px-8 py-10">
                    <form className="w-full max-w-lg page-form-container" onSubmit={handleSubmit}>
                        
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
                                    Add Agent Admin
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

export default CreateAgentAdmin