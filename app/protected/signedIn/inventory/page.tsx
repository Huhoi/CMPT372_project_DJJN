"use client"

import { useEffect, useState } from "react";
import { useTestContext } from "../../layout";
import { Category, Ingredient } from "@/app/utils/interfaces";
import AddButton from "@/app/ui/inventory/AddButton";
import AddModal from "@/app/ui/inventory/AddModal";
import IngredientRow from "@/app/ui/inventory/IngredientRow";

interface ModalState {
    [cid: number]: boolean;
}

export default function InventoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchedCid, setSearchedCid] = useState<number | null>(null);
    
    const uid = useTestContext();
    
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    
    // Keep track of which modal is open for each category
    const [modalState, setModalStates] = useState<ModalState>({});
    
    // Gets the user's categories
    const fetchData = async () => {
        try {
            const response = await fetch('/api/categories?uid=' + uid, {method: 'GET'});

            if (response.ok) {
                const data = await response.json();
                if (data.categories.length > 0) {
                    setCategories(data.categories);
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
        if (confirm('Are you sure you want to delete this category?') === false) return;
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
        if (confirm('Are you sure you want to delete this ingredient?') === false) return;
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, cid: number) => {
        setSearchedCid(cid);
        setSearchQuery(e.target.value.toLowerCase());
    };

    return (
        <>
            <AddButton />
            <div className="flex flex-wrap w-full mt-8 justify-center items-center h-screen overflow-auto">
                {categories.map(category => (
                    <div key={category.cid} className="flex flex-col py-4 px-4 w-11/12 mb-2 bg-slate-100 border-2 rounded h-2/5">
                        <div className="h-28">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="text-lg text-gray-800">{category.category_name}</h2>
                                <button onClick={() => handleDeleteCategory(category.cid)} className="text-red-500 ml-2">Delete Category</button>
                            </div>
                            <div className="text-sm text-gray-800">
                                <input
                                    type="text"
                                    onChange={(e, cid = category.cid) => handleSearchChange(e, cid)}
                                    className="w-full py-2 px-1 mb-1 bg-slate-200 appearance-none border-2 border-gray-300 rounded leading-tight focus:outline-none focus focus:border-slate-400" 
                                    placeholder="Search..." 
                                    />
                            </div>
                            <AddModal cid={category.cid} isOpen={modalState[category.cid] || false} onClose={() => handleModalClose(category.cid)} onOpen={() => handleModalOpen(category.cid)}/>
                        </div>
                        <div className="flex-1 overflow-y-scroll mt-1">
                            {/* <div className="absolute h-2/5 overflow-y-scroll overflow-hidden"> */}
                            <table className="w-full text-sm text-left rtl:text-right text-gray-700 table-auto overflow-y-scroll">
                                <thead className="text-xs text-gray-800 uppercase bg-blue-200">
                                    <tr>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Expiration</th>
                                        <th className="px-6 py-3"></th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                {searchedCid === category.cid ?
                                    // If category is searched, filter ingredients by search query
                                    ingredients
                                    .filter(ingredient => (ingredient.cid === category.cid) && (ingredient.ingredient_name.toLowerCase().includes(searchQuery)))
                                    .map(ingredient => (
                                        <IngredientRow 
                                        key={ingredient.iid} 
                                        ingredient={ingredient} 
                                        handleDeleteIngredient={handleDeleteIngredient} 
                                        notifySave={handleEditIngredient}
                                        />
                                    ))
                                    :
                                    // Not the category being searched, display all ingredients
                                    ingredients
                                    .filter(ingredient => ingredient.cid === category.cid)
                                    .map(ingredient => (
                                        <IngredientRow 
                                        key={ingredient.iid} 
                                        ingredient={ingredient} 
                                        handleDeleteIngredient={handleDeleteIngredient} 
                                        notifySave={handleEditIngredient}
                                        />
                                    ))
                                }
                            </table>
                            {/* </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}