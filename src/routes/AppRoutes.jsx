import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import RegisterUser from "../pages/registerUser";
import RegisterInstituition from "../pages/registerInstitution";
import Cards from "../pages/Cards"; 
import CreateCard from "../pages/CreateCard";
import {Routes, Route } from "react-router-dom";
import Institution from "../pages/Institution";
import Vendor from "../pages/Vendor";
import CreateVendor from "../pages/CreateVendor";
import PlatformAdmin from "../pages/platFormAdmin";
import CreatePlatformAdmin from "../pages/CreatePlaformAdmin";
import Customer from "../pages/Customers";
import CreateCustomer from "../pages/CreateCustomers";


const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-institution" element={<RegisterInstituition />} />
            <Route path="/register-user" element={<RegisterUser />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/create-card" element={<CreateCard />} />
            <Route path="/institution" element={ <Institution /> } />
            <Route path="/vendors" element={ <Vendor />} />
            <Route path="/create-vendor" element={ <CreateVendor /> } />
            <Route path="/platform-admin" element={<PlatformAdmin />} />
            <Route path="/create-platform-admin" element={<CreatePlatformAdmin /> } />
            <Route path="/customer" element={<Customer />} />
            <Route path="/create-customer" element ={ <CreateCustomer /> } />
        </Routes>
    )

}

export default AppRoutes;