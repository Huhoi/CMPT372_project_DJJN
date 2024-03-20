import { useState } from "react";
import Modal from "./Modal";


// modal for adding a new category using Modal component
const CategoryModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('' as string);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // add form handling
    };

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>
                Add Category
            </button>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <h3>Add Category</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category">Category: </label>
                    <input type="text" id="category" /> <br></br>
                    <button type="submit">Add</button>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;