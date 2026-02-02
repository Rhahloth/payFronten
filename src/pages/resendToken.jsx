import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import axios from "axios";



const ResendToken = () => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            email: email,   // MUST match FastAPI
        };
        setLoading(true)
        try {
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/resend-activation",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            
                if(resp.ok){
                    setError(false)
                    setMessage("Token Sent, Check your email")
                }else{
                    setError(true)
                    setMessage(resp.data.message || "Sending failed")
                }


        } catch (err) {
            console.log("Error", err)
            setMessage("Error sending activation token try again later")
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {loading ? (
                        <div className="">
                            <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Resend Token</button>
                    )}
                </form>
                {message && (
                    <p className="p-4" style={{ color: error ? "red" : "green" }}>
                        {message}
                    </p>
                )}
                <Link to="/login" className="mt-4 text-blue-700">Login</Link>

            </div>
        </div>
    )
}

export default ResendToken