import { Link, useNavigate } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios"

const BASE_URL = "https://edutele-pay-backend.onrender.com/api"

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)

    const loginCall = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const endpoint = isAdmin ? `${BASE_URL}/login` : `${BASE_URL}/customer/login`


        try {
            const resp = await axios.post(
                endpoint,
                { identifier, password },
                { headers: { "Content-Type": "application/json" } }
            )

            sessionStorage.setItem("token", resp.data.access_token)
            sessionStorage.setItem("role", resp.data.role)
            navigate(isAdmin ? "/" : "/customer-page")
        } catch (err) {
            const detail = err?.response?.data?.detail
            setError(detail || "Invalid credentials. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-2 h-screen w-full">

            {/* Left — Image */}
            <div className="relative overflow-hidden">
                <img
                    src={NfcImage}
                    alt="Login Illustration"
                    className="w-full h-full object-cover"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute" />
                <div className="absolute bottom-10 left-10 text-white">
                    <p className="text-3xl font-bold leading-tight">EduTele Pay</p>
                    <p className="text-sm text-blue-100 mt-1 opacity-80">Smart payments for everyone</p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="bg-gray-50 flex flex-col items-center justify-center px-8">
                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isAdmin ? "Admin Sign In" : "Welcome back"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isAdmin
                                ? "Sign in to the admin dashboard"
                                : "Sign in to your customer account"}
                        </p>
                    </div>

                    {/* Tab Toggle */}
                    <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setIsAdmin(false); setError("") }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                !isAdmin
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsAdmin(true); setError("") }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                isAdmin
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={loginCall} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {isAdmin ? "Username" : "Phone or Email"}
                            </label>
                            <input
                                type="text"
                                required
                                placeholder={isAdmin ? "Enter your username" : "Enter your phone or email"}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-1">
                                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Register link — only show for customer tab */}
                        {!isAdmin && (
                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-blue-600 font-medium hover:underline">
                                    Register now
                                </Link>
                            </p>
                        )}
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login