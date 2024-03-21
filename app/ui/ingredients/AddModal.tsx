'use client'
import { useEffect, useState } from "react";
import Modal from "../recipes/Modal";
import { getSession } from '../../utils/actions'
import { SessionData } from '@/app/utils/lib';

interface Category {
    cid: number;
}

// modal for adding a new category using Modal component
const AddModal: React.FC<Category> = ({cid}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ingredientName, setIngredientName] = useState('' as string);
    const [expiration, setExpiration] = useState(null as Date | null);
    const [amount, setAmount] = useState(0 as number);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const fetchSessionData = async () => {
        try {
            // Make a GET request to the /api/session endpoint
            const response = await fetch('/api/session');

            // Check if the response is successful (status code 200)
            if (response.ok) {
                // Parse the JSON response
                const data = await response.json();
                // Update the session data state with the response data
                setSessionData(data);
            } else {
                // Handle error response
                console.error('Failed to fetch session data:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error fetching session data:', error);
        }
    };

    useEffect(() => {
        fetchSessionData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await fetch('../../api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: ingredientName, expiration: expiration, amount: amount, cid: cid}),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message === 'Ingredient successfully added') {
                    closeModal();
                    setIngredientName('');
                    setAmount(0);
                }
            }
            else {
                const res = await response.json();
                console.error("Error adding ingredient: ", res.error);
            }
        } 
        catch (error) {
            console.error("Error adding ingredient: ", error);
        }
    };

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>
                Add Ingredient
            </button>
            <Modal modalTitle="Add Ingredient" isOpen={isOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="ingredient">Ingredient Name: </label>
                    <input 
                        type="text" 
                        id="ingredient" 
                        value={ingredientName} 
                        onChange={(e) => setIngredientName(e.target.value)}
                    /> <br />
                    <label htmlFor="expiration">Expiration Date: </label>
                    <input 
                        type="date" 
                        id="expiration" 
                        onChange={(e) => setExpiration(new Date(e.target.value))}
                    /> <br />
                    <label htmlFor="amount">Amount: </label>
                    <input 
                        type="number"
                        id="amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                    /> <br />
                    <button type="submit">Add</button><br></br>
                    <button onClick={closeModal}>Close</button>
                </form>
            </Modal>
        </>
    );
};

export default AddModal;