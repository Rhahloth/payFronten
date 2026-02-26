import Sidebar from "../Components/SideBar"
import NavBar from "../Components/NavBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import { useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import "../PageComponents.css"

const CreateCustomer = () => {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [gender, setGender] = useState("")
    const [DOB, setDOB] = useState("")
    const [accountType, setAccountType] = useState("")
    const [status, setStatus] = useState("active")
    const [is_verified, setIsVerified] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !phone || !password) {
            setError("Please fill in all required fields")
            return
        }

        const payload = {
            full_name: name,
            phone: phone,
            email: email || null,
            password: password,
            gender: gender || null,
            date_of_birth: DOB || null,
            account_type: accountType || "standard",
            status: status,
            is_verified: is_verified
        }

        setLoading(true)
        setError("")

        try {
            const resp = await axios.post(
                "https://edutele-pay-backend.onrender.com/api/customers",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader()
                    }
                }
            )

            console.log(resp.data)
            alert("Customer added successfully")

            setName("")
            setPhone("")
            setEmail("")
            setPassword("")
            setGender("")
            setDOB("")
            setAccountType("")
            setStatus("active")
            setIsVerified(false)

        } catch (err) {
            console.log(err)
            const detail = err?.response?.data?.detail
            if (Array.isArray(detail)) {
                setError(detail.map(e => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(" | "))
            } else if (typeof detail === "string") {
                setError(detail)
            } else {
                setError("Failed to create customer")
            }
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { label: "Full Name", value: name, setter: setName, key: "name", type: "text", placeholder: "Enter full name", required: true },
        { label: "Phone", value: phone, setter: setPhone, key: "phone", type: "tel", placeholder: "Enter phone number", required: true },
        { label: "Email", value: email, setter: setEmail, key: "email", type: "email", placeholder: "Enter email", required: false },
        { label: "Password", value: password, setter: setPassword, key: "password", type: "password", placeholder: "Enter password (min 6 chars)", required: true },
        { label: "Gender", value: gender, setter: setGender, key: "gender", type: "text", placeholder: "Enter gender", required: false },
        { label: "Date of Birth (YYYY-MM-DD)", value: DOB, setter: setDOB, key: "dob", type: "text", placeholder: "Example: 2000-01-25", required: false },
        { label: "Account Type", value: accountType, setter: setAccountType, key: "accountType", type: "text", placeholder: "Enter account type", required: false },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Add New Customer" showBack={true} backTo="/customer" />

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

                        <div className="mb-6">
                            <label className="block mb-1 page-form-label">Status</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={status === "active"}
                                        onChange={() => setStatus("active")}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={status === "inactive"}
                                        onChange={() => setStatus("inactive")}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Inactive</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={is_verified}
                                    onChange={(e) => setIsVerified(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm page-form-label">Mark as verified</span>
                            </label>
                        </div>

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
                                    Add Customer
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

export default CreateCustomer