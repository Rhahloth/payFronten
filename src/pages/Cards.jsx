import { Link } from "react-router-dom"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import { useState, useEffect } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import { useNavigate } from "react-router-dom"
import '../PageComponents.css'

const Cards = () => {

    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        card_number: "", name: "", type: "", email: "",
        location: "", contact_person: "", contact_phone: "", status: "",
    })

    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/cards", {
                headers: { "Content-Type": "application/json", Authorization: authHeader() }
            })
            .then((response) => {
                setItems(response.data.items)
                setLoading(false)
            })
            .catch(() => {
                setError("Failed to fetch data")
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const filtered = items.filter((item) =>
            item.card_number.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [searchTerm, items])

    const handleEditClick = (item) => {
        setEditingItem(item)
        setFormData({
            name: item.name, type: item.type, email: item.email,
            location: item.location, contact_person: item.contact_person,
            contact_phone: item.contact_phone, status: item.status,
        })
    }

    const handleSave = async () => {
        try {
            await axios.put(
                `https://edutele-pay-backend.onrender.com/api/cards/${editingItem.card_uid}`,
                formData,
                { headers: { "Content-Type": "application/json", Authorization: authHeader() } }
            )
            setItems((prev) =>
                prev.map((item) =>
                    item.card_uid === editingItem.card_uid ? { ...item, ...formData } : item
                )
            )
            setEditingItem(null)
        } catch (err) {
            console.error("Failed to update", err)
        }
    }

    const handleDelete = async () => {
        if (!deleteItem) return
        setDeleting(true)
        try {
            await axios.delete(
                `https://edutele-pay-backend.onrender.com/api/cards/${deleteItem.card_uid}`,
                { headers: { Authorization: authHeader() } }
            )
            setItems((prev) => prev.filter((item) => item.card_uid !== deleteItem.card_uid))
            setDeleteItem(null)
        } catch (err) {
            console.error("Delete failed", err)
        } finally {
            setDeleting(false)
        }
    }

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        return "badge badge-pending"
    }

    const fields = [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "email", label: "Email" },
        { key: "location", label: "Location" },
        { key: "contact_person", label: "Contact Person" },
        { key: "contact_phone", label: "Contact Phone" },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Manage Cards" showDashboard={true} />

                {/* ── Toolbar ── */}
                <div className="flex items-center justify-between px-8 py-4 page-toolbar">
                    <input
                        type="text"
                        placeholder="Search by card number..."
                        className="w-full md:w-72 px-4 py-2 page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/create-card" className="page-add-btn ml-4 px-5 py-2 whitespace-nowrap">
                        + Add Card
                    </Link>
                </div>

                {/* ── Table ── */}
                <div className="px-8 pb-10">
                    <div className="w-full overflow-x-auto page-table-wrapper">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="h-6 w-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center py-16 page-error">
                                {error}
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="page-thead-row">
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Card Number</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Balance</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Total Topups</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Total Spent</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Total Refunds</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Edit Card</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Delete Card</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr
                                            key={item.card_uid}
                                            onClick={() => navigate(`/card/${item.card_uid}`)}
                                            className="page-tbody-row cursor-pointer"
                                        >
                                            <td className="px-4 py-3 page-td-primary">{item.card_number}</td>
                                            <td className="px-4 py-3">
                                                <span className={statusClass(item.status)}>{item.status}</span>
                                            </td>
                                            <td className="px-4 py-3">${item.balance}</td>
                                            <td className="px-4 py-3">${item.total_topups}</td>
                                            <td className="px-4 py-3">${item.total_spent}</td>
                                            <td className="px-4 py-3">${item.total_refunds}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-edit px-3 py-1"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(item) }}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-delete px-3 py-1"
                                                    onClick={(e) => { e.stopPropagation(); setDeleteItem(item) }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ── Edit Modal ── */}
                {editingItem && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 page-modal">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="page-modal-title">Edit Card</h2>
                                <button className="page-modal-close" onClick={() => setEditingItem(null)}>✕</button>
                            </div>

                            {fields.map(({ key, label }) => (
                                <div key={key} className="mb-4">
                                    <label className="block mb-1 page-form-label">{label}</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 page-form-input"
                                        placeholder={label}
                                        value={formData[key] || ""}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 mt-6">
                                <button className="px-5 py-2 page-btn-cancel" onClick={() => setEditingItem(null)}>
                                    Cancel
                                </button>
                                <button className="px-5 py-2 page-btn-save" onClick={handleSave}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Delete Modal ── */}
                {deleteItem && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                        <div className="w-full max-w-sm p-8 page-modal page-modal-danger">
                            <div className="page-danger-icon mb-4">
                                <span>🗑</span>
                            </div>
                            <h2 className="page-modal-title mb-2">Confirm Delete</h2>
                            <p className="page-modal-body mb-6">
                                Are you sure you want to delete <strong>{deleteItem.card_number}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-5 py-2 page-btn-cancel"
                                    onClick={() => setDeleteItem(null)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 page-btn-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </MainContent>
        </div>
    )
}

export default Cards