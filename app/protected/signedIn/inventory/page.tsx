"use client"

import { useEffect, useState } from "react";
import { useTestContext } from "../../layout";
import AddButton from "@/app/ui/inventory/AddButton";
import AddModal from "@/app/ui/inventory/AddModal";

interface Category {
    cid: number;
    category_name: string;
    uid: string;
}

interface Ingredient {
    iid: number;
    name: string;
    cid: number;
}

export default function InventoryPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

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

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const data = { cid: categoryId };
            const response = await fetch(`/api/categories/`, {
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
    return (
        <>
            <AddButton />
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-wrap gap-4">
                    {categories.map(category => (
                        <div key={category.cid} className="p-4 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">{category.category_name}</h2>
                                <button onClick={() => handleDeleteCategory(category.cid)} className="text-red-500 ml-2">Delete</button>
                            </div>
                            <ul>
                                {ingredients
                                    .filter(ingredient => ingredient.cid === category.cid)
                                    .map(ingredient => (
                                        <li key={ingredient.iid} className="mb-1">{ingredient.name}</li>
                                    ))}
                            </ul>
                            <AddModal cid={category.cid} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}