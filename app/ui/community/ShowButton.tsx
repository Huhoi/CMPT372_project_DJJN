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
    unitShort: string; // Add this property
    // Add other properties if needed
}

// modal for adding a new category using Modal component
const ShowButton: React.FC<ShowButtonProps> = ({ id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [recipeInfo, setRecipeInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [recipeSaved, setRecipeSaved] = useState(false);

    useEffect(() => {
        const storedRecipeInfo = localStorage.getItem(`${id}`);
        if (storedRecipeInfo) {
            setRecipeInfo(JSON.parse(storedRecipeInfo));
        }
    }, [id]);

    const closeModal = () => setIsOpen(false);

    const openModal = async () => {
        setIsOpen(true);
        if (!recipeInfo) {
            await fetchRecipeInfo();
        }
    };

    const fetchRecipeInfo = async () => {
        setLoading(true);
        try {
            const apiKey = '66a1a479f6384fcf8319c6a701e0637b';
            const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setRecipeInfo(data);
                localStorage.setItem(`${id}`, JSON.stringify(data));
            } else {
                console.error('Failed to fetch recipe information:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching recipe information:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async () => {
        if (!recipeInfo) {
            await fetchRecipeInfo();
        }

        try {
            // Check if the recipe is already saved
            if (!recipeSaved) {
                // Set recipeSaved to true to disable the save button
                setRecipeSaved(true);

                const formattedIngredients: ExtendedIngredient[] = recipeInfo.extendedIngredients.map((ingredient: any) => ({
                    name: ingredient.name,
                    amount: parseFloat(ingredient.measures.metric.amount.toFixed(1)),
                    unit: ingredient.measures.metric.unitShort || 'serving',
                }));

                const recipeData = {
                    recipe_name: recipeInfo.title,
                    instruction: recipeInfo.instructions,
                    favourite: false,
                    ingredients: formattedIngredients,
                    image: recipeInfo.image,
                };

                const saveResponse = await fetch('/api/community', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipeData),
                });

                if (saveResponse.ok) {
                    console.log('Recipe and ingredients saved successfully on the server.');
                } else {
                    console.error('Failed to save recipe and ingredients on the server:', saveResponse.statusText);
                }
            }
        } catch (error) {
            console.error('Error saving recipe and ingredients:', error);
        }
    };

    function getIngredientUnit(ingredient: any): string {
        const metricUnit = ingredient?.measures?.metric?.unitLong;
        const usUnit = ingredient?.measures?.us?.unitLong;

        if (metricUnit) {
            switch (metricUnit.toLowerCase()) {
                case 'g':
                case 'grams':
                    return 'g';
                case 'kg':
                case 'kilograms':
                    return 'kg';
                case 'ml':
                case 'milliliters':
                    return 'ml';
                case 'l':
                case 'liters':
                    return 'l';
                case 'tsps':
                    return 'tsp';
                case 'tsp':
                case 'teaspoon':
                case 'teaspoons':
                    return 'tsp';
                case 'tbsps':
                    return 'tbsp';
                case 'tbsp':
                case 'tablespoon':
                case 'tablespoons':
                    return 'tbsp';
                case 'fl oz':
                case 'fluid ounce':
                case 'fluid ounces':
                    return 'fl oz';
                case 'lb':
                case 'pound':
                case 'pounds':
                    return 'lb';
                case 'oz':
                case 'ounce':
                case 'ounces':
                    return 'oz';
                case 'gal':
                case 'gallon':
                case 'gallons':
                    return 'gal';
                case 'qt':
                case 'quart':
                case 'quarts':
                    return 'qt';
                case 'pt':
                case 'pint':
                case 'pints':
                    return 'pt';
                case 'pinch':
                    return 'pinch';
                default:
                    return 'serving'; // If unit is not one of the predefined options, return 'serving'
            }
        } else if (usUnit) {
            switch (usUnit.toLowerCase()) {
                case 'g':
                case 'grams':
                    return 'g';
                case 'kg':
                case 'kilograms':
                    return 'kg';
                case 'ml':
                case 'milliliters':
                    return 'ml';
                case 'l':
                case 'liters':
                    return 'l';
                case 'tsps':
                    return 'tsp';
                case 'tsp':
                case 'teaspoon':
                case 'teaspoons':
                    return 'tsp';
                case 'tbsp':
                case 'tablespoon':
                case 'tablespoons':
                    return 'tbsp';
                case 'fl oz':
                case 'fluid ounce':
                case 'fluid ounces':
                    return 'fl oz';
                case 'lb':
                case 'pound':
                case 'pounds':
                    return 'lb';
                case 'oz':
                case 'ounce':
                case 'ounces':
                    return 'oz';
                case 'gal':
                case 'gallon':
                case 'gallons':
                    return 'gal';
                case 'qt':
                case 'quart':
                case 'quarts':
                    return 'qt';
                case 'pt':
                case 'pint':
                case 'pints':
                    return 'pt';
                case 'pinch':
                    return 'pinch';
                default:
                    return 'serving'; // If unit is not one of the predefined options, return 'serving'
            }
        } else {
            return 'serving'; // Return 'serving' if both metric and US units are missing
        }
    }

    function getIngredientAmount(ingredient: any): number {
        // Check if metric or us object is available
        if (ingredient.measures && (ingredient.measures.metric || ingredient.measures.us)) {
            // Use the value from the metric object if available, otherwise from the us object
            const amount = ingredient.measures.metric ? ingredient.measures.metric.amount : ingredient.measures.us.amount;
            return parseFloat(amount.toFixed(1));
        } else {
            return NaN; // Return NaN if both metric and us objects are missing
        }
    }

    function formatIngredients(extendedIngredients: any[]) {
        // Initialize an array to store formatted ingredients
        const formattedIngredients: ExtendedIngredient[] = [];

        // Iterate through the extendedIngredients array
        extendedIngredients.forEach((ingredient, index) => {
            // Push the formatted ingredient to the array
            formattedIngredients.push({
                name: ingredient.name,
                amount: getIngredientAmount(ingredient),
                unitShort: getIngredientUnit(ingredient)
            });
        });

        // Return the formatted ingredients array
        return formattedIngredients;
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