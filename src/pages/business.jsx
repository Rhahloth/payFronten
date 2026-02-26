import { Link } from "react-router-dom"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import { useNavigate } from "react-router-dom"
import '../PageComponents.css'

const Business = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        email: "",
        phone: "",
        location: "",
        contact_person: "",
        contact_phone: "",
        type: "",
        status: "",
        is_active: false,
    })

    // fetch data
    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/businesses", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader()
                }
            })
            .then((response) => {
                setItems(response.data.items)
                setTotal(response.data.total)
                setLoading(false)
            })
            .catch((err) => {
                setError("Failed to fetch data")
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [searchTerm, items])

    const handleEditClick = (item) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            code: item.code,
            email: item.email,
            phone: item.phone,
            location: item.location,
            contact_person: item.contact_person,
            contact_phone: item.contact_phone,
            type: item.type,
            status: item.status,
            is_active: item.is_active,
        })
    }

    const handleSave = async () => {
        try {
            await axios.put(
                `https://edutele-pay-backend.onrender.com/api/businesses/${editingItem.public_id}`,
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
                    item.public_id === editingItem.public_id ? { ...item, ...formData } : item
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
                `https://edutele-pay-backend.onrender.com/api/businesses/${deleteItem.public_id}`,
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

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        return "badge badge-pending"
    }

    const fields = [
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "location", label: "Location" },
        { key: "contact_person", label: "Contact Person" },
        { key: "contact_phone", label: "Contact Phone" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Manage Businesses" showDashboard={true} />

                {/* ── Toolbar with Search and Add Button ── */}
                <div className="flex items-center justify-between px-8 py-4 page-toolbar">
                    <input
                        type="text"
                        placeholder="Search by business name..."
                        className="w-full md:w-72 px-4 py-2 page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/signup-business" className="page-add-btn ml-4 px-5 py-2 whitespace-nowrap">
                        + Add Business
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
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Code</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Location</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Type</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Edit</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((institution) => (
                                        <tr
                                            key={institution.public_id}
                                            onClick={() => { navigate(`/business-detail/${institution.public_id}`) }}
                                            className="page-tbody-row cursor-pointer"
                                        >
                                            <td className="px-4 py-3 page-td-primary">{institution.code}</td>
                                            <td className="px-4 py-3">{institution.name}</td>
                                            <td className="px-4 py-3">{institution.email}</td>
                                            <td className="px-4 py-3">{institution.phone}</td>
                                            <td className="px-4 py-3">{institution.location}</td>
                                            <td className="px-4 py-3">{institution.type}</td>
                                            <td className="px-4 py-3">
                                                <span className={statusClass(institution.status)}>
                                                    {institution.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-edit px-3 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditClick(institution)
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-delete px-3 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteItem(institution)
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
                </div>

                {/* ── Edit Modal ── */}
                {editingItem && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 page-modal">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="page-modal-title">Edit {editingItem.name}</h2>
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

                            <div className="mb-4">
                                <label className="block mb-1 page-form-label">Active Status</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === true}
                                            onChange={() => setFormData({ ...formData, is_active: true })}
                                        />
                                        <span className="text-sm">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === false}
                                            onChange={() => setFormData({ ...formData, is_active: false })}
                                        />
                                        <span className="text-sm">Inactive</span>
                                    </label>
                                </div>
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
                                Are you sure you want to delete <strong>{deleteItem.name}</strong>? This action cannot be undone.
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

export default Business