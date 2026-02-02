import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";



const Login = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const loginCall = async (e) => {
        e.preventDefault()

        const payload = {
            identifier: username,   // MUST match FastAPI
            password: password    // MUST match FastAPI
        };
        setLoading(true)
        try {
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/login",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

            const token = resp.data.access_token
            sessionStorage.setItem("token", token)

            const role = resp.data.role
            sessionStorage.setItem("role", role)
            setLoading(false)

            navigate("/")

        } catch (err) {
            console.log("Error", err)
            setLoading(false)
        }

    }


    return (
        <div className="grid grid-cols-2 h-screen w-full">
            <div className="flex items-center justify-center">
                <img src={NfcImage} alt="Login Illustration" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-50 flex flex-col items-center justify-center">
                <form className="bg-white p-6 rounded shadow-md w-3/4" onSubmit={loginCall}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" className="w-full px-3 py-2 border rounded" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {loading ? (
                    <div className="">
                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</button>
                )}
                </form>
                <Link to="/customer-login" className="mt-4 text-blue-700">Login as a customer</Link>
                
            </div>
        </div>
    )
}

export default Login