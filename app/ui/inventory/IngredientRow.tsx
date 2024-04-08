'use client'
import { useState } from "react";
import { Ingredient, AmountType } from "@/app/utils/interfaces";


interface IngredientRowProps {
    ingredient: Ingredient;
    handleDeleteIngredient: (ingredientId: number) => void;
    notifySave: (ingredient: Ingredient) => void;
}

const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient, handleDeleteIngredient, notifySave }) => {
    const [isEditing, setIsEditing] = useState(false); // State to change the row to edit mode
    const [editedIngredient, setEditedIngredient] = useState<Ingredient>(ingredient);

    // Set the row to edit mode
    const setEdit = () => {
        setIsEditing(true);
    };

    // Call API to update the ingredient table then notify the parent component to update the displayed list
    const handleSaveEdit = async () => {
        try {
            const response = await fetch('/api/inventory', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedIngredient)
            });

            if (response.ok) {
                setIsEditing(false);
                notifySave(editedIngredient);
            } else {
                console.error('Error updating ingredient:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    }

    // Cancel the edit and revert the changes
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedIngredient(ingredient);
    }

    // Update the state of the edited ingredient when the input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedIngredient((prevIngredient) => ({
            ...prevIngredient,
            [name]: value
        }));
    };

    // Update the state of the edited ingredient when the amount type changes
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const amount_type = e.target.value as AmountType;
        setEditedIngredient((prevIngredient) => ({
            ...prevIngredient,
            amount_type: amount_type
        }));
    };

    // Convert the date to a string for display
    const convertDate = (date: Date) => {
        if (isNaN(date.getDate())) return '';
        return date.toISOString().split('T')[0];
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(ingredient));
    };

    const handleDragDrop = async (e: React.DragEvent) => {
        e.preventDefault();

        let droppedIngredient: Ingredient = JSON.parse(e.dataTransfer.getData('text/plain')) as Ingredient;
        droppedIngredient = { ...droppedIngredient, cid: ingredient.cid };

        try {
            const response = await fetch('/api/inventory', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(droppedIngredient)
            });

            if (response.ok) {
                notifySave(droppedIngredient);
            } else {
                console.error('Error updating ingredient:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };

    return (
        <tbody>
            {isEditing ? (
                // EDIT MODE 
                <>
                <tr>
                    <td className="px-6 py-4 w-1/5">
                        <input
                            type="text"
                            name="ingredient_name"
                            value={editedIngredient.ingredient_name}
                            onChange={handleInputChange}
                            required
                            className="bg-slate-200 appearance-none border-2 border-gray-400 rounded w-full leading-tight focus:outline-none focus focus:border-slate-400"
                            />
                    </td>
                    <td className="px-6 py-4 flex items-center">
                        <input
                            type="number"
                            name="amount"
                            value={editedIngredient.amount}
                            onChange={handleInputChange}
                            required
                            className="bg-slate-200 appearance-none border-2 border-gray-400 rounded w-full leading-tight focus:outline-none focus focus:border-slate-400"
                            />
                        <select 
                            name="amountType" 
                            id="amountType" 
                            value={editedIngredient.amount_type as AmountType} 
                            onChange={handleSelectChange}
                            className="bg-slate-200 appearance-none border-2 border-gray-400 rounded w-full leading-tight focus:outline-none focus focus:border-slate-400 hover:cursor-pointer"
                            >
                            {Object.values(AmountType).map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </td>
                    <td className="px-6 py-4 w-1/5">
                        <input
                            type="date"
                            name="expiration"
                            value={convertDate(new Date(editedIngredient.expiration))}
                            onChange={handleInputChange}
                            required
                            className="bg-slate-200 appearance-none border-2 border-gray-400 rounded w-full leading-tight focus:outline-none focus focus:border-slate-400 hover:cursor-pointer"
                            />
                    </td>
                    <td className="px-6 py-4 w-1/5">
                        <button onClick={handleSaveEdit}>Save</button>
                    </td>
                    <td className="px-6 py-4 w-1/5">
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </td>
                </tr>
                </>
            ) : (
                // DISPLAY MODE
                <>
                <tr
                    draggable
                    onDragStart={handleDragStart}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                    className="hover:bg-blue-100 cursor-pointer"
                >
                    <td className="px-6 py-4 w-1/5">{ingredient.ingredient_name}</td>
                    <td className="px-6 py-4 w-1/5">{ingredient.amount} {ingredient.amount_type}</td>
                    <td className="px-6 py-4 w-1/5">{convertDate(new Date(ingredient.expiration))}</td>
                    <td className="px-6 py-4 w-1/5">
                        <button onClick={setEdit}>Edit</button>
                    </td>
                    <td className="px-6 py-4 w-1/5">
                        <button onClick={() => handleDeleteIngredient(ingredient.iid)}> Delete</button>
                    </td>
                </tr>
                </>
            )}

        </tbody>
    );
};

export default IngredientRow;