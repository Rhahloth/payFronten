import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import '../PageComponents.css'

const details = [
    { label: "Full Name", key: "full_name" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "Date of Birth", key: "date_of_birth", isDate: true },
    { label: "Account Type", key: "account_type" },
    { label: "Status", key: "status", isBadge: true },
    { label: "Verified", key: "is_verified", isBoolean: true },
    { label: "Has Card", key: "has_card", isBoolean: true },
    { label: "Card Number", key: "card_number" },
    { label: "Created At", key: "created_at", isDate: true },
    { label: "Updated At", key: "updated_at", isDate: true },
]

const CustomerDetails = () => {
    const { public_id } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const resp = await axios.get(
                    `https://edutele-pay-backend.onrender.com/api/customers/${public_id}`,
                    {
                        headers: { Authorization: authHeader() }
                    }
                )
                setItem(resp.data)
            } catch (err) {
                console.log("Error fetching customer:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCustomer()
    }, [public_id])

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        return "badge badge-pending"
    }

    const formatDate = (dateString) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatBoolean = (value) => {
        if (value === true || value === "true") return "Yes"
        if (value === false || value === "false") return "No"
        return value || "—"
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
                <div className="flex items-center justify-center h-64 text-gray-500">Customer not found</div>
            </MainContent>
        </div>
    )

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Customer Details" showBack={true} backTo="/customer" />

                <div className="flex justify-center px-8 py-10">
                    <div className="w-full max-w-xl page-detail-wrapper">

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-6 py-4 page-detail-header">
                            <span className="page-detail-primary">
                                {item.full_name}
                            </span>
                            <span className={statusClass(item.status)}>
                                {item.status}
                            </span>
                        </div>

                        {/* ── Details Rows ── */}
                        <div className="px-6">
                            {details.map(({ label, key, isBadge, isBoolean, isDate }) => {
                                // Skip if the field doesn't exist in the data
                                if (item[key] === undefined) return null
                                
                                return (
                                    <div key={key} className="flex items-center justify-between py-3 page-detail-row">
                                        <span className="page-detail-label">{label}</span>
                                        {isBadge ? (
                                            <span className={statusClass(item[key])}>{item[key]}</span>
                                        ) : isBoolean ? (
                                            <span className="page-detail-value">
                                                {formatBoolean(item[key])}
                                            </span>
                                        ) : isDate ? (
                                            <span className="page-detail-value">
                                                {formatDate(item[key])}
                                            </span>
                                        ) : (
                                            <span className="page-detail-value">
                                                {item[key] ?? "—"}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}

                            {/* If the customer has a card, show the card UID as well */}
                            {item.has_card && item.card_uid && (
                                <div className="flex items-center justify-between py-3 page-detail-row">
                                    <span className="page-detail-label">Card UID</span>
                                    <span className="page-detail-value font-mono text-xs">{item.card_uid}</span>
                                </div>
                            )}
                        </div>

                        {/* ── Actions Section (optional) ── */}
                        {!item.has_card && (
                            <div className="px-6 py-4 border-t border-gray-100">
                                <button className="page-detail-action-btn px-4 py-2">
                                    + Link Card
                                </button>
                            </div>
                        )}

                    </div>
                </div>

            </MainContent>
        </div>
    )
}

export default CustomerDetails