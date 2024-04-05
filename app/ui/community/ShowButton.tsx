'use client'
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { AmountType } from "@/app/utils/interfaces";
import { InformationCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline';

interface ShowButtonProps {
    id: number;
}
// modal for adding a new category using Modal component
const ShowButton: React.FC<ShowButtonProps> = ({ id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [recipeInfo, setRecipeInfo] = useState<any>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);


    useEffect(() => {
        const fetchRecipeInfo = async () => {
            const storedRecipeInfo = localStorage.getItem(`${id}`);
            if (storedRecipeInfo) {
                // Recipe information found in local storage, use it directly
                setRecipeInfo(JSON.parse(storedRecipeInfo));
            } else {
                const apiKey = '66a1a479f6384fcf8319c6a701e0637b';
                const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setRecipeInfo(data);
                        localStorage.setItem(`${id}`, JSON.stringify(data)); // Save recipe information to local storage
                    } else {
                        console.error('Failed to fetch recipe information:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching recipe information:', error);
                }
            }
        };

        if (isOpen) {
            fetchRecipeInfo();
        }
    }, [id, isOpen]);


    const handleSave = async () => {
        console.log("save", { id })
    }

    return (
        <>
            <button className="py-4 px-2 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center" onClick={openModal}>
                <InformationCircleIcon className="h-5 w-5 mr-2" /> More Info
            </button>
            <button className="py-4 px-2 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-green-600 hover:bg-green-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center" onClick={handleSave}>
                <BookmarkIcon className="h-5 w-5 mr-2" /> Save Recipe
            </button>
            <Modal modalTitle="Recipe Information" isOpen={isOpen} onClose={closeModal}>
                {recipeInfo && (
                    <div>
                        <h2 className="text-lg font-semibold">{recipeInfo.title}</h2>
                        <p>{recipeInfo.instructions}</p>

                    </div>
                )}
            </Modal>
        </>
    );
};

export default ShowButton;