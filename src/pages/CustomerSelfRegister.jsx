import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const BASE_URL = "https://edutele-pay-backend.onrender.com/api"

const CustomerSelfRegister = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: "",
        gender: "",
        date_of_birth: "",
        account_type: "standard",
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.")
            return
        }

        const payload = {
            full_name: form.full_name,
            phone: form.phone,
            email: form.email || undefined,
            password: form.password,
            gender: form.gender || undefined,
            date_of_birth: form.date_of_birth || undefined,
            account_type: form.account_type || "standard",
        }

        setLoading(true)
        try {
            await axios.post(`${BASE_URL}/customers/register`, payload, {
                headers: { "Content-Type": "application/json" },
            })

            // Auto-login after registration
            const loginResp = await axios.post(
                `${BASE_URL}/customer/login`,
                { identifier: form.phone, password: form.password },
                { headers: { "Content-Type": "application/json" } }
            )

            sessionStorage.setItem("token", loginResp.data.access_token)
            sessionStorage.setItem("role", loginResp.data.role)

            navigate("/customer-page")
        } catch (err) {
            const detail = err?.response?.data?.detail
            setError(detail || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Create an account</h1>
                    <p className="text-sm text-gray-500 mt-1">Fill in your details to get started</p>
                </div>

                {/* Error / Success banners */}
                {error && (
                    <div className="mb-5 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-5 px-4 py-3 rounded bg-green-50 border border-green-200 text-green-600 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            placeholder="John Doe"
                            value={form.full_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="+256 700 000 000"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>

                    {/* Gender + Date of Birth side by side */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-600"
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={form.date_of_birth}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Account Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                        </label>
                        <select
                            name="account_type"
                            value={form.account_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-600"
                        >
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            placeholder="Repeat your password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>

                    {/* Submit */}
                    {loading ? (
                        <div className="flex justify-center py-1">
                            <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-medium text-sm transition-colors"
                        >
                            Create Account
                        </button>
                    )}

                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default CustomerSelfRegister