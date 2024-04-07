'use client'
import { useTestContext } from "@/app/protected/layout";
import { useEffect, useState } from "react";
import { Category, Ingredient } from "@/app/utils/interfaces";

interface ExpiringIngredient {
    iid: number;
    ingredient_name: string;
    amount: number;
    amount_type: string;
    expiration: Date;
    cid: number;
    category_name: string;
}

function ExpireSoonList() {
    const uid = useTestContext();
    let [ingredients, setIngredients] = useState<ExpiringIngredient[]>([]);

    const fetchIngredients = async () => {
        try {

            const response = await fetch('/api/expiring?uid=' + uid);

            if (response.ok) {
                const data = await response.json(); // data is list of categories and list of ingredients
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

    const convertDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

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
                    {ingredients.map(ingredient => (
                        <tbody key={ingredient.iid}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{ingredient.ingredient_name}</td>
                                <td className="px-6 py-4">{ingredient.amount} {ingredient.amount_type}</td>
                                <td className="px-6 py-4">{convertDate(new Date(ingredient.expiration))}</td>
                                <td className="px-6 py-4">{ingredient.category_name}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default ExpireSoonList;