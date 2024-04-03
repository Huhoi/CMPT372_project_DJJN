'use client'
import { useTestContext } from "@/app/protected/layout";
import { useEffect, useState } from "react";
import { Category, Ingredient } from "@/app/utils/interfaces";

function ExpireSoonList() {
    const uid = useTestContext();
    let [ingredients, setIngredients] = useState<Ingredient[]>([]);
    let [categories, setCategories] = useState<Category[]>([]);

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
    });

    const convertDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Filter ingredients that expire within 7 days, can change to any number
    ingredients = ingredients.filter(ingredient => {
        const today = new Date();
        const expDate = new Date(ingredient.expiration);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    });

    return (
        <div>
            <div className="flex flex-wrap gap-4">

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Item</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Expiration</th>
                            <th className="px-6 py-3">Category</th>
                        </tr>
                    </thead>
                    {categories.map(category => (
                        <tbody key={category.cid}>
                            {ingredients
                                .filter(ingredient => ingredient.cid === category.cid)
                                .map(ingredient => (
                                    <tr key={ingredient.iid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{ingredient.ingredient_name}</td>
                                        <td className="px-6 py-4">{ingredient.amount} {ingredient.amount_type}</td>
                                        <td className="px-6 py-4">{convertDate(new Date(ingredient.expiration))}</td>
                                        <td className="px-6 py-4">{category.category_name}</td>
                                    </tr>
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default ExpireSoonList;