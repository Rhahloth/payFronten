import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"

const Customer = () => {
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

    const handleEditClick = (item) => {
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

    const handleLinkCardClick = (item) => {
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

    return (
    <div className="w-full">
        <Sidebar />
        <MainContent>
            {/* <NavBar /> */}
            <SectionHeader title="View All Customers" />

            <div className="ml-20">
                <h2>
                    Available Customers{" "}
                    <span className="ml-20 text-blue-700">
                        <Link to="/create-customer">Add a Customer</Link>
                    </span>
                </h2>
            </div>

            <div className="top-0 left-20 w-full h-16 border-b border-gray-200 flex items-center px-4 shadow-md z-10">
                <input
                    type="text"
                    placeholder="Search..."
                    className="ml-15 w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && (
                <div className="px-10 pt-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <div className="p-10 w-full">
                <table className="bg-white mt-6 w-full">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200">Name</th>
                            <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                            <th className="py-2 px-4 border-b border-gray-200">Gender</th>
                            <th className="py-2 px-4 border-b border-gray-200">D.O.B</th>
                            <th className="py-2 px-4 border-b border-gray-200">Account Type</th>
                            <th className="py-2 px-4 border-b border-gray-200">Status</th>
                            <th className="py-2 px-4 border-b border-gray-200">Edit</th>
                            <th className="py-2 px-4 border-b border-gray-200">Delete</th>
                            <th className="py-2 px-4 border-b border-gray-200">Card</th>
                        </tr>
                    </thead>

                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="9" className="py-6">
                                    <div className="w-full flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.public_id}>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.full_name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.phone}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.gender}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.date_of_birth}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.account_type}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.status}</td>
                                    <td
                                        onClick={() => handleEditClick(item)}
                                        className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer"
                                    >
                                        Edit
                                    </td>
                                    <td
                                        onClick={() => setDeleteItem(item)}
                                        className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer"
                                    >
                                        Delete
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {item.has_card ? (
                                            <span className="text-green-600 font-semibold">Linked</span>
                                        ) : (
                                            <span
                                                onClick={() => handleLinkCardClick(item)}
                                                className="text-blue-600 cursor-pointer"
                                            >
                                                Link Card
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>

                <div className="mt-4 text-sm text-gray-600">Total: {total}</div>
            </div>

            {/* Edit Customer Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[720px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Edit {editingItem.full_name}</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Gender"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Date of Birth (YYYY-MM-DD)
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Example: 2026-01-05"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Account Type</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Account Type"
                                value={formData.account_type}
                                onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setEditingItem(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Card Modal */}
            {linkingItemModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[720px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">
                            Link Card to {linkingItemModel.full_name}
                        </h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Card Number
                            </label>
                            <select
                                className="w-full border p-2 rounded"
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Pin (5 digits)
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Example: 12345"
                                value={linkFormData.pin}
                                onChange={(e) => setLinkFormData({ ...linkFormData, pin: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Expiry (Optional, YYYY-MM-DD)
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Example: 2027-12-31"
                                value={linkFormData.expiry}
                                onChange={(e) => setLinkFormData({ ...linkFormData, expiry: e.target.value })}
                            />
                        </div>

                        {/* This wrapper avoids click issues caused by overlay/layout overlap */}
                        <div className="flex justify-end mt-4 gap-2 relative z-10">
                            <button
                                type="button"
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setLinkingItemModel(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                                onClick={handleLinkCard}
                                disabled={!linkFormData.card_uid || !linkFormData.pin}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-3 text-red-600">
                            Confirm Delete
                        </h2>

                        <p className="mb-4">
                            Are you sure you want to delete{" "}
                            <strong>{deleteItem.full_name}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-300"
                                onClick={() => setDeleteItem(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-red-600 text-white"
                                disabled={deleting}
                                onClick={handleDelete}
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

export default Customer