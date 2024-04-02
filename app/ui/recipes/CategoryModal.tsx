'use client'
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useTestContext } from "@/app/protected/layout";

// modal for adding a new category using Modal component
const CategoryModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('' as string);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

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
            <Modal isOpen={isOpen} onClose={closeModal} modalTitle={""}>
                <h3>Add Category</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category">Category: </label>
                    <input 
                        type="text" 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    /> <br></br>
                    <button type="submit">Add</button>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;