'use client'

import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from './Modal'
import CreatableSelect from 'react-select/creatable'
import { SessionData } from '@/app/utils/lib'
import { UserData } from '@/app/pages/signedIn/account/page'



export interface Ingredient {
    iid: number,
    iname: string,
    rid: number
}

const RecipeModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState("");
    const [favorite, setFavorite] = useState(false);

    const [selected, setSelected] = useState<any[]>([])
    const [selectOptions, setSelectOptions] = useState<any[]>([]);

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

                // Now get session data
                const response2 = await fetch('/api/session');
                if (response2.ok) {
                    const data = await response2.json();

                    console.log(data)
                    setSessionData(data);
                } else {
                    console.error('Failed to fetch session data:', response2.statusText);
                }

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
                rid: 0  // Unknown until created
            }));
            setIngredients(selectedIngredients);
        }
    }, [selected])

    async function handleCreate(e: { preventDefault: () => void }) {
        try {
          const response = await fetch(`/api/recipes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, ingredients: ingredients, instruction: instructions, last_modified: new Date().toString(), favorite: favorite, uid: sessionData?.uid })
          });
      
          if (!response.ok) {
            throw new Error('Failed to POST')
          }
    
        } catch (error) {
            console.error('Error with POST', error)
        }
        
        window.location.href = "/pages/recipes"
    }

    return (
        <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleCreate} className="h-screen">
                <div id="titleInput">
                    <p className="py-2 text-2xl">Recipe name</p>
                    <input value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500"
                        type="text"
                        placeholder="Enter name" />
                </div>

                <div id="ingredientInput">
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
                                color: "white",
                                borderColor: "rgb(14 165 233)",
                                ":hover": {
                                    color: "rgb(203 213 225)",
                                    cursor: "pointer"
                                }
                            }),
                            dropdownIndicator: defaultStyles => ({
                                ...defaultStyles,
                                color: "white",
                                borderColor: "rgb(14 165 233)",
                                ":hover": {
                                    color: "rgb(203 213 225)",
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
                                color: "rgb(203 213 225)",
                                paddingLeft: "7px",
                            }),
                            control: (defaultStyles, state) => ({
                                ...defaultStyles,
                                ":hover": {
                                    borderColor: state.isFocused ? "rgb(14 165 233)" : "rgb(75 85 99)",
                                    borderWidth: "1px",
                                    cursor: "text"
                                },
                                boxShadow: 'none', // Disable blue border
                                backgroundColor: "rgb(51 65 85)",
                                borderColor: state.isFocused ? "rgb(14 165 233)" : "rgb(75 85 99)",
                                borderWidth: "1px",
                                color: "black"
                            }),
                            multiValue: defaultStyles => ({
                                ...defaultStyles,
                                backgroundColor: "rgb(224 242 254)",
                                marginLeft: "8px"
                            }),
                            multiValueLabel: defaultStyles => ({
                                ...defaultStyles,
                                color: "rgb(3 105 161)"
                            }),
                            multiValueRemove: defaultStyles => ({
                                ...defaultStyles,
                                color: "rgb(3 105 161)",
                                backgroundColor: "rgb(224 242 254)",
                                ":hover": {
                                    color: "rgb(224 242 254)",
                                    backgroundColor: "rgb(3 105 161)"
                                }
                            })
                        }} />
                </div>

                <div id="instructionInput">
                    <p className="py-2 text-2xl">Instructions</p>
                    <textarea value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        className="min-h-[150px] resize-none bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500"
                        placeholder="Enter instructions"></textarea>
                </div>

                <div id="favoriteInput">
                    <input name="favorite"
                        type="checkbox"
                        checked={favorite}
                        onChange={handleCheckbox} />
                    <label htmlFor="favorite">Favorite</label>
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