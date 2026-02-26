import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import '../PageComponents.css'

const ActivateAccount = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const token = searchParams.get("token")

    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (pass.match(/[a-z]/)) strength++;
        if (pass.match(/[A-Z]/)) strength++;
        if (pass.match(/[0-9]/)) strength++;
        if (pass.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!token) {
            setIsError(true)
            setMessage("Invalid or missing activation token")
            return
        }
        if (password.length < 8) {
            setIsError(true)
            setMessage("Password must be at least 8 characters")
            return
        }
        if (password !== confirmPassword) {
            setIsError(true)
            setMessage("Passwords do not match")
            return
        }

        setLoading(true)
        setIsError(false)
        setMessage("")

        try {
            await axios.post(
                "https://edutele-pay-backend.onrender.com/api/activate",
                { token, password },
                { headers: { "Content-Type": "application/json" } }
            );
            setIsError(false)
            setMessage("✓ Account activated successfully! Redirecting to login...")
            setTimeout(() => navigate("/login"), 2000)
        } catch (err) {
            console.log("Error", err)
            const errorMsg = err?.response?.data?.detail ||
                             err?.response?.data?.message ||
                             "Activation failed. Please try again or request a new token."
            setIsError(true)
            setMessage(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return "#ef4444";
        if (passwordStrength <= 3) return "#eab308";
        if (passwordStrength <= 4) return "#22c55e";
        return "#16a34a";
    };

    const getStrengthText = () => {
        if (!password) return "";
        if (passwordStrength <= 2) return "Weak";
        if (passwordStrength <= 3) return "Medium";
        if (passwordStrength <= 4) return "Strong";
        return "Very Strong";
    };

    const confirmInputClass = `auth-input ${
        confirmPassword && password !== confirmPassword ? 'input-error'
        : confirmPassword && password === confirmPassword ? 'input-success'
        : ''
    }`;

    return (
        <div className="auth-page-wrapper">
            <div className="container mx-auto px-4 py-8">

                {/* Card */}
                <div className="auth-card max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* Left Panel */}
                    <div className="hidden lg:flex auth-left-panel">
                        <img src={NfcImage} alt="Activate Account Illustration" className="animate-float" />
                        <h2>Activate Your Account</h2>
                        <p>Set up your password to activate your account and get started.</p>
                    </div>

                    {/* Right Panel */}
                    <div className="auth-right-panel">
                        <div className="max-w-md mx-auto">

                            {/* Header */}
                            <div className="auth-header">
                                <div className="auth-icon-wrapper">
                                    <FaLock />
                                </div>
                                <h1>Activate Account</h1>
                                <p>Create a strong password to secure your account</p>
                            </div>

                            {/* No token warning */}
                            {!token && (
                                <div className="auth-alert auth-alert-warning">
                                    <FaExclamationCircle /> No activation token found. Please check your email link.
                                </div>
                            )}

                            {/* Alert */}
                            {message && (
                                <div className={`auth-alert ${isError ? 'auth-alert-error' : 'auth-alert-success'}`}>
                                    {isError ? <FaExclamationCircle /> : <FaCheckCircle />} {message}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Password */}
                                <div>
                                    <label className="auth-label">Password</label>
                                    <div className="auth-input-wrapper">
                                        <FaLock className="auth-input-icon" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="auth-input"
                                            placeholder="Create a password"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    {password && (
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
                                    <label className="auth-label">Confirm Password</label>
                                    <div className="auth-input-wrapper">
                                        <FaCheckCircle className="auth-input-icon" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={confirmInputClass}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="auth-spinner-row">
                                        <div className="auth-spinner" />
                                        <span>Activating account...</span>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!token || (password && confirmPassword && password !== confirmPassword)}
                                        className="auth-btn"
                                    >
                                        Activate Account
                                    </button>
                                )}
                            </form>

                            {/* Footer Links */}
                            <div className="auth-footer-links">
                                <p>
                                    Need a new token?{' '}
                                    <Link to="/resend_token" className="auth-link">Resend Token</Link>
                                </p>
                                <p>
                                    Already have an account?{' '}
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

export default ActivateAccount