import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import Sidebar from "../Components/SideBar"
import NavBar from "../Components/NavBar"
import MainContent from "../Components/MainContent"
import SectionHeader from "../Components/SectionHeader"
import '../PageComponents.css'

const details = [
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Location", key: "location" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Contact Phone", key: "contact_phone" },
    { label: "Type", key: "type" },
    { label: "Status", key: "status", isBadge: true },
    { label: "Active", key: "is_active", isBoolean: true },
    { label: "Created At", key: "created_at", isDate: true },
    { label: "Updated At", key: "updated_at", isDate: true },
]

const BusinessDetails = () => {
    const { public_id } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const Fetch = async () => {
            try {
                const resp = await axios.get(
                    `https://edutele-pay-backend.onrender.com/api/businesses/${public_id}`,
                    {
                        headers: { Authorization: authHeader() }
                    }
                )
                setItem(resp.data)
            } catch (err) {
                console.log("Error fetching business:", err)
            } finally {
                setLoading(false)
            }
        }
        Fetch()
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
        return value ? "Yes" : "No"
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
                <div className="flex items-center justify-center h-64 text-gray-500">Business not found</div>
            </MainContent>
        </div>
    )

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Business Details" showBack={true} backTo="/business" />

                <div className="flex justify-center px-8 py-10">
                    <div className="w-full max-w-xl page-detail-wrapper">

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-6 py-4 page-detail-header">
                            <span className="page-detail-primary">
                                {item.name} - {item.code}
                            </span>
                            <span className={statusClass(item.status)}>
                                {item.status}
                            </span>
                        </div>

                        {/* ── Details Rows ── */}
                        <div className="px-6">
                            {details.map(({ label, key, isBadge, isBoolean, isDate }) => (
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
                            ))}

                            {/* Additional row for code if not in details array */}
                            {!details.some(d => d.key === 'code') && (
                                <div className="flex items-center justify-between py-3 page-detail-row">
                                    <span className="page-detail-label">Code</span>
                                    <span className="page-detail-value">{item.code ?? "—"}</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </MainContent>
        </div>
    )
}

export default BusinessDetails