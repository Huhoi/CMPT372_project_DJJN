'use client'
import { useEffect, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { useTestContext } from "@/app/protected/layout";

export interface Category {
    cid: number,
    category_name: string,
    uid: number
}

// modal for adding a new category using Modal component
const CategoryModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [category, setCategory] = useState('' as string);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const uid = useTestContext();
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