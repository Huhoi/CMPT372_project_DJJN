'use client'
import { useTestContext } from "@/app/protected/layout";
import { useEffect, useState } from "react";

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
                const data = await response.json();
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
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="flex w-full text-xs text-gray-800 uppercase bg-blue-200">
                <tr className="flex w-full">
                    <th className="px-6 py-3 w-1/4">Item</th>
                    <th className="px-6 py-3 w-1/4">Amount</th>
                    <th className="px-6 py-3 w-1/4">Expiration</th>
                    <th className="px-6 py-3 w-1/4">Category</th>
                </tr>
            </thead>
            <tbody className="w-full h-64 flex flex-col items-center justify-between overflow-y-scroll">
                {ingredients.map(ingredient => (
                    <tr key={ingredient.iid} className="flex w-full text-gray-800 bg-slate-100">
                        <td className="px-6 py-4 w-1/4">{ingredient.ingredient_name}</td>
                        <td className="px-6 py-4 w-1/4">{ingredient.amount} {ingredient.amount_type}</td>
                        <td className="px-6 py-4 w-1/4">{convertDate(new Date(ingredient.expiration))}</td>
                        <td className="px-6 py-4 w-1/4">{ingredient.category_name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ExpireSoonList;