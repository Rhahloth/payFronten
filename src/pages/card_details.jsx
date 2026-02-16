import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import Sidebar from "../Components/SideBar"
import NavBar from "../Components/NavBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"


const CardDetails = () => {

    const { card_uid } = useParams()
    const [item, setItem] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const FetchCard = async () => {
            console.log(card_uid)
            try {
                const resp = await axios.get(`https://edutele-pay-backend.onrender.com/api/cards/${card_uid}`, {
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

        FetchCard()

    }, [card_uid])

    if (!item) return <div>Card not found</div>;

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <NavBar />
                <SectionHeader title="Card Details" />
                <div className="p-10 w-full">

                    {/* Top Section */}
                    <div className="flex items-center justify-between px-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">{item.card_number}</h2>
                        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Deposit
                        </button>
                    </div>

                    {/* Middle Section (Key-Value pairs) */}
                    <div className="p-10 w-full">

                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-semibold">{item.status}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Balance</span>
                            <span className="font-semibold">${item.balance}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Spent</span>
                            <span className="font-semibold">${item.total_spent}</span>
                        </div>
                        <hr className="text-gray-200"/>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Topups</span>
                            <span className="font-semibold">${item.total_topups}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Refunds</span>
                            <span className="font-semibold">${item.total_refunds}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Last Topup</span>
                            <span className="font-semibold">${item.last_topup_at}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Issued At</span>
                            <span className="font-semibold">${item.issued_at}</span>
                        </div>
                        <hr className="text-gray-200"/>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Expiry</span>
                            <span className="font-semibold">${item.expiry}</span>
                        </div>
                        <hr className="text-gray-200"/>
                    </div>

                </div>


            </MainContent>
        </div>
    )
}

export default CardDetails
