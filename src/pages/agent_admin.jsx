import { Link, useNavigate } from "react-router-dom"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import '../PageComponents.css'

const AgentAdmin = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])

    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [deleteItem, setDeleteItem] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        status: "",
    })

    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/users", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader(),
                },
            })
            .then((response) => {
                setItems(response.data.items || [])
                setTotal(response.data.total || 0)
                setLoading(false)
            })
            .catch(() => {
                setError("Failed to fetch data")
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const filtered = items.filter((item) =>
            (item.username || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [searchTerm, items])

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        if (s === "pending") return "badge badge-pending"
        if (s === "suspended" || s === "blocked" || s === "deleted") return "badge badge-inactive"
        return "badge badge-pending"
    }

    const handleEditClick = (item, e) => {
        e.stopPropagation()
        setEditingItem(item)
        setFormData({
            email: item.email || "",
            phone: item.phone || "",
            status: item.status || "",
        })
    }

    const handleSave = async () => {
        try {
            await axios.put(
                `https://edutele-pay-backend.onrender.com/api/users/${editingItem.public_id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader(),
                    },
                }
            )

            setItems((prev) =>
                prev.map((item) =>
                    item.public_id === editingItem.public_id
                        ? { ...item, ...formData }
                        : item
                )
            )

            alert("Updated successfully")
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
                `https://edutele-pay-backend.onrender.com/api/users/${deleteItem.public_id}`,
                {
                    headers: {
                        Authorization: authHeader(),
                    },
                }
            )

            setItems((prev) =>
                prev.filter((item) => item.public_id !== deleteItem.public_id)
            )

            setDeleteItem(null)
        } catch (err) {
            console.error("Delete failed", err)
        } finally {
            setDeleting(false)
        }
    }

    const fields = [
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "tel" },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="View All Accounts" showDashboard={true} />

                {/* ── Toolbar with Search and Add Button ── */}
                <div className="flex items-center justify-between px-8 py-4 page-toolbar">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        className="w-full md:w-72 px-4 py-2 page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/create-agent-admin" className="page-add-btn ml-4 px-5 py-2 whitespace-nowrap">
                        + Create Account
                    </Link>
                </div>

                {error && (
                    <div className="px-8 pt-4">
                        <p className="page-error">{error}</p>
                    </div>
                )}

                {/* ── Table ── */}
                <div className="px-8 pb-10">
                    <div className="w-full overflow-x-auto page-table-wrapper">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="h-6 w-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="page-thead-row">
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Username</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Role</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Edit</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((user) => (
                                        <tr
                                            key={user.public_id}
                                            onClick={() => navigate(`/user-detail/${user.public_id}`)}
                                            className="page-tbody-row cursor-pointer"
                                        >
                                            <td className="px-4 py-3 page-td-primary">{user.username}</td>
                                            <td className="px-4 py-3">{user.email}</td>
                                            <td className="px-4 py-3">{user.phone}</td>
                                            <td className="px-4 py-3">{user.role}</td>
                                            <td className="px-4 py-3">
                                                <span className={statusClass(user.status)}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-edit px-3 py-1"
                                                    onClick={(e) => handleEditClick(user, e)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-delete px-3 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteItem(user)
                                                    }}
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
                    
                    <div className="mt-4 text-sm text-gray-600">Total: {total}</div>
                </div>
            </MainContent>

            {/* ── Edit Modal ── */}
            {editingItem && (
                <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                    <div className="w-full max-w-md p-8 page-modal">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="page-modal-title">Edit {editingItem.username}</h2>
                            <button className="page-modal-close" onClick={() => setEditingItem(null)}>✕</button>
                        </div>

                        {fields.map(({ key, label, type = "text" }) => (
                            <div key={key} className="mb-4">
                                <label className="block mb-1 page-form-label">{label}</label>
                                <input
                                    type={type}
                                    className="w-full px-3 py-2 page-form-input"
                                    placeholder={label}
                                    value={formData[key] || ""}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                />
                            </div>
                        ))}

                        <div className="mb-4">
                            <label className="block mb-1 page-form-label">Status</label>
                            <select
                                className="w-full px-3 py-2 page-form-input"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="">Select status</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="blocked">Blocked</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>

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
                            Are you sure you want to delete <strong>{deleteItem.username}</strong>? This action cannot be undone.
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
        </div>
    )
}

export default AgentAdmin