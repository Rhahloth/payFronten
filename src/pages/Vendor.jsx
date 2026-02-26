import { Link } from "react-router-dom"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import axios from "axios"
import { useEffect, useState } from "react"
import { authHeader } from "../utils/authHeader"
import { useNavigate } from "react-router-dom"
import '../PageComponents.css'

const Vendor = () => {
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
        type: "",
        status: "",
        email: "",
        location: "",
        contact_person: "",
        contact_phone: "",
    })

    // fetch data
    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/vendors", {
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

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        if (s === "pending") return "badge badge-pending"
        return "badge badge-pending"
    }

    const handleEditClick = (item, e) => {
        e.stopPropagation()
        setEditingItem(item)
        setFormData({
            name: item.name,
            type: item.type,
            email: item.email,
            location: item.location,
            contact_person: item.contact_person,
            contact_phone: item.contact_phone,
            status: item.status,
        })
    }

    const handleSave = async () => {
        try {
            await axios.put(
                `https://edutele-pay-backend.onrender.com/api/vendors/${editingItem.public_id}`,
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
                `https://edutele-pay-backend.onrender.com/api/vendors/${deleteItem.public_id}`,
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
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "email", label: "Email", type: "email" },
        { key: "location", label: "Location" },
        { key: "contact_person", label: "Contact Person" },
        { key: "contact_phone", label: "Contact Phone" },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="View All Vendors" showDashboard={true} />

                {/* ── Toolbar with Search and Add Button ── */}
                <div className="flex items-center justify-between px-8 py-4 page-toolbar">
                    <input
                        type="text"
                        placeholder="Search by vendor name..."
                        className="w-full md:w-72 px-4 py-2 page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/create-vendor" className="page-add-btn ml-4 px-5 py-2 whitespace-nowrap">
                        + Add Vendor
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
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Vendor Code</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Type</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Location</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Edit</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr 
                                            key={item.public_id}
                                            onClick={() => navigate(`/vendor-detail/${item.public_id}`)}
                                            className="page-tbody-row cursor-pointer"
                                        >
                                            <td className="px-4 py-3 page-td-primary">{item.vendor_code}</td>
                                            <td className="px-4 py-3">{item.name}</td>
                                            <td className="px-4 py-3">{item.type}</td>
                                            <td className="px-4 py-3">{item.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={statusClass(item.status)}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{item.location}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-edit px-3 py-1"
                                                    onClick={(e) => handleEditClick(item, e)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="page-btn-delete px-3 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteItem(item)
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
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 page-modal">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="page-modal-title">Edit {editingItem.name}</h2>
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
        </div>
    )
}

export default Vendor