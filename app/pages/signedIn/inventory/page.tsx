"use client"

import { useEffect, useState } from "react";
import Background from "../../../ui/home/Background";
import CategoryModal from "../../../ui/recipes/CategoryModal";
import { useRouter } from 'next/navigation';
import { getSession } from '../../../utils/actions'
import { SessionData } from '@/app/utils/lib';

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
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Define a function to fetch session data
    const fetchSessionData = async () => {
        try {
            // Make a GET request to the /api/session endpoint
            const response = await fetch('/api/session');

            // Check if the response is successful (status code 200)
            if (response.ok) {
                // Parse the JSON response
                const data = await response.json();
                console.log(data)
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

    // Use the useEffect hook to fetch session data when the component mounts
    useEffect(() => {
        fetchSessionData();
    }, []);

    const fetchIngredients = async () => {
        try {
            const uid: string = sessionData!.uid as string;
            const response = await fetch('/api/categories?uid=' + uid);

            if (response.ok) {
                const data = await response.json(); // data is list of categories and list of ingredients
                // console.log(data.categories, data.ingredients);
                setCategories(data.categories);
                setIngredients(data.ingredients);
                // console.log(categories, ingredients)
            } else {
                console.error('Failed to fetch ingredients:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    useEffect(() => {
        if (sessionData) {
            fetchIngredients();
        }
        else
            console.log('No session data')
    }, [sessionData]);

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
            <div className="flex justify-center items-center h-screen">
                <CategoryModal />
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
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}