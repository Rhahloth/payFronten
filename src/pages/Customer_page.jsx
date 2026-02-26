import SectionHeader from '../Components/SectionHeader'
import MainContent from '../Components/MainContent'
import Sidebar from '../Components/SideBar'
import {
    FaCreditCard,
    FaWallet,
    FaExchangeAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaArrowUp,
    FaArrowDown,
    FaShoppingCart,
    FaUtensils,
    FaBook,
    FaBus
} from 'react-icons/fa'
import '../PageComponents.css'

// ── Placeholder Data ──────────────────────────────────────────

const cardInfo = {
    number: "EDU-2024-001",
    holder: "John Doe",
    balance: "UGX 245,000",
    status: "active",
    expiry: "12/2026",
}

const quickStats = [
    { label: "Total Spent", value: "UGX 82,500", change: "+5", icon: <FaWallet /> },
    { label: "Transactions", value: "34", change: "+8", icon: <FaExchangeAlt /> },
    { label: "Pending", value: "2", change: "-1", icon: <FaClock /> },
    { label: "Success Rate", value: "97%", change: "+2", icon: <FaCheckCircle /> },
]

const recentActivities = [
    { activity: "Canteen Purchase", vendor: "Campus Cafe", date: "2026-02-25 08:30", amount: "-UGX 12,000", status: "completed", type: "food" },
    { activity: "Card Top-up", vendor: "Agent Station", date: "2026-02-24 14:15", amount: "+UGX 50,000", status: "completed", type: "topup" },
    { activity: "Bookstore Payment", vendor: "Campus Bookstore", date: "2026-02-23 11:00", amount: "-UGX 35,000", status: "completed", type: "book" },
    { activity: "Bus Pass", vendor: "Transport Desk", date: "2026-02-22 07:45", amount: "-UGX 8,000", status: "completed", type: "bus" },
    { activity: "Canteen Purchase", vendor: "Student Union Cafe", date: "2026-02-21 13:20", amount: "-UGX 9,500", status: "completed", type: "food" },
    { activity: "Card Top-up", vendor: "Agent Station", date: "2026-02-20 10:00", amount: "+UGX 100,000", status: "completed", type: "topup" },
    { activity: "Library Fine", vendor: "University Library", date: "2026-02-19 16:30", amount: "-UGX 5,000", status: "pending", type: "book" },
    { activity: "Tech Shop", vendor: "Campus Tech", date: "2026-02-18 15:00", amount: "-UGX 25,000", status: "completed", type: "other" },
]

const spendingCategories = [
    { label: "Food & Canteen", amount: "UGX 42,500", percent: 52, color: "#1a56db" },
    { label: "Books & Library", amount: "UGX 20,000", percent: 24, color: "#059669" },
    { label: "Transport", amount: "UGX 12,000", percent: 15, color: "#854d0e" },
    { label: "Other", amount: "UGX 8,000", percent: 9, color: "#64748b" },
]

// ── Helpers ───────────────────────────────────────────────────

const getActivityIcon = (type) => {
    switch (type) {
        case "food":   return <FaUtensils className="text-orange-400" />;
        case "topup":  return <FaArrowUp className="text-green-500" />;
        case "book":   return <FaBook className="text-blue-400" />;
        case "bus":    return <FaBus className="text-purple-400" />;
        default:       return <FaShoppingCart className="text-gray-400" />;
    }
}

const getStatusIcon = (status) => {
    switch (status) {
        case "completed": return <FaCheckCircle className="text-green-500" />;
        case "pending":   return <FaClock className="text-yellow-500" />;
        default:          return <FaTimesCircle className="text-gray-400" />;
    }
}

const statusClass = (status) => {
    if (status === "completed") return "badge badge-active"
    if (status === "pending")   return "badge badge-pending"
    return "badge badge-inactive"
}

const isCredit = (amount) => amount.startsWith("+")

// ── Component ─────────────────────────────────────────────────

const CustomerPage = () => {
    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="My Dashboard" showDashboard={false} />

                {/* ── Card + Quick Stats ── */}
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* NFC Card visual */}
                        <div
                            className="lg:col-span-1 rounded-2xl p-6 text-white flex flex-col justify-between"
                            style={{
                                background: "linear-gradient(135deg, #0f2d5c 0%, #1a56db 60%, #2563eb 100%)",
                                minHeight: "180px",
                                boxShadow: "0 8px 32px rgba(26,86,219,0.25)",
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-semibold tracking-widest uppercase opacity-70">EduTele Pay</span>
                                <FaCreditCard size={24} className="opacity-80" />
                            </div>
                            <div>
                                <p className="text-xs opacity-60 mb-1">Card Number</p>
                                <p className="text-lg font-bold tracking-wider mb-4">{cardInfo.number}</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs opacity-60 mb-1">Card Holder</p>
                                        <p className="font-semibold">{cardInfo.holder}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-60 mb-1">Balance</p>
                                        <p className="text-xl font-bold">{cardInfo.balance}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick stats — 2x2 on the right */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            {quickStats.map((stat, i) => (
                                <div key={i} className="home-mini-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="home-mini-card-icon">{stat.icon}</span>
                                        <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}%
                                        </span>
                                    </div>
                                    <div className="home-mini-card-value">{stat.value}</div>
                                    <div className="home-mini-card-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Activities + Spending Breakdown ── */}
                <div className="px-8 pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                        {/* Recent Activities table */}
                        <div className="lg:col-span-2 flex flex-col">
                            <SectionHeader title="Recent Transactions" />
                            <div className="mt-4 flex-1">
                                <div className="page-table-wrapper h-full">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="page-thead-row">
                                                <th className="px-4 py-3 text-left">Activity</th>
                                                <th className="px-4 py-3 text-left">Vendor</th>
                                                <th className="px-4 py-3 text-left">Date</th>
                                                <th className="px-4 py-3 text-left">Amount</th>
                                                <th className="px-4 py-3 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivities.map((row, i) => (
                                                <tr key={i} className="page-tbody-row">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{getActivityIcon(row.type)}</span>
                                                            <span className="font-medium text-gray-800">{row.activity}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{row.vendor}</td>
                                                    <td className="px-4 py-3 text-gray-600 text-sm">{row.date}</td>
                                                    <td className={`px-4 py-3 font-semibold ${isCredit(row.amount) ? 'text-green-600' : 'text-red-500'}`}>
                                                        {row.amount}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(row.status)}
                                                            <span className={statusClass(row.status)}>
                                                                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* Spending breakdown */}
                            <div className="flex flex-col flex-1">
                                <SectionHeader title="Spending Breakdown" />
                                <div className="mt-4 page-table-wrapper p-5 flex-1">
                                    <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">This Month</p>
                                    <div className="space-y-4">
                                        {spendingCategories.map((cat, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                                                    <span className="text-sm font-bold text-gray-900">{cat.amount}</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">{cat.percent}% of total</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <SectionHeader title="Quick Actions" />
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <button className="home-quick-action-btn">
                                        <span>💳</span>
                                        <span>Top Up</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>📊</span>
                                        <span>Statement</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>🔒</span>
                                        <span>Block Card</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>📞</span>
                                        <span>Support</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </MainContent>
        </div>
    )
}

export default CustomerPage