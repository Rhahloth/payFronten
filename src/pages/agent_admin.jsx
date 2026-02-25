import { Link, useNavigate } from "react-router-dom"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import Sidebar from "../Components/SideBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"

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

    const handleEditClick = (item) => {
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

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                {/* <NavBar /> */}
                <SectionHeader title="View All Accounts" />

                <div className="ml-20">
                    <h2>
                        Available Accounts ({total})
                        <span className="ml-20 text-blue-700">
                            <Link to="/create-agent-admin">Create Account</Link>
                        </span>
                    </h2>
                </div>

                <div className="top-0 left-20 w-full h-16 border-b border-gray-200 flex items-center px-4 shadow-md z-10">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        className="ml-15 w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="px-10 pt-4 text-red-600">{error}</div>
                )}

                <div className="p-10 w-full">
                    <table className="bg-white mt-6 w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Username</th>
                                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                                <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                                <th className="py-2 px-4 border-b border-gray-200">Role</th>
                                <th className="py-2 px-4 border-b border-gray-200">Status</th>
                                <th className="py-2 px-4 border-b border-gray-200">Edit</th>
                                <th className="py-2 px-4 border-b border-gray-200">Delete</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="7" className="p-4">
                                        <div className="w-full border p-2 rounded flex items-center justify-center">
                                            <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {filteredItems.map((user) => (
                                    <tr
                                        key={user.public_id}
                                        onClick={() => navigate(`/user-detail/${user.public_id}`)}
                                        className="cursor-pointer hover:bg-gray-100"
                                    >
                                        <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{user.phone}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{user.role}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{user.status}</td>

                                        <td
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditClick(user)
                                            }}
                                            className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer"
                                        >
                                            Edit
                                        </td>

                                        <td
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteItem(user)
                                            }}
                                            className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer"
                                        >
                                            Delete
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>

                {editingItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-180">
                            <h2 className="text-lg font-bold mb-4">
                                Edit {editingItem.username}
                            </h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <select
                                    className="w-full mb-2 border p-2 rounded"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="">Select status</option>
                                    <option value="pending">pending</option>
                                    <option value="active">active</option>
                                    <option value="inactive">inactive</option>
                                    <option value="suspended">suspended</option>
                                    <option value="blocked">blocked</option>
                                    <option value="deleted">deleted</option>
                                </select>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded mr-2"
                                    onClick={() => setEditingItem(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-lg font-semibold mb-3 text-red-600">
                                Confirm Delete
                            </h2>

                            <p className="mb-4">
                                Are you sure you want to delete{" "}
                                <strong>{deleteItem.username}</strong>?
                                This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-gray-300"
                                    onClick={() => setDeleteItem(null)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>

                                <button
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

export default AgentAdmin