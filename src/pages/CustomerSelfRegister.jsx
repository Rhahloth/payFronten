import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import NfcImage from "../assets/nfcimage.png"
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaCheckCircle,
    FaExclamationCircle,
    FaVenusMars,
    FaCalendarAlt,
    FaArrowLeft
} from 'react-icons/fa'
import '../PageComponents.css'

const BASE_URL = "https://edutele-pay-backend.onrender.com/api"

const CustomerSelfRegister = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [passwordStrength, setPasswordStrength] = useState(0)

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

    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (pass.match(/[a-z]/)) strength++;
        if (pass.match(/[A-Z]/)) strength++;
        if (pass.match(/[0-9]/)) strength++;
        if (pass.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
        setError("")
        if (name === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    }

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return "#ef4444";
        if (passwordStrength <= 3) return "#eab308";
        if (passwordStrength <= 4) return "#22c55e";
        return "#16a34a";
    };

    const getStrengthText = () => {
        if (!form.password) return "";
        if (passwordStrength <= 2) return "Weak";
        if (passwordStrength <= 3) return "Medium";
        if (passwordStrength <= 4) return "Strong";
        return "Very Strong";
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }
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

    const confirmInputClass = `auth-input ${
        form.confirm_password && form.password !== form.confirm_password ? 'input-error'
        : form.confirm_password && form.password === form.confirm_password ? 'input-success'
        : ''
    }`;

    return (
        <div className="auth-page-wrapper">
            <div className="container mx-auto px-4 py-8">

                {/* Card */}
                <div className="auth-card grid grid-cols-1 lg:grid-cols-2">

                    {/* Left Panel */}
                    <div className="hidden lg:flex auth-left-panel">
                        <img src={NfcImage} alt="Register Illustration" className="animate-float" />
                        <h2>Join EduTele Pay</h2>
                        <p className="mb-8">Create your account and start managing your payments seamlessly</p>

                        {/* Benefits */}
                        <div className="space-y-4 w-full">
                            {[
                                "Secure card management",
                                "Real-time transaction tracking",
                                "Instant top-ups & payments",
                                "24/7 customer support",
                            ].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-3" style={{ color: '#bfdbfe' }}>
                                    <FaCheckCircle style={{ color: '#93c5fd', flexShrink: 0 }} />
                                    <span className="text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel — scrollable for long form */}
                    <div className="auth-right-panel" style={{ maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
                        <div className="max-w-md mx-auto">

                            {/* Header */}
                            <div className="auth-header">
                                <div className="auth-icon-wrapper">
                                    <FaUser />
                                </div>
                                <h1>Create an account</h1>
                                <p>Fill in your details to get started</p>
                            </div>

                            {/* Alerts */}
                            {error && (
                                <div className="auth-alert auth-alert-error">
                                    <FaExclamationCircle /> {error}
                                </div>
                            )}
                            {success && (
                                <div className="auth-alert auth-alert-success">
                                    <FaCheckCircle /> {success}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Full Name */}
                                <div>
                                    <label className="auth-label">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <FaUser className="auth-input-icon" />
                                        <input
                                            type="text"
                                            name="full_name"
                                            required
                                            placeholder="John Doe"
                                            value={form.full_name}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="auth-label">
                                        Phone <span className="text-red-400">*</span>
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <FaPhone className="auth-input-icon" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="+256 700 000 000"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="auth-label">
                                        Email <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <FaEnvelope className="auth-input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                {/* Gender + DOB */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="auth-label">
                                            Gender <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <div className="auth-input-wrapper">
                                            <FaVenusMars className="auth-input-icon" />
                                            <select
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                className="auth-input appearance-none bg-white"
                                            >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="auth-label">
                                            D.O.B <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <div className="auth-input-wrapper">
                                            <FaCalendarAlt className="auth-input-icon" />
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                value={form.date_of_birth}
                                                onChange={handleChange}
                                                className="auth-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div>
                                    <label className="auth-label">Account Type</label>
                                    <select
                                        name="account_type"
                                        value={form.account_type}
                                        onChange={handleChange}
                                        className="auth-input"
                                        style={{ paddingLeft: '1rem' }}
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="auth-label">
                                        Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <FaLock className="auth-input-icon" />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="Min. 8 characters"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                    {form.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="auth-strength-bar-track">
                                                    <div
                                                        className="auth-strength-bar-fill"
                                                        style={{
                                                            width: `${(passwordStrength / 5) * 100}%`,
                                                            backgroundColor: getStrengthColor()
                                                        }}
                                                    />
                                                </div>
                                                <span className="auth-strength-label">{getStrengthText()}</span>
                                            </div>
                                            <p className="auth-strength-hint">
                                                Use at least 8 characters with mix of letters, numbers &amp; symbols
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="auth-label">
                                        Confirm Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="auth-input-wrapper">
                                        <FaCheckCircle className="auth-input-icon" />
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            required
                                            placeholder="Repeat your password"
                                            value={form.confirm_password}
                                            onChange={handleChange}
                                            className={confirmInputClass}
                                        />
                                    </div>
                                    {form.confirm_password && form.password !== form.confirm_password && (
                                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Submit */}
                                {loading ? (
                                    <div className="auth-spinner-row">
                                        <div className="auth-spinner" />
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="auth-btn">
                                        Create Account
                                    </button>
                                )}
                            </form>

                            {/* Footer Links */}
                            <div className="auth-footer-links">
                                <p>
                                    Already have an account?{" "}
                                    <Link to="/login" className="auth-link">Sign in</Link>
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

export default CustomerSelfRegister