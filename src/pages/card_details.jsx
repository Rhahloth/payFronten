import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import '../PageComponents.css'

const details = [
    { label: "Status",        key: "status",       isBadge: true },
    { label: "Balance",       key: "balance",      prefix: "$"   },
    { label: "Total Spent",   key: "total_spent",  prefix: "$"   },
    { label: "Total Topups",  key: "total_topups", prefix: "$"   },
    { label: "Total Refunds", key: "total_refunds",prefix: "$"   },
    { label: "Last Topup",    key: "last_topup_at"              },
    { label: "Issued At",     key: "issued_at"                  },
    { label: "Expiry",        key: "expiry"                     },
]

const CardDetails = () => {
    const { card_uid } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const FetchCard = async () => {
            try {
                const resp = await axios.get(
                    `https://edutele-pay-backend.onrender.com/api/cards/${card_uid}`,
                    { headers: { Authorization: authHeader() } }
                )
                setItem(resp.data)
            } catch (err) {
                console.log("Error fetching card:", err)
            } finally {
                setLoading(false)
            }
        }
        FetchCard()
    }, [card_uid])

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        return "badge badge-pending"
    }

    if (loading) return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <div className="flex items-center justify-center h-64">
                    <div className="h-6 w-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            </MainContent>
        </div>
    )

    if (!item) return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <div className="flex items-center justify-center h-64 text-gray-500">Card not found</div>
            </MainContent>
        </div>
    )

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Card Details" showBack={true} />

                <div className="flex justify-center px-8 py-10">
                    <div className="w-full max-w-xl page-detail-wrapper">

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-6 py-4 page-detail-header">
                            <span className="page-detail-primary">{item.card_number}</span>
                            <button className="px-4 py-2 page-detail-action-btn">
                                + Deposit
                            </button>
                        </div>

                        {/* ── Rows ── */}
                        <div className="px-6">
                            {details.map(({ label, key, prefix, isBadge }) => (
                                <div key={key} className="flex items-center justify-between py-3 page-detail-row">
                                    <span className="page-detail-label">{label}</span>
                                    {isBadge ? (
                                        <span className={statusClass(item[key])}>{item[key]}</span>
                                    ) : (
                                        <span className="page-detail-value">
                                            {prefix}{item[key] ?? "—"}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </MainContent>
        </div>
    )
}

export default CardDetails