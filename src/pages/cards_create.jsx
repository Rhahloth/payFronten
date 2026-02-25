import { useState, useEffect } from "react";
import MainContent from "../Components/MainContent";
import NavBar from "../Components/NavBar";
import SectionHeader from "../Components/SectionHeader";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import { authHeader } from "../utils/authHeader";

const CreateCard = () => {
    const [cardNumber, setCardNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [existingCards, setExistingCards] = useState([])
    const [warning, setWarning] = useState("")

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const resp = await axios.get("https://edutele-pay-backend.onrender.com/api/cards", {
                    headers: {
                        Authorization: authHeader()
                    }
                })
                const cards = resp.data.items || []
                setExistingCards(cards)
                
                // Find highest number
                const numbers = cards.map(card => {
                    const match = card.card_number.match(/\d+/)
                    return match ? parseInt(match[0]) : 0
                })
                const highest = Math.max(...numbers, 0)
                const nextNum = (highest + 1).toString().padStart(3, '0')
                setCardNumber(`EDU-${nextNum}`)
            } catch (err) {
                console.log(err)
            }
        }
        fetchCards()
    }, [])

    const checkIfExists = (value) => {
        const exists = existingCards.some(card => card.card_number === value)
        if (exists) {
            setWarning("This card number already exists!")
        } else {
            setWarning("")
        }
    }

    const SubmitCard = async(e) => {
        e.preventDefault()
        
        // Check again before submitting
        if (existingCards.some(card => card.card_number === cardNumber)) {
            setWarning("Cannot create: Card number already exists!")
            return
        }

        const payload = {
            card_number: cardNumber
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
            // Update existing cards and suggest next
            const numbers = [...existingCards, resp.data].map(card => {
                const match = card.card_number.match(/\d+/)
                return match ? parseInt(match[0]) : 0
            })
            const highest = Math.max(...numbers)
            const nextNum = (highest + 1).toString().padStart(3, '0')
            setCardNumber(`EDU-${nextNum}`)
            setExistingCards(prev => [...prev, resp.data])
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
                        <input 
                            type="text" 
                            value={cardNumber} 
                            onChange={(e) => {
                                setCardNumber(e.target.value)
                                checkIfExists(e.target.value)
                            }} 
                            className={`w-full px-3 py-2 border rounded ${warning ? 'border-red-500' : ''}`} 
                            placeholder="Enter card Number" 
                        />
                        {warning && (
                            <p className="text-red-500 text-sm mt-1">{warning}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Suggested next: EDU-{(Math.max(...existingCards.map(c => {
                                const match = c.card_number.match(/\d+/)
                                return match ? parseInt(match[0]) : 0
                            }), 0) + 1).toString().padStart(3, '0')}
                        </p>
                    </div>
                    { loading ? (
                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    ):(
                        <button 
                            type="submit" 
                            className={`px-4 py-2 rounded ${warning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            disabled={warning}
                        >
                            Create Card
                        </button>
                    )}
                </form>
            </div>
            </MainContent>
        </div>
    )
}

export default CreateCard