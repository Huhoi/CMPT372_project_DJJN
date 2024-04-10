'use client'

import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from '../Modal'
import CreatableSelect from 'react-select/creatable'
import { Switch } from '@headlessui/react'
import { useTestContext } from '@/app/protected/layout'
import { AmountType, Ingredient, RecipeIngredient } from '@/app/utils/interfaces'



const RecipeModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [instructions, setInstructions] = useState("");
    const [favorite, setFavorite] = useState(false);

    const [selected, setSelected] = useState<any[]>([])
    const [selectOptions, setSelectOptions] = useState<any[]>([]);

    const uid = useTestContext()

    const [count, setCount] = useState(0);
    const [modalHeight, setModalHeight] = useState(550);
    const [details, setDetails] = useState<RecipeIngredient[]>([]);

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        const updatedDetails = [...details];
        updatedDetails[index].amount = value;
        setDetails(updatedDetails);
    };

    const handleAmountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { value } = event.target;
        const updatedDetails = [...details];
        updatedDetails[index].amount_type = value;
        setDetails(updatedDetails);
    };

    // The values from a multi-change input returns an object-- use 
    // this function to handle the values 
    function handleMultiChange(values: any, actionMeta: any) {
        setSelected(values);

        // ADDING
        if (actionMeta.action === 'select-option') {

            // Increase size of array
            const updatedDetails: RecipeIngredient[] = [...details, { ingredient_name: values[values.length - 1].label, amount: "", amount_type: "" }];
            setDetails(updatedDetails)
        }
        else if (actionMeta.action === 'create-option') {

            // Increase size of array
            const updatedDetails: RecipeIngredient[] = [...details, { ingredient_name: values[values.length - 1].value, amount: "", amount_type: "" }];
            setDetails(updatedDetails)
        }

        // DELETING
        if ((actionMeta.action === 'remove-value' || actionMeta.action === 'pop-value') && actionMeta.removedValue) {
            const removedItem = actionMeta.removedValue;

            const detailsCopy = [...details];
            for (var i = detailsCopy.length - 1; i >= 0; i--) {
                if (detailsCopy[i].ingredient_name == removedItem.label) {
                    detailsCopy.splice(i, 1);
                }
            }

            setTimeout(() => {
                setDetails(detailsCopy);
                console.log(detailsCopy);
            }, 50)
        }
    }

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFavorite(event.target.checked);
    };

    function reset() {
        setTitle("");
        setInstructions("");
        setSelected([]);
        setIngredients([]);
        setDetails([]);
        setFavorite(false);
    }

    // Fetch ingredients and UID on page load
    useEffect(() => {
        const handlePageLoad = async () => {
            try {
                // First get ingredients
                const response = await fetch('../../api/recipes?uid=' + uid, {method: 'GET'});

                if (!response.ok) {
                    throw new Error('Failed to GET');
                }

                var fetched = await response.json();
                var fetchedIngredients = fetched.ingredients;
                var selectOptionsList: any[] = [];

                if (fetchedIngredients.length > 0) {
                    const items: RecipeIngredient[] = fetchedIngredients.map((item: any) => ({
                        ingredient_name: item.ingredient_name,
                        amount: item.amount,
                        amount_type: item.amount_type,
                    }));

                    setIngredients(items);

                    // Add as Select form options
                    items.forEach(ingredient => {
                        selectOptionsList.push({ value: ingredient.ingredient_name, label: ingredient.ingredient_name });
                    });
                    setSelectOptions(selectOptionsList);
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
        const grow = () => {
            setModalHeight(modalHeight => modalHeight + 50);
        }
    
        const shrink = () => {
            setModalHeight(modalHeight => modalHeight - 50);
        }
    
        const updateSize = () => {
            setCount(count => selected.length);
        }
        
        if (selected) {
            const selectedIngredients: RecipeIngredient[] = selected.map((selection: any) => ({
                ingredient_name: selection.label,
                amount: "",
                amount_type: "",
            }));
            setIngredients(selectedIngredients);
        }
        
        // If item is added, increase size of modal
        if (selected.length > count) {
            grow();
        }
        // Otherwise shrink
        else if (selected.length < count) {
            shrink();
        }
        updateSize();
    }, [selected])

    async function handleCreate() {
        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            const response = await fetch(`../../api/recipes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, recipe_ingredients: details, instruction: instructions, last_modified: formattedDate, favorite: favorite, uid: uid })
            });

            if (!response.ok) {
                throw new Error('Failed to POST')
            }

        } catch (error) {
            console.error('Error with POST', error)
        }

    }

    return (
        <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleCreate} className="font-dm_sans" style={{ height: modalHeight }}>
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
                        isClearable={false}
                        styles={{
                            option: defaultStyles => ({
                                ...defaultStyles,
                                color: "black"
                            }),
                            // clearIndicator: defaultStyles => ({
                            //     ...defaultStyles,
                            //     color: "#94a3b8",
                            //     borderColor: "rgb(14 165 233)",
                            //     ":hover": {
                            //         color: "#020617",
                            //         cursor: "pointer"
                            //     }
                            // }),
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
                        
                        { ingredients.map((ingredient, index) => (
                                <div className="flex justify-between" key={index}>
                                    { details.length != 0 ? (
                                    <input value={ingredient.ingredient_name}
                                        required
                                        readOnly
                                        className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-6/12 py-2 px-4 text-slate-400 leading-tight focus:outline-none"
                                        type="text"
                                        placeholder="Choose your first ingredient"/>
                                    ) : ( <p></p>)}
                                    <div className='w-3/12 flex justify-between gap-2'>
                                        { details.length != 0 ? (
                                            <input value={details[index]?.amount}
                                            required
                                            className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-3/5 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                                            type="text"
                                            placeholder="Amount"
                                            onChange={(e) => handleAmountChange(e, index)} />
                                        ) : ( <p></p>)}
                                        { details.length != 0 ? (
                                        <select value={details[index]?.amount_type}
                                            required
                                            className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-2/5 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                                            onChange={(e) => handleAmountTypeChange(e, index)}>
                                            <option value="" disabled hidden>Unit</option>
                                            <option value="g">g</option>
                                            <option value="kg">kg</option>
                                            <option value="ml">mL</option>
                                            <option value="litre">L</option>
                                            <option value="lb">lb</option>
                                            <option value="oz">oz</option>
                                            <option value="gal">gal</option>
                                            <option value="qt">qt</option>
                                            <option value="pt">pt</option>
                                            <option value="cup">cup</option>
                                            <option value="tbsp">tbsp</option>
                                            <option value="tsp">tsp</option>
                                            <option value="fl oz">fl oz</option>
                                            <option value="count">Count</option>
                                            <option value="pinch">Pinch</option>
                                            <option value="serving">Serving</option>
                                        </select>
                                        ) : ( <p></p>)}
                                    </div>
                                </div>
                            // <Details key={index} ingredient_name={ingredient.ingredient_name} amount={amount[index]} amountType={amountType[index]}
                            // handleInputChange={(event) => handleInputChange(event, index)}/>
                        ))}
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