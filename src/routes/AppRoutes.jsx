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
        </Routes>
    )

}

export default AppRoutes;