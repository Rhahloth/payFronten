import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import { authHeader } from "../utils/authHeader"
import axios from "axios"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"



const RegisterBusiness = () => {


    // /api/institutions/register

    // {
    //     "name": "string",
    //     "type": "school",
    //     "email": "user@example.com",
    //     "phone": "string",
    //     "location": "string",
    //     "contact_person": "string",
    //     "contact_phone": "string"
    // }

    const [Username, setUsername] = useState("")
    const [type, setType] = useState("")
    const [email, setEmail] = useState("")
    const [Phone, setPhone] = useState("")
    const [Location, setLocation] = useState("")
    const [ContactPerson, setContactPerson] = useState("")
    const [ContactPhone, setContactPhone] = useState("")
    const [loading, setLoading] = useState(false)
    

    const registerBusiness = async (e) => {
        e.preventDefault()

        const payload = {
            name: Username,
            type: type,
            email: email,
            phone: Phone,
            location: Location,
            contact_person: ContactPerson,
            contact_phone: ContactPhone

        }
        setLoading(true)
        try {
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/businesses", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader()
                }
            })

            console.log(resp.data)

            alert("Successful, Check your email for passwords")
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <>
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Create Institution" />
                <div className="h-screen w-full">
                    <div className="flex flex-col items-center justify-center">
                        <form className="bg-white p-6 rounded shadow-md w-2/4" onSubmit={registerBusiness}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input type="text" onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your username" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                <input type="text" onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="eg school" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your email" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                <input type="text" onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your Phone number" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                <input type="text" onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your Location" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Person</label>
                                <input type="text" onChange={(e) => setContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your contact person" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
                                <input type="text" onChange={(e) =>setContactPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your contact phone" />
                            </div>
                            {loading ? (
                                <div className="w-full border p-2 rounded flex items-center justify-center">
                                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                            ):(
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Business</button>
                            )}
                            
                        </form>
                    </div>
                </div>
            </MainContent>
        </>
    )
}

export default RegisterBusiness