import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import Sidebar from "../Components/SideBar"
import NavBar from "../Components/NavBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"


const UserDetails = () => {

    const { public_id } = useParams()
    const [item, setItem] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const Fetch = async () => {
            console.log(public_id)
            try {
                const resp = await axios.get(`https://edutele-pay-backend.onrender.com/api/users/${public_id}`, {
                    headers: {
                        Authorization: authHeader(),
                    }
                })
                console.log("Response data", resp.data)
                setItem(resp.data)
            } catch (err) {
                console.log("Error fetching card:", err)
            } finally {
                setLoading(false)
            }
        }

        Fetch()

    }, [public_id])

    if (!item) return <div>User not found</div>;

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="User Details" />
                <div className="p-10 w-full">

                    {/* Top Section */}
                    <div className="flex items-center justify-between px-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">{item.username} - {item.role}</h2>
                        <p className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            {item.status}
                        </p>
                    </div>

                    {/* Middle Section (Key-Value pairs) */}
                    <div className="p-10 w-full">

                        <div className="flex justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="font-semibold">{item.email}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-semibold">{item.phone}</span>
                        </div>
                        <hr className="text-gray-200"/>
             

                        <div className="flex justify-between">
                            <span className="text-gray-500">Created</span>
                            <span className="font-semibold">{item.created_at}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Updated</span>
                            <span className="font-semibold">{item.updated_at}</span>
                        </div>
                        <hr className="text-gray-200"/>
                    </div>

                </div>


            </MainContent>
        </div>
    )
}

export default UserDetails
