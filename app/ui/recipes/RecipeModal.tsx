'use client'

import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from '../Modal'
import CreatableSelect from 'react-select/creatable'
import { Switch } from '@headlessui/react'
import { Ingredient } from '../inventory/IngredientModal'
import { useTestContext } from '@/app/protected/layout'

const RecipeModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState("");
    const [favorite, setFavorite] = useState(false);

    const [selected, setSelected] = useState<any[]>([])
    const [selectOptions, setSelectOptions] = useState<any[]>([]);

    const uid = useTestContext()

    // The values from a multi-change input returns an object-- use 
    // this function to handle the values 
    function handleMultiChange(values: any) {
        setSelected(values);
    }

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFavorite(event.target.checked);
    };

    function reset() {
        setTitle("");
        setInstructions("");
        setSelected([]);
        setIngredients([]);
        setFavorite(false);
    }

    // Fetch ingredients and UID on page load
    useEffect(() => {
        const handlePageLoad = async () => {
            try {
                // First get ingredients
                const response1 = await fetch(`/api/recipes`);

                if (!response1.ok) {
                    throw new Error('Failed to GET');
                }

                var fetched = await response1.json();
                fetched = fetched.ingredients;
                console.log(fetched);
                const items: Ingredient[] = fetched.map((item: any) => ({
                    iid: item.iid,
                    iname: item.name,
                }))
                setIngredients(items);

                // Add as Select form options
                var selectOptionsList: any[] = [];
                items.forEach(ingredient => {
                    selectOptionsList.push({ value: ingredient.iname, label: ingredient.iname });
                });
                setSelectOptions(selectOptionsList);

            } catch (error) {
                console.error('Error with retrieving: ', error);
            }
        };

        handlePageLoad();
    }, []);

    // Every time the "selected" variable (aka. the values of the input)
    // is changed, detect it and adjust list of selected ingredients
    useEffect(() => {
        if (selected) {
            const selectedIngredients: Ingredient[] = selected.map((selection: any) => ({
                iid: 0, // Unknown until created
                iname: selection.label,
                expiration: Date(),
                amount: 0,
                cid: 0,
            }));
            setIngredients(selectedIngredients);
        }
    }, [selected])

    async function handleCreate(e: { preventDefault: () => void }) {
        try {
            const response = await fetch(`/api/recipes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, ingredients: ingredients, instruction: instructions, last_modified: new Date().toString(), favorite: favorite, uid: uid})
            });

            if (!response.ok) {
                throw new Error('Failed to POST')
            }

        } catch (error) {
            console.error('Error with POST', error)
        }

        window.location.href = "/pages/signedIn/recipes"
    }

    return (
        <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleCreate} className="font-dm_sans h-[550px]">
                <div id="titleInput" className="py-2">
                    <p className="py-2 text-2xl">Recipe name</p>
                    <input value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        type="text"
                        placeholder="Enter name" />
                </div>

                <div id="ingredientInput" className="py-2">
                    <p className="py-2 text-2xl">Ingredients</p>
                    <CreatableSelect
                        value={selected}
                        onChange={handleMultiChange}
                        options={selectOptions}
                        required
                        isMulti
                        isClearable
                        styles={{
                            option: defaultStyles => ({
                                ...defaultStyles,
                                color: "black"
                            }),
                            clearIndicator: defaultStyles => ({
                                ...defaultStyles,
                                color: "#94a3b8",
                                borderColor: "rgb(14 165 233)",
                                ":hover": {
                                    color: "#020617",
                                    cursor: "pointer"
                                }
                            }),
                            dropdownIndicator: defaultStyles => ({
                                ...defaultStyles,
                                color: "#94a3b8",
                                borderColor: "rgb(14 165 233)",
                                ":hover": {
                                    color: "#020617",
                                    cursor: "default"
                                }
                            }),
                            placeholder: defaultStyles => ({
                                ...defaultStyles,
                                color: "rgb(156 163 174)",
                                paddingLeft: "7px"
                            }),
                            input: defaultStyles => ({
                                ...defaultStyles,
                                color: "#020617",
                                paddingLeft: "7px",
                                boxShadow: 'none', // Disable blue border
                            }),
                            control: (defaultStyles, state) => ({
                                ...defaultStyles,
                                ":hover": {
                                    borderColor: state.isFocused ? "#94a3b8" : "#cbd5e1",
                                    borderWidth: "2px",
                                    cursor: "text"
                                },
                                boxShadow: 'none', // Disable blue border
                                backgroundColor: "#e2e8f0",
                                borderColor: state.isFocused ? "#94a3b8" : "#cbd5e1",
                                borderWidth: "2px",
                                color: "black"
                            }),
                            multiValue: defaultStyles => ({
                                ...defaultStyles,
                                backgroundColor: "#6366f1",
                                marginLeft: "8px"
                            }),
                            multiValueLabel: defaultStyles => ({
                                ...defaultStyles,
                                color: "white"
                            }),
                            multiValueRemove: defaultStyles => ({
                                ...defaultStyles,
                                color: "#e2e8f0",
                                backgroundColor: "#4338ca",
                                ":hover": {
                                    color: "white",
                                    backgroundColor: "#4f46e5"
                                }
                            })
                        }} />
                </div>

                <div id="instructionInput" className="py-2">
                    <p className="py-2 text-2xl">Instructions</p>
                    <textarea value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        className="min-h-[120px] resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        placeholder="Enter instructions"></textarea>
                </div>

                <div id="favoriteInput" className="py-4 flex items-center gap-2">
                    <p className="text-2xl">Favorite</p>
                    <Switch
                        checked={favorite}
                        onChange={setFavorite}
                        className={`${
                            favorite ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                        <span
                            className={`${
                            favorite ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                    </Switch>
                </div>

                <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                    <button type="reset" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-500 border-2 border-indigo-400 hover:border-indigo-500 rounded-md flex justify-center items-center" onClick={reset}>Reset</button>
                    <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 col-start-4 col-end-4 rounded-md flex justify-center items-center" onClick={onClose}>Cancel</button>
                    <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center">Save</button>
                </div>
            </form>
        </Modal>
    )
}

export default RecipeModal