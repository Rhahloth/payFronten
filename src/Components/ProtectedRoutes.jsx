import { Navigate, Outlet } from "react-router-dom"

const isAuthenticated = () => !!sessionStorage.getItem("token")
const getRole = () => sessionStorage.getItem("role")

const ADMIN_ROLES = ["super_user", "agent_user", "business_user", "vendor"]

// ── Admin-only routes ─────────────────────────────────────────
export const ProtectedRoute = () => {
    if (!isAuthenticated()) return <Navigate to="/login" replace />
    if (!ADMIN_ROLES.includes(getRole())) return <Navigate to="/customer-page" replace />
    return <Outlet />
}

// ── Customer-only routes ──────────────────────────────────────
export const CustomerRoute = () => {
    if (!isAuthenticated()) return <Navigate to="/login" replace />
    if (ADMIN_ROLES.includes(getRole())) return <Navigate to="/" replace />
    return <Outlet />
}

export default ProtectedRoute