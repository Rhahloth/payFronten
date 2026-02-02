
import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useSearchParams } from "react-router-dom";



const ActivateAccount = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)

    const token = searchParams.get("token")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.length < 8) {
            setError(true)
            setMessage("Password must be atleast 8 characters")
            return
        }

        if (password !== confirmPassword) {
            setError(true)
            setMessage("Passwords do not match")
            return
        }

        const payload = {
            token: token,   // MUST match FastAPI
            password: password    // MUST match FastAPI
        };
        setLoading(true)
        try {
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/activate",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            console.log(resp.data)
            setLoading(false)
            if (resp.ok) {
                setError(false)
                navigate("/login")
            } else {
                setError(true)
                setMessage(resp.data.message || "Activation failed")
            }


        } catch (err) {
            setError(true)
            setMessage("Network error")

        } finally {
            setLoading(false)
        }

    }


    return (
        <div className="grid grid-cols-2 h-screen w-full">
            <div className="flex items-center justify-center">
                <img src={NfcImage} alt="Login Illustration" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-50 flex flex-col items-center justify-center">
                <form className="bg-white p-6 rounded shadow-md w-3/4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" className="w-full px-3 py-2 border rounded" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input type="password" className="w-full px-3 py-2 border rounded" placeholder="Enter your password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    {loading ? (
                        <div className="">
                            <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Activate</button>
                    )}
                </form>
                <Link to="/resend_token" className="mt-4 text-blue-700">Resend Token</Link>
                {message && (
                    <p style={{ color: error ? "red" : "green" }}>
                        {message}
                    </p>
                )}
                <Link to="/login" className="mt-4 text-blue-700">Login</Link>

            </div>
        </div>
    )
}

export default ActivateAccount