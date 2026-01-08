import {Navigate, Outlet} from "react-router-dom"

const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
}

const ProtectedRoute = () =>{
    return isAuthenticated() ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute