import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import { Link, useNavigate } from "react-router-dom"  // Added useNavigate
import { useState, useEffect } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"
import '../PageComponents.css'

const Customer = () => {
    const navigate = useNavigate()  // Added navigate
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])

    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // delete modal
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // edit modal
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        account_type: "",
        status: "",
    })

    // link card modal
    const [cards, setCards] = useState([])
    const [linkingItemModel, setLinkingItemModel] = useState(null)
    const [linkFormData, setLinkFormData] = useState({
        card_uid: "",
        card_number: "",
        customer_public_id: "",
        pin: "",
        expiry: "",
    })

    // fetch customers
    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/customers", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader(),
                },
            })
            .then((response) => {
                setItems(response.data.items)
                setTotal(response.data.total)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setError("Failed to fetch customers")
                setLoading(false)
            })
    }, [])

    // fetch preprinted cards
    const fetchPreprintedCards = async () => {
        try {
            const response = await axios.get(
                "https://edutele-pay-backend.onrender.com/api/cards/preprinted",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader(),
                    },
                }
            )
            setCards(response.data.items || [])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPreprintedCards()
    }, [])

    // search filter
    useEffect(() => {
        const filtered = items.filter((item) =>
            item.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [searchTerm, items])

    const statusClass = (status) => {
        if (!status) return "badge badge-inactive"
        const s = status.toLowerCase()
        if (s === "active") return "badge badge-active"
        if (s === "inactive") return "badge badge-inactive"
        return "badge badge-pending"
    }

    const handleEditClick = (item, e) => {
        e.stopPropagation() // Prevent row click
        setEditingItem(item)
        setFormData({
            full_name: item.full_name || "",
            phone: item.phone || "",
            gender: item.gender || "",
            date_of_birth: item.date_of_birth || "",
            account_type: item.account_type || "",
            status: item.status || "",
        })
    }

    const handleSave = async () => {
        try {
            await axios.put(
                `https://edutele-pay-backend.onrender.com/api/customers/${editingItem.public_id}`,
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
            console.log("Response:", err?.response?.data)
        }
    }

    const handleDelete = async () => {
        if (!deleteItem) return

        setDeleting(true)

        try {
            await axios.delete(
                `https://edutele-pay-backend.onrender.com/api/customers/${deleteItem.public_id}`,
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
            console.log("Response:", err?.response?.data)
        } finally {
            setDeleting(false)
        }
    }

    const handleLinkCardClick = (item, e) => {
        e.stopPropagation() // Prevent row click
        setLinkingItemModel(item)
        setLinkFormData({
            card_uid: "",
            card_number: "",
            customer_public_id: item.public_id,
            pin: "",
            expiry: "",
        })
    }

    const handleLinkCard = async () => {
        try {
            const payload = {
                card_uid: linkFormData.card_uid,
                customer_public_id: linkFormData.customer_public_id,
                pin: linkFormData.pin,
                expiry: linkFormData.expiry || null,
            }

            console.log("card issue details", payload)

            await axios.post(
                "https://edutele-pay-backend.onrender.com/api/cards/issue",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader(),
                    },
                }
            )

            // mark customer as linked locally
            setItems((prev) =>
                prev.map((item) =>
                    item.public_id === linkingItemModel.public_id
                        ? { ...item, has_card: true }
                        : item
                )
            )

            // refresh available preprinted cards so used one disappears
            await fetchPreprintedCards()

            alert("Card linked successfully")
            setLinkingItemModel(null)
        } catch (err) {
            console.error("Failed to link card", err)
            console.log("Response:", err?.response?.data)
        }
    }

    const fields = [
        { key: "full_name", label: "Full Name" },
        { key: "phone", label: "Phone" },
        { key: "gender", label: "Gender" },
        { key: "date_of_birth", label: "Date of Birth (YYYY-MM-DD)" },
        { key: "account_type", label: "Account Type" },
        { key: "status", label: "Status" },
    ]

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="View All Customers" showDashboard={true} />

                {/* ── Toolbar with Search and Add Button ── */}
                <div className="flex items-center justify-between px-8 py-4 page-toolbar">
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        className="w-full md:w-72 px-4 py-2 page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/create-customer" className="page-add-btn ml-4 px-5 py-2 whitespace-nowrap">
                        + Add Customer
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
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Gender</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">D.O.B</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Account Type</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Edit</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Delete</th>
                                        <th className="px-4 py-3 text-left whitespace-nowrap">Card</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr 
                                            key={item.public_id} 
                                            className="page-tbody-row cursor-pointer"
                                            onClick={() => navigate(`/customer-detail/${item.public_id}`)} // Navigate on row click
                                        >
                                            <td className="px-4 py-3 page-td-primary">{item.full_name}</td>
                                            <td className="px-4 py-3">{item.phone}</td>
                                            <td className="px-4 py-3">{item.gender}</td>
                                            <td className="px-4 py-3">{item.date_of_birth}</td>
                                            <td className="px-4 py-3">{item.account_type}</td>
                                            <td className="px-4 py-3">
                                                <span className={statusClass(item.status)}>
                                                    {item.status}
                                                </span>
                                            </td>
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
                                                        e.stopPropagation();
                                                        setDeleteItem(item);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.has_card ? (
                                                    <span className="badge badge-active">Linked</span>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleLinkCardClick(item, e)}
                                                        className="page-btn-edit px-3 py-1"
                                                    >
                                                        Link Card
                                                    </button>
                                                )}
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

            {/* ── Edit Customer Modal ── */}
            {editingItem && (
                <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 page-modal">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="page-modal-title">Edit {editingItem.full_name}</h2>
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

            {/* ── Link Card Modal ── */}
            {linkingItemModel && (
                <div className="fixed inset-0 flex items-center justify-center z-50 page-modal-overlay">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 page-modal">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="page-modal-title">Link Card to {linkingItemModel.full_name}</h2>
                            <button className="page-modal-close" onClick={() => setLinkingItemModel(null)}>✕</button>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 page-form-label">Card Number</label>
                            <select
                                className="w-full px-3 py-2 page-form-input"
                                value={linkFormData.card_number}
                                onChange={(e) => {
                                    const selectedCard = cards.find(
                                        (card) => card.card_number === e.target.value
                                    )

                                    if (selectedCard) {
                                        setLinkFormData((prev) => ({
                                            ...prev,
                                            card_number: selectedCard.card_number,
                                            card_uid: selectedCard.card_uid,
                                        }))
                                    } else {
                                        setLinkFormData((prev) => ({
                                            ...prev,
                                            card_number: "",
                                            card_uid: "",
                                        }))
                                    }
                                }}
                            >
                                <option value="">
                                    {cards.length === 0 ? "No available cards" : "Select a card"}
                                </option>

                                {cards.map((card) => (
                                    <option key={card.card_uid} value={card.card_number}>
                                        {card.card_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 page-form-label">Pin (5 digits)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 page-form-input"
                                placeholder="Example: 12345"
                                value={linkFormData.pin}
                                onChange={(e) => setLinkFormData({ ...linkFormData, pin: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 page-form-label">Expiry (Optional, YYYY-MM-DD)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 page-form-input"
                                placeholder="Example: 2027-12-31"
                                value={linkFormData.expiry}
                                onChange={(e) => setLinkFormData({ ...linkFormData, expiry: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="px-5 py-2 page-btn-cancel"
                                onClick={() => setLinkingItemModel(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-5 py-2 page-btn-save disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleLinkCard}
                                disabled={!linkFormData.card_uid || !linkFormData.pin}
                            >
                                Link Card
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
                            Are you sure you want to delete <strong>{deleteItem.full_name}</strong>? This action cannot be undone.
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

export default Customer