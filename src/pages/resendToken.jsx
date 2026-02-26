import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios";
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import '../PageComponents.css'

const ResendToken = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            setIsError(true)
            setMessage("Please enter your email address")
            return
        }

        const payload = { email };
        setLoading(true)
        setIsError(false)
        setMessage("")

        try {
            await axios.post(
                "https://edutele-pay-backend.onrender.com/api/resend-activation",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );
            setIsError(false)
            setMessage("✓ Token sent successfully! Check your email")
            setEmail("")
        } catch (err) {
            console.log("Error", err)
            const errorMsg = err?.response?.data?.detail ||
                             err?.response?.data?.message ||
                             "Error sending activation token. Please try again later."
            setIsError(true)
            setMessage(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page-wrapper" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff)' }}>
            <div className="container mx-auto px-4 py-8">

                {/* Card */}
                <div className="auth-card max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* Left Panel */}
                    <div className="hidden lg:flex auth-left-panel">
                        <img src={NfcImage} alt="Resend Token Illustration" className="animate-float" />
                        <h2>Resend Activation Token</h2>
                        <p>Didn't receive your activation email? No worries! We'll send you a new one.</p>
                    </div>

                    {/* Right Panel */}
                    <div className="auth-right-panel">
                        <div className="max-w-md mx-auto">

                            {/* Header */}
                            <div className="auth-header">
                                <div className="auth-icon-wrapper">
                                    <FaEnvelope />
                                </div>
                                <h1>Resend Token</h1>
                                <p>Enter your email address and we'll send you a new activation token.</p>
                            </div>

                            {/* Alert */}
                            {message && (
                                <div className={`auth-alert ${isError ? 'auth-alert-error' : 'auth-alert-success'}`}>
                                    {isError ? '⚠️' : '✅'} {message}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="auth-label">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <FaEnvelope className="auth-input-icon" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="auth-input"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="auth-spinner-row">
                                        <div className="auth-spinner" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="auth-btn auth-btn-gradient">
                                        Send Token
                                    </button>
                                )}
                            </form>

                            {/* Footer Links */}
                            <div className="auth-footer-links">
                                <p>
                                    Remember your password?{' '}
                                    <Link to="/login" className="auth-link">Sign in</Link>
                                </p>
                                <p>
                                    Need an account?{' '}
                                    <Link to="/register" className="auth-link">Register here</Link>
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

export default ResendToken