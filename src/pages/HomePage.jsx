import Navbar from '../Components/NavBar'
import DataCard from '../Components/DataCard'
import SectionHeader from '../Components/SectionHeader'
import { 
    FaAddressBook, 
    FaUser, 
    FaBuilding, 
    FaCreditCard, 
    FaWallet,
    FaExchangeAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
} from 'react-icons/fa'
import MainContent from '../Components/MainContent'
import Sidebar from '../Components/SideBar'
import '../PageComponents.css'

const recentActivities = [
    { activity: "New user registration", user: "John Doe", date: "2024-10-01 09:30", amount: null, status: "completed", type: "user" },
    { activity: "Card topup", user: "Jane Smith", date: "2024-10-01 10:15", amount: "$150.00", status: "completed", type: "card" },
    { activity: "Payment processing", user: "Acme School", date: "2024-10-01 11:00", amount: "$2,500.00", status: "pending", type: "payment" },
    { activity: "New vendor registered", user: "Campus Cafe", date: "2024-10-01 11:30", amount: null, status: "completed", type: "vendor" },
    { activity: "Card issuance", user: "Student ID #1234", date: "2024-10-01 12:45", amount: null, status: "completed", type: "card" },
    { activity: "Refund processed", user: "Robert Johnson", date: "2024-10-01 13:20", amount: "$25.50", status: "completed", type: "refund" },
    { activity: "Account verification", user: "Greenfield School", date: "2024-10-01 14:00", amount: null, status: "pending", type: "verification" },
    { activity: "Bulk card order", user: "City University", date: "2024-10-01 14:30", amount: "$5,000.00", status: "processing", type: "order" },
]

const topVendors = [
    { name: "Campus Cafe", revenue: "$12,450", transactions: 245, growth: "+12%" },
    { name: "Bookstore", revenue: "$8,920", transactions: 178, growth: "+8%" },
    { name: "Student Union", revenue: "$7,340", transactions: 156, growth: "+15%" },
    { name: "Tech Shop", revenue: "$5,670", transactions: 98, growth: "+5%" },
]

const quickStats = [
    { label: "Today's Transactions", value: "156", change: "+12", icon: <FaExchangeAlt /> },
    { label: "Revenue Today", value: "$12,450", change: "+8", icon: <FaWallet /> },
    { label: "Pending Approvals", value: "23", change: "-5", icon: <FaClock /> },
    { label: "Success Rate", value: "98.5%", change: "+2", icon: <FaCheckCircle /> },
]

const HomePage = () => {
    const getStatusIcon = (status) => {
        switch(status) {
            case "completed": return <FaCheckCircle className="text-green-500" />;
            case "pending": return <FaClock className="text-yellow-500" />;
            case "processing": return <FaClock className="text-blue-500" />;
            default: return <FaTimesCircle className="text-gray-400" />;
        }
    }

    const getActivityIcon = (type) => {
        switch(type) {
            case "user": return "👤";
            case "card": return "💳";
            case "payment": return "💰";
            case "vendor": return "🏪";
            case "refund": return "↩️";
            case "verification": return "✓";
            case "order": return "📦";
            default: return "📝";
        }
    }

    const statusClass = (status) => {
        if (status === "completed") return "badge badge-active"
        if (status === "pending") return "badge badge-pending"
        if (status === "processing") return "badge badge-pending"
        return "badge badge-inactive"
    }

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Dashboard Overview" showDashboard={false} />

                {/* ── Main Stats Cards ── */}
                <div className="px-8 py-6">
                    <div className="flex flex-wrap gap-5">
                        <DataCard title="Total Users" value="24,521" change="+12%" icon={<FaUser size="20" />} />
                        <DataCard title="Active Cards" value="18,230" change="+8%" icon={<FaCreditCard size="20" />} />
                        <DataCard title="Businesses" value="156" change="+5%" icon={<FaBuilding size="20" />} />
                        <DataCard title="Vendors" value="342" change="+15%" icon={<FaAddressBook size="20" />} />
                    </div>
                </div>

                {/* ── Quick Stats Mini Cards ── */}
                <div className="px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="home-mini-card">
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

                {/* ── Main Grid Section ── */}
                <div className="px-8 pb-10">
                    {/* items-stretch makes both columns equal height */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                        {/* ── Recent Activities Table (spans 2 columns) ── */}
                        <div className="lg:col-span-2 flex flex-col">
                            <SectionHeader title="Recent Activities" />
                            <div className="mt-4 flex-1">
                                <div className="page-table-wrapper h-full">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="page-thead-row">
                                                <th className="px-4 py-3 text-left">Activity</th>
                                                <th className="px-4 py-3 text-left">User/Vendor</th>
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
                                                            <span className="text-xl">{getActivityIcon(row.type)}</span>
                                                            <span className="font-medium text-gray-800">{row.activity}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{row.user}</td>
                                                    <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                                    <td className="px-4 py-3 font-medium">{row.amount ?? '—'}</td>
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

                        {/* ── Right Sidebar: Top Vendors & Quick Actions ── */}
                        {/* flex flex-col makes this column fill full height and space out its children */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* Top Performing Vendors — grows to fill available space */}
                            <div className="flex flex-col flex-1">
                                <SectionHeader title="Top Vendors" />
                                <div className="mt-4 page-table-wrapper p-4 flex-1">
                                    {topVendors.map((vendor, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <div className="font-medium text-gray-800">{vendor.name}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactions} transactions</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">{vendor.revenue}</div>
                                                <div className="text-xs text-green-600">{vendor.growth}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions — sits at the bottom, natural height */}
                            <div>
                                <SectionHeader title="Quick Actions" />
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <button className="home-quick-action-btn">
                                        <span>➕</span>
                                        <span>New User</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>💳</span>
                                        <span>Issue Card</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>💰</span>
                                        <span>Top Up</span>
                                    </button>
                                    <button className="home-quick-action-btn">
                                        <span>📊</span>
                                        <span>Reports</span>
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

export default HomePage