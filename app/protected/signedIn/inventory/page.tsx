"use client"

import { useEffect, useState } from "react";
import { useTestContext } from "../../layout";
import AddButton from "@/app/ui/inventory/AddButton";
import AddModal from "@/app/ui/inventory/AddModal";
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

    const fetchIngredients = async () => {
        try {

            const response = await fetch('/api/categories?uid=' + uid);

            if (response.ok) {
                const data = await response.json(); // data is list of categories and list of ingredients
                setCategories(data.categories);
                setIngredients(data.ingredients);
            } else {
                console.error('Failed to fetch ingredients:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const data = { cid: categoryId };
            const response = await fetch(`/api/categories?cid=` + data.cid, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If deletion is successful, remove the deleted category from the state
                setCategories(categories.filter(category => category.cid !== categoryId));
            } else {
                console.error('Failed to delete category:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

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

    const convertDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleModalOpen = (cid: number) => {
        setModalStates(prevStates => ({
            ...prevStates,
            [cid]: true
        }));
    }

    const handleModalClose = (cid: number) => {
        setModalStates(prevStates => ({
            ...prevStates,
            [cid]: false
        }));
        fetchIngredients();
    }

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
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients
                                        .filter(ingredient => ingredient.cid === category.cid)
                                        .map(ingredient => (
                                            <tr key={ingredient.iid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-4">{ingredient.ingredient_name}</td>
                                                <td className="px-6 py-4">{ingredient.amount} {ingredient.amount_type}</td>
                                                <td className="px-6 py-4">{convertDate(new Date(ingredient.expiration))}</td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => handleDeleteIngredient(ingredient.iid)} className="text-red-500 ml-2">Delete Ingredient</button>
                                                </td>
                                            </tr>
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