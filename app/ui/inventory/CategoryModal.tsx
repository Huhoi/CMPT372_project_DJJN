'use client'
import { useEffect, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { getSession } from '../../utils/actions'
import { SessionData } from '@/app/utils/lib';

export interface Category {
    cid: number,
    category_name: string,
    uid: number
}

// modal for adding a new category using Modal component
const CategoryModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [category, setCategory] = useState('' as string);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

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
                    onClose();
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
            <Modal modalTitle="Create a new category" isOpen={isOpen} onClose={onClose}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category">Category: </label>
                    <input 
                        type="text" 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    /> <br></br>
                    <button type="submit">Add</button><br></br>
                    <button onClick={onClose}>Close</button>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;