'use client'
import { useEffect, useState } from "react";
import Modal from "./Modal";
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

    function reset() {
        setCategory("");
    }

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>
                Add Category
            </button>

            <Modal isOpen={isOpen} onClose={closeModal} modalTitle={"Create category"}>
                <form onSubmit={handleSubmit} className="h-[200px]">
                    <div id="titleInput">
                        <p className="font-dm_sans tracking-tighter font-bold py-2 text-lg">Category name</p>
                        <input value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        type="text"
                        placeholder="Enter category" />
                    </div>
                    
                    <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                        <button type="reset" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-500 border-2 border-indigo-400 hover:border-indigo-500 rounded-md flex justify-center items-center" onClick={reset}>Reset</button>
                        <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 col-start-4 col-end-4 rounded-md flex justify-center items-center" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center">Save</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CategoryModal;