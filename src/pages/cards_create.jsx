import { useState, useEffect } from "react";
import MainContent from "../Components/MainContent";
import SectionHeader from "../Components/SectionHeader";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import { authHeader } from "../utils/authHeader";
import '../PageComponents.css'

const CreateCard = () => {
    const [cardNumber, setCardNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [existingCards, setExistingCards] = useState([])
    const [warning, setWarning] = useState("")

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const resp = await axios.get("https://edutele-pay-backend.onrender.com/api/cards", {
                    headers: { Authorization: authHeader() }
                })
                const cards = resp.data.items || []
                setExistingCards(cards)
                const numbers = cards.map(card => {
                    const match = card.card_number.match(/\d+/)
                    return match ? parseInt(match[0]) : 0
                })
                const highest = Math.max(...numbers, 0)
                setCardNumber(`EDU-${(highest + 1).toString().padStart(3, '0')}`)
            } catch (err) {
                console.log(err)
            }
        }
        fetchCards()
    }, [])

    const checkIfExists = (value) => {
        const exists = existingCards.some(card => card.card_number === value)
        setWarning(exists ? "This card number already exists!" : "")
    }

    const SubmitCard = async (e) => {
        e.preventDefault()
        if (existingCards.some(card => card.card_number === cardNumber)) {
            setWarning("Cannot create: Card number already exists!")
            return
        }
        setLoading(true)
        try {
            const resp = await axios.post(
                "https://edutele-pay-backend.onrender.com/api/cards/preprinted",
                { card_number: cardNumber },
                { headers: { "Content-Type": "application/json", Authorization: authHeader() } }
            )
            const numbers = [...existingCards, resp.data].map(card => {
                const match = card.card_number.match(/\d+/)
                return match ? parseInt(match[0]) : 0
            })
            const highest = Math.max(...numbers)
            setCardNumber(`EDU-${(highest + 1).toString().padStart(3, '0')}`)
            setExistingCards(prev => [...prev, resp.data])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const suggestedNext = `EDU-${(Math.max(...existingCards.map(c => {
        const match = c.card_number.match(/\d+/)
        return match ? parseInt(match[0]) : 0
    }), 0) + 1).toString().padStart(3, '0')}`

    return (
        <div className="w-full">
            <Sidebar />
            <MainContent>
                <SectionHeader title="Create New Card" showBack={true} backTo="/cards" />

                <div className="flex items-start justify-center px-8 py-10">
                    <form className="w-full max-w-lg page-form-container" onSubmit={SubmitCard}>

                        <div className="mb-6">
                            <label className="block mb-1 page-form-label">Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => {
                                    setCardNumber(e.target.value)
                                    checkIfExists(e.target.value)
                                }}
                                placeholder="Enter card number"
                                className={`w-full px-3 py-2 page-form-input ${warning ? 'input-error' : ''}`}
                            />
                            {warning && (
                                <p className="mt-1 text-sm page-warning">{warning}</p>
                            )}
                            <p className="mt-1 text-sm page-hint">
                                Suggested next: <span className="page-hint-value">{suggestedNext}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!!warning}
                                    className="px-6 py-2 page-btn-save"
                                >
                                    Create Card
                                </button>
                            )}
                        </div>

                    </form>
                </div>

            </MainContent>
        </div>
    )
}

export default CreateCard