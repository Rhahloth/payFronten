import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import { useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"

const CreateAgentAdmin = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            username,
            email,
            phone,
            role: "agent_user",
            business_public_id: null,
            vendor_public_id: null,
        }

        try {
            await axios.post("https://edutele-pay-backend.onrender.com/api/users", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader(),
                },
            })

            setUsername("")
            setEmail("")
            setPhone("")
            alert("Agent admin created successfully")
        } catch (error) {
            console.error("Failed to create agent admin:", error)
            console.log("Response:", error?.response?.data)
        }
    }

    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Add New Agent Admin" />

                <div className="p-10 w-full flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-3/4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Add Agent Admin
                        </button>
                    </form>
                </div>
                
            </MainContent>
        </div>
    )
}

export default CreateAgentAdmin