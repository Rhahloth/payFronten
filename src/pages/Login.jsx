import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import NfcImage from "../assets/nfcimage.png"
import { FaUser, FaLock, FaPhone, FaEnvelope } from 'react-icons/fa'
import '../PageComponents.css'

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
            const resp = await axios.post(endpoint, { identifier, password }, {
                headers: { "Content-Type": "application/json" }
            })
            sessionStorage.setItem("token", resp.data.access_token)
            sessionStorage.setItem("role", isAdmin ? resp.data.role : "customer")
            navigate(isAdmin ? "/" : "/customer-page")
        } catch (err) {
            setError(err?.response?.data?.detail || "Invalid credentials. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page-wrapper">
            <div className="container mx-auto px-4 py-8">

                {/* Card */}
                <div className="auth-card max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* Left Panel */}
                    <div className="hidden lg:flex auth-left-panel">
                        <img src={NfcImage} alt="Login Illustration" className="animate-float" />
                        <h2>{isAdmin ? "Admin Access" : "Welcome Back!"}</h2>
                        <p>
                            {isAdmin
                                ? "Secure admin dashboard for managing your platform"
                                : "Sign in to your account to manage your cards and transactions"
                            }
                        </p>

                        {/* Feature list */}
                        <div className="mt-8 space-y-3 w-full">
                            {[
                                "Secure encrypted login",
                                "24/7 account access",
                                "Real-time transaction updates",
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3" style={{ color: '#bfdbfe' }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#93c5fd', flexShrink: 0 }} />
                                    <span className="text-sm">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="auth-right-panel">
                        <div className="max-w-md mx-auto">

                            {/* Logo */}
                            <div className="auth-header">
                                <h1>EduTele Pay</h1>
                                <p>Smart payments platform</p>
                            </div>

                            {/* Customer / Admin tab toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                                <button
                                    type="button"
                                    onClick={() => { setIsAdmin(false); setError("") }}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
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
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                        isAdmin
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Admin
                                </button>
                            </div>

                            {/* Sub-heading */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                {isAdmin ? "Admin Sign In" : "Welcome Back"}
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                {isAdmin
                                    ? "Access the admin dashboard to manage your platform"
                                    : "Sign in to your account to continue"
                                }
                            </p>

                            {/* Error alert */}
                            {error && (
                                <div className="auth-alert auth-alert-error">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={loginCall} className="space-y-5">

                                {/* Identifier */}
                                <div>
                                    <label className="auth-label">
                                        {isAdmin ? "Username" : "Phone or Email"}
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            {isAdmin
                                                ? <FaUser />
                                                : identifier.includes('@') ? <FaEnvelope /> : <FaPhone />
                                            }
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            placeholder={isAdmin ? "Enter your username" : "Enter your phone or email"}
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="auth-label">Password</label>
                                    <div className="auth-input-wrapper">
                                        <FaLock className="auth-input-icon" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                {/* Forgot password */}
                                <div className="text-right">
                                    <Link to="/resend_token" className="auth-link text-sm font-normal">
                                        Forgot password?
                                    </Link>
                                </div>

                                {loading ? (
                                    <div className="auth-spinner-row">
                                        <div className="auth-spinner" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="auth-btn">
                                        Sign In
                                    </button>
                                )}
                            </form>

                            {/* Footer Links */}
                            <div className="auth-footer-links">
                                {!isAdmin && (
                                    <p>
                                        Don't have an account?{' '}
                                        <Link to="/register" className="auth-link">Register here</Link>
                                    </p>
                                )}
                                <p>
                                    Need to activate your account?{' '}
                                    <Link to="/resend_token" className="auth-link">Resend token</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Footer */}
                <div className="auth-page-footer">© 2026 EduTele Pay. All rights reserved.</div>
            </div>
        </div>
    )
}

export default Login