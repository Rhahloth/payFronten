import {Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoutes";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Business from "../pages/business";
import RegisterBusiness from "../pages/business_create";
import Cards from "../pages/Cards";
import CreateCard from "../pages/cards_create";
import Vendor from "../pages/vendor";
import CreateVendor from "../pages/vendor_create";
import Customer from "../pages/Customers";
import CreateCustomer from "../pages/customers_create";
import AgentAdmin from "../pages/agent_admin";
import CreateAgentAdmin from "../pages/agent_admin_create";
import Logout from "../pages/logout";






const AppRoutes = () => {
    return(
        <Routes>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            {/* Protected routes  */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup-institution" element={<RegisterBusiness />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/create-card" element={<CreateCard />} />
                <Route path="/business" element={ <Business /> } />
                <Route path="/vendors" element={ <Vendor />} />
                <Route path="/create-vendor" element={ <CreateVendor /> } />
                <Route path="/customer" element={<Customer />} />
                <Route path="/create-customer" element ={ <CreateCustomer /> } />
                <Route path="/agent-admin" element={<AgentAdmin />} />
                <Route path="/create-agent-admin" element={<CreateAgentAdmin /> } />
                <Route path="/logout" element={<Logout />} />
            </Route>
        </Routes>
    )

}

export default AppRoutes;