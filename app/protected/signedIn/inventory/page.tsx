"use client"

import { useEffect, useState } from "react";
import { useTestContext } from "../../layout";
import AddButton from "@/app/ui/inventory/AddButton";
import AddModal from "@/app/ui/inventory/AddModal";
import IngredientRow from "@/app/ui/inventory/IngredientRow";
import { Category, Ingredient } from "@/app/utils/interfaces";

interface ModalState {
    [cid: number]: boolean;
}

export default function InventoryPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Keep track of which modal is open for each category
    const [modalState, setModalStates] = useState<ModalState>({});

    const uid = useTestContext();

    // Gets the user's categories
    const fetchData = async () => {
        try {
            const response = await fetch('/api/categories?uid=' + uid, {method: 'GET'});

            if (response.ok) {
                const data = await response.json();

                // Check if user has any categories
                if (data.categories.length > 0) {
                    setCategories(data.categories);
                    // Fetch ingredients if the user has categories
                    fetchIngredients();
                }
            } else {
                console.error('Failed to fetch categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Gets the user's ingredients
    const fetchIngredients = async () => {
        try {
                const response = await fetch('/api/inventory?uid=' + uid, {method: 'GET'});
    
                if (response.ok) {
                    const data = await response.json();
                    setIngredients(data.ingredients);
                } else {
                    console.error('Failed to fetch ingredients:', response.statusText);
                }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    // Fetch data on page load
    useEffect(() => {
        fetchData();
    }, []);

    // Function to call API to delete a category
    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const data = { cid: categoryId };
            const response = await fetch(`/api/categories?cid=` + data.cid, {
                method: 'DELETE'
            });

            if (response.ok) {
                // If deletion is successful, remove the deleted category from the state
                setCategories(categories.filter(category => category.cid !== categoryId));
                fetchData();
            } else {
                console.error('Failed to delete category:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Function to call API to delete an ingredient
    const handleDeleteIngredient = async (ingredientId: number) => {
        try {
            const data = { iid: ingredientId };
            const response = await fetch(`/api/inventory?iid=` + data.iid, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If deletion is successful, remove the deleted ingredient from the state
                setIngredients(ingredients.filter(ingredient => ingredient.iid !== ingredientId));
            } else {
                console.error('Failed to delete ingredient:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    // Function to update the displayed list of ingredients after an edit
    // This function is passed to IngredientRow as a prop where the edit is made
    const handleEditIngredient = (editedIngredient: Ingredient) => {
        const updatedIngredients = ingredients.map(ingredient => {
            if (ingredient.iid === editedIngredient.iid) {
                return editedIngredient;
            }
            return ingredient;
        });
        setIngredients(updatedIngredients);
    };

    // Opens the modal for ingredient adding
    const handleModalOpen = (cid: number) => {
        setModalStates(prevStates => ({
            ...prevStates,
            [cid]: true
        }));
    };

    // Closes the modal for ingredient adding
    const handleModalClose = (cid: number) => {
        setModalStates(prevStates => ({
            ...prevStates,
            [cid]: false
        }));
        fetchData();
    };

    return (
        <>
            <AddButton />
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-wrap gap-4">
                    {categories.map(category => (
                        <div key={category.cid} className="py-4 px-4 w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg text-white">{category.category_name}</h2>
                                <button onClick={() => handleDeleteCategory(category.cid)} className="text-red-500 ml-2">Delete Category</button>
                            </div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Expiration</th>
                                        <th className="px-6 py-3"></th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients
                                        .filter(ingredient => ingredient.cid === category.cid)
                                        .map(ingredient => (
                                            <IngredientRow 
                                                key={ingredient.iid} 
                                                ingredient={ingredient} 
                                                handleDeleteIngredient={handleDeleteIngredient} 
                                                notifySave={handleEditIngredient}
                                            />
                                    ))}
                                </tbody>
                            </table>
                            <AddModal cid={category.cid} isOpen={modalState[category.cid] || false} onClose={() => handleModalClose(category.cid)} onOpen={() => handleModalOpen(category.cid)}/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}