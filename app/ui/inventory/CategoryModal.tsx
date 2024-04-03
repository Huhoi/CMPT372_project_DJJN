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
    const uid = useTestContext();

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                <form onSubmit={handleSubmit} className="font-dm_sans h-[580px]">
                <p className="py-2 text-2xl">Category Name</p>
                    <input
                        type="text"
                        required
                        id="category"
                        value={category}
                        placeholder="Enter category name"
                        autoComplete="off"
                        className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                        <button type="button" onClick={onClose} className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 rounded-md flex justify-center items-center">Close</button>
                        <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;