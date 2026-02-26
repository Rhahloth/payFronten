import { Routes, Route } from "react-router-dom";
import ProtectedRoute, { CustomerRoute } from "../Components/ProtectedRoutes";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Business from "../pages/business";
import RegisterBusiness from "../pages/business_create";
import Cards from "../pages/Cards";
import CreateCard from "../pages/cards_create";
import Vendor from "../pages/Vendor";
import CreateVendor from "../pages/vendor_create";
import Customer from "../pages/Customers";
import CreateCustomer from "../pages/customers_create";
import CustomerDetails from "../pages/CustomerDetails";
import AgentAdmin from "../pages/agent_admin";
import CreateAgentAdmin from "../pages/agent_admin_create";
import Logout from "../pages/logout";
import CustomerPage from "../pages/Customer_page";
import ActivateAccount from "../pages/activate";
import ResendToken from "../pages/resendToken";
import CardDetails from "../pages/card_details";
import BusinessDetails from "../pages/business_details";
import VendorDetails from "../pages/vendor_details";
import UserDetails from "../pages/user_details";
import CustomerSelfRegister from "../pages/CustomerSelfRegister";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/activate" element={<ActivateAccount />} />
            <Route path="/resend_token" element={<ResendToken />} />
            <Route path="/register" element={<CustomerSelfRegister />} />

            {/* Admin-only protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup-business" element={<RegisterBusiness />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/create-card" element={<CreateCard />} />
                <Route path="/business" element={<Business />} />
                <Route path="/vendors" element={<Vendor />} />
                <Route path="/create-vendor" element={<CreateVendor />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/create-customer" element={<CreateCustomer />} />
                <Route path="/customer-detail/:public_id" element={<CustomerDetails />} />
                <Route path="/agent-admin" element={<AgentAdmin />} />
                <Route path="/create-agent-admin" element={<CreateAgentAdmin />} />
                <Route path="/card/:card_uid" element={<CardDetails />} />
                <Route path="/business-detail/:public_id" element={<BusinessDetails />} />
                <Route path="/vendor-detail/:public_id" element={<VendorDetails />} />
                <Route path="/user-detail/:public_id" element={<UserDetails />} />
            </Route>

            {/* Customer-only protected routes */}
            <Route element={<CustomerRoute />}>
                <Route path="/customer-page" element={<CustomerPage />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;