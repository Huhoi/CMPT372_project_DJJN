'use client'
import { useEffect, useState } from "react";
import Modal from "../recipes/Modal";
import { getSession } from '../../utils/actions'
import { SessionData } from '@/app/utils/lib';


// modal for adding a new category using Modal component
const CategoryModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('' as string);
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
        const uid: string = sessionData!.uid as string;
        try {
            const response = await fetch('../../api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category_name: category, uid: uid }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message === 'Category successfully added') {
                    closeModal();
                    setCategory('');
                }
            }
            else {
                const res = await response.json();
                console.error("Error adding category: ", res.error);
            }
        } 
        catch (error) {
            console.error("Error adding category: ", error);
        }
    };

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>
                Add Category
            </button>
            <Modal modalTitle="New Category" isOpen={isOpen} onClose={closeModal}>
                <h3>Add Category</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category">Category: </label>
                    <input 
                        type="text" 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    /> <br></br>
                    <button type="submit">Add</button><br></br>
                    <button onClick={closeModal}>Close</button>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;