'use client'
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { AmountType } from "@/app/utils/interfaces";
import { InformationCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline';

interface ShowButtonProps {
    id: number;
}

interface ExtendedIngredient {
    name: string;
    amount: number;
    unitLong: string; // Add this property
    // Add other properties if needed
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
        if (recipeInfo) {
            try {
                // Format the ingredients
                const formattedIngredients = formatIngredients(recipeInfo.extendedIngredients);

                // Prepare the recipe data for the POST request
                const recipeData = {
                    recipe_name: recipeInfo.title,
                    instruction: recipeInfo.instructions,
                    favourite: false, // Assuming the recipe is not marked as a favorite initially
                    ingredients: formattedIngredients
                };

                // Make a POST request to the server endpoint
                const response = await fetch('/api/community', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recipeData)
                });

                if (response.ok) {
                    console.log('Recipe and ingredients saved successfully on the server.');
                } else {
                    console.error('Failed to save recipe and ingredients on the server:', response.statusText);
                }
            } catch (error) {
                console.error('Error saving recipe and ingredients:', error);
            }
        }
    };

    function getIngredientUnit(ingredient: any): string {
        if (ingredient.measures.metric && ingredient.measures.metric.unitLong) {
            return ingredient.measures.metric.unitLong;
        } else if (ingredient.measures.us && ingredient.measures.us.unitLong) {
            return ingredient.measures.us.unitLong;
        } else {
            return ''; // Return an empty string if both metric and US units are missing
        }
    }

    function getIngredientAmount(ingredient: any): string {
        if (ingredient.amount) {
            return ingredient.amount.toFixed(1);
        } else {
            return '';
        }
    }

    function formatIngredients(extendedIngredients: ExtendedIngredient[]) {
        console.log("Formatted Ingredients:");

        // Iterate through the extendedIngredients array
        extendedIngredients.forEach((ingredient, index) => {
            // Check if unitLong is defined, if not, use an empty string
            const unit = ingredient.unitLong ? ingredient.unitLong : '';

            // Log the formatted ingredient with unit
            console.log(`${index + 1}. ${ingredient.amount} ${getIngredientUnit(ingredient)} ${ingredient.name}`);
        });
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
                        <hr />
                        <h3 className="text-md font-semibold">Ingredients:</h3>
                        <div className="grid grid-cols-3 gap-3">

                            {recipeInfo.extendedIngredients && recipeInfo.extendedIngredients.map((ingredient: any, index: number) => (
                                <div key={index}>{getIngredientAmount(ingredient)} {getIngredientUnit(ingredient)} {ingredient.name}</div>
                            ))}
                        </div>
                        <hr />
                        <div>
                            <h3 className="text-md font-semibold">Instructions:</h3>

                            <ol className="grid grid-cols-1 gap-3">
                                {recipeInfo.instructions.replace(/<\/?[^>]+(>|$)/g, '').split('.').map((instruction: string, index: number) => {
                                    const trimmedInstruction = instruction.trim();
                                    if (trimmedInstruction) {
                                        return <li key={index}><strong>{index + 1}:</strong> {trimmedInstruction}{index !== recipeInfo.instructions.split('.').length - 1 ? '.' : ''}</li>;
                                    }
                                    return null;
                                })}
                            </ol>

                        </div>
                    </div>
                )}
            </Modal>

        </>
    );
};

export default ShowButton;