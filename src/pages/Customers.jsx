import Sidebar from "../Components/SideBar"
import MainContent from "../Components/MainContent"
import NavBar from "../Components/NavBar"
import SectionHeader from "../Components/SectionHeader"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { authHeader } from "../utils/authHeader"

const Customer = () => {


    // {
    //   "public_id": "string",
    //   "full_name": "string",
    //   "phone": "string",
    //   "gender": "string",
    //   "date_of_birth": "2025-12-30",
    //   "account_type": "string",
    //   "status": "pending",
    //   "is_active": true,
    //   "is_verified": true,
    //   "created_at": "2025-12-30T07:39:31.763Z",
    //   "updated_at": "2025-12-30T07:39:31.763Z"
    // }

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
        full_name: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        account_type: "",
        status: "",
    });

    // fetch data
    useEffect(() => {
        axios
            .get("https://edutele-pay-backend.onrender.com/api/customers", {
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
            full_name: item.full_name,
            phone: item.phone,
            gender: item.gender,
            date_of_birth: item.date_of_birth,
            account_type: item.account_type,
            status: item.status,
        });
    };

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
                `https://edutele-pay-backend.onrender.com/api/customers/${deleteItem.public_id}`,
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
                <NavBar />
                <SectionHeader title="View All Customers" />
                <div className="ml-20">
                    <h2>Available Customers <span className="ml-20 text-blue-700"><Link to="/create-customer">Add a Customers</Link> </span> </h2>
                </div>
                <div className="p-10 w-full">
                    <table className=" bg-white mt-6 w-full">
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
                        <tbody>
                            {items.map((item) => (
                                <tr>
                                <td className="py-2 px-4 border-b border-gray-200">{item.full_name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.phone}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.gender}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.date_of_birth}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.account_type}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.status}</td>
                                <td onClick={() => handleEditClick(item)} className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer">Edit</td>
                                <td onClick={() => setDeleteItem(item)} className="py-2 px-4 border-b border-gray-200 text-red-600 cursor-pointer">Delete</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-blue-600 cursor-pointer">Create Card</td>
                            </tr>
                            ))}     
                        </tbody>
                    </table>
                </div>
                {editingItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-180 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4">Edit {editingItem.full_name}</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder=" Full Name"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Gender"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth | 2026-01-05</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Date of birth"
                                    value={formData.date_of_birth}
                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Account Type</label>
                                <input
                                    type="text"
                                    className="w-full mb-2 border p-2 rounded"
                                    placeholder="Account Type"
                                    value={formData.account_type}
                                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })} />
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

export default Customer