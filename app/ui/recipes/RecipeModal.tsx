'use client'

import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from './Modal'
import CreatableSelect from 'react-select/creatable'



export interface Ingredient {
    iid: number,
    iname: string,
    rid: number
}

const RecipeModal: React.FC<ModalProps> = ({title, isOpen, onClose, children}) => {
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [directions, setDirections] = useState("");

    const [selected, setSelected] = useState<any[]>([])
    const [selectOptions, setSelectOptions] = useState<any[]>([]);

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

    // The values from a multi-change input returns an object-- use 
    // this function to handle the values 
    function handleMultiChange(values: any) {
        setSelected(values);
    }

    // Fetch ingredients on page load
    useEffect(() => {
        const handleReadIngredients = async () => {
            try {
                const response = await fetch(`/api/recipes`)
                console.log(response.json());
            
                if (!response.ok) {
                    throw new Error('Failed to GET')
                }
            
                const fetched = await response.json();
                const items: Ingredient[] = fetched.map((item: any) => ({
                    iid: item.iid,
                    iname: item.iname,
                    rid: item.rid
                }))
                setIngredients(items)

                // Add as Select form options
                var selectOptionsList: any[] = [];
                items.forEach(ingredient => {
                    selectOptionsList.push({ value: ingredient.iname, label: ingredient.iname });
                });
                setSelectOptions(selectOptionsList);

            } catch (error) {
                console.error('Error with GET')
            }
        };

        handleReadIngredients();
    }, []);

    function reset() {
        setName("");
        setDirections("");
        setSelected([]);
        setIngredients([]);
    }

    return (
        <Modal title={"Untitled recipe"} isOpen={isOpen} onClose={onClose}>
            <form className="h-screen">
                <div id="titleInput">
                    <p className="py-2 text-2xl">Recipe name</p>
                    <input value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500" 
                    type="text" 
                    placeholder="Enter name" />
                </div>

                <div id="ingredientInput">
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
                            borderColor: state.isFocused ? "rgb(14 165 233)": "rgb(75 85 99)",
                            borderWidth: "1px",
                            cursor: "text" 
                        },
                            boxShadow: 'none', // Disable blue border
                            backgroundColor: "rgb(51 65 85)", 
                            borderColor: state.isFocused ? "rgb(14 165 233)": "rgb(75 85 99)",
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
                    }}/>
                </div>

                <div id="instructionInput">
                    <p className="py-2 text-2xl">Instructions</p>
                    <textarea value={directions} 
                    onChange={(e) => setDirections(e.target.value)}
                    required
                    className="min-h-[150px] resize-none bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500" 
                    placeholder="Enter directions"></textarea>
                </div>

                <div id="favoriteInput">
                    <input name="favorite" type="checkbox" />
                    <label htmlFor="favorite">Favorite</label>
                </div>
            </form>
        </Modal>
    )
}

export default RecipeModal