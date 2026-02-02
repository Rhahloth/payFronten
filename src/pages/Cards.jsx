import { Link } from "react-router-dom"
import SectionHeader from "../Components/SectionHeader"
import Navbar from "../Components/NavBar"
import { FaPlus } from "react-icons/fa"
import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import { useState, useEffect } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"


const Cards = () => {


    // retreive data from /api/institutions
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // delete items
    const [deleteItem, setDeleteItem] = useState(null); // null = closed
    const [deleting, setDeleting] = useState(false);
    // edit items
    const [editingItem, setEditingItem] = useState(null); // null = no modal
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
    });

    // fetch data
    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/cards", {
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
    }, []);

    console.log("items", items)

    const handleEditClick = (item) => {
        setEditingItem(item);          // Open modal
        setFormData({                  // Prefill form
            name: item.name,
            type: item.type,
            email: item.email,
            location: item.location,
            contact_person: item.contact_person,
            contact_phone: item.contact_phone,
            status: item.status,
        });
    };

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
            );

            // Update local state
            setItems((prev) =>
                prev.map((item) =>
                    item.public_id === editingItem.public_id ? { ...item, ...formData } : item
                )
            );
            alert("Updated succesfully")

            setEditingItem(null); // Close modal
        } catch (err) {
            console.error("Failed to update", err);
        }
    };


    const handleDelete = async () => {
        if (!deleteItem) return;

        setDeleting(true);

        try {
            await axios.delete(
                `https://edutele-pay-backend.onrender.com/api/vendors/${deleteItem.public_id}`,
                {
                    headers: {
                        Authorization: authHeader(),
                    },
                }
            );

            // Remove item from table immediately
            setItems((prev) =>
                prev.filter((item) => item.public_id !== deleteItem.public_id)
            );

            setDeleteItem(null);
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setDeleting(false);
        }
    };


    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <Navbar />
                <SectionHeader title="Cards Management" />
                <div className="ml-20">
                    <h2>Available Card <span className="ml-20 text-blue-700"><Link to="/create-card">Add a Card</Link> </span> </h2>
                </div>
                <div className="p-10 w-full">
                    <table className=" bg-white mt-6 w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Card Number</th>
                                <th className="py-2 px-4 border-b border-gray-200">Card Status</th>
                                <th className="py-2 px-4 border-b border-gray-200">Balance</th>
                                <th className="py-2 px-4 border-b border-gray-200">Total Topups</th>
                                <th className="py-2 px-4 border-b border-gray-200">Total Spent</th>
                                <th className="py-2 px-4 border-b border-gray-200">Total refunds</th>
                                <th className="py-2 px-4 border-b border-gray-200">Edit</th>
                                <th className="py-2 px-4 border-b border-gray-200">Delete</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <div className="w-full border p-2 rounded flex items-center justify-center">
                                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <tbody>
                                {items.map((item) => (
                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.card_number}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.status}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.balance}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.total_topups}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.total_spent}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.total_refunds}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer">Edit</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer">Delete</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                {editingItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-180 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4">Edit {editingItem.name}</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                />
                            </div>

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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Contact Person"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Contact Phone"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} />
                            </div>

                            {/* Add other fields in the same way */}

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
                                <strong>{deleteItem.name}</strong>?
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

export default Cards