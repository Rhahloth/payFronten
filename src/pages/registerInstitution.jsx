import { Link } from "react-router-dom"
import NfcImage from "../assets/nfcimage.png"
import { useState } from "react"
import { authHeader } from "../utils/authHeader"
import axios from "axios"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/Sidebar"



const RegisterInstituition = () => {


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
    const [type, SetType] = useState("")
    const [email, SetEmail] = useState("")
    const [Phone, SetPhone] = useState("")
    const [Location, SetLocation] = useState("")
    const [ContactPerson, SetContactPerson] = useState("")
    const [ContactPhone, SetContactPhone] = useState("")
    

    const registerInstitution = async (e) => {
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

        try {
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/institutions", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader()
                }
            })

            console.log(resp.data)

            alert("Successful, Check your email for passwords")

        } catch (err) {
            console.log(err)
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
                        <form className="bg-white p-6 rounded shadow-md w-2/4" onSubmit={registerInstitution}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input type="text" onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your username" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                <input type="text" onChange={(e) => SetType(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="eg school" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input type="email" onChange={(e) => SetEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your email" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                <input type="text" onChange={(e) => SetPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your Phone number" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                <input type="text" onChange={(e) => SetLocation(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your Location" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Person</label>
                                <input type="text" onChange={(e) => SetContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your contact person" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
                                <input type="text" onChange={(e) => SetContactPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your contact phone" />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Institution</button>
                        </form>
                    </div>
                </div>
            </MainContent>
        </>
    )
}

export default RegisterInstituition