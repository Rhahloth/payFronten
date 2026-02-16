import { useState } from "react";
import MainContent from "../Components/MainContent";
import NavBar from "../Components/NavBar";
import SectionHeader from "../Components/SectionHeader";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import { authHeader } from "../utils/authHeader";



const CreateCard = () => {

    const [cardNumber, setCardNumber] = useState("")
    const [loading, setLoading] = useState(false)

    const SubmitCard = async(e) => {
        e.preventDefault()
        const payload = {
            card_number:cardNumber
        }
        setLoading(true)
        try{
            const resp = await axios.post("https://edutele-pay-backend.onrender.com/api/cards/preprinted", payload, {
                headers :{
                    "Content-Type" : "application/json",
                    Authorization: authHeader()
                }
            })
            console.log(resp.data)
            setLoading(false)
            
        }catch(err){
            console.log(err)
            setLoading(false)
        }

    }

    return(
        <div className="w-full">
            <Sidebar />
            <MainContent>
            <NavBar />
            <SectionHeader title="Create New Card" />
            <div className="p-10 w-full flex items-center justify-center">
                <form className="bg-white p-6 rounded shadow-md w-3/4" onSubmit={SubmitCard}> 
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                        <input type="text" onChange={(e) => setCardNumber(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter card Number" />
                    </div>
                    { loading ? (
                        <div className="">
                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                    ):(
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Card</button>
                    )}
                    
                </form>
            </div>
            </MainContent>
        </div>
    )
}

export default CreateCard