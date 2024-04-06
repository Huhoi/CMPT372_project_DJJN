import React, { useState } from 'react'
import Modal, { ModalProps } from '../Modal'
import CreatableSelect from 'react-select/creatable'
import { Category } from './CategoryModal';
import moment from 'moment';

const IngredientModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category[]>([]);
    const [expiration, setExpiration] = useState("");
    const [amount, setAmount] = useState("");

    const [selected, setSelected] = useState<any[]>([])
    const [selectOptions, setSelectOptions] = useState<any[]>([]);

    // The values from a multi-change input returns an object-- use 
    // this function to handle the values 
    function handleMultiChange(values: any) {
        setSelected(values);
    }

    const handleDateChange = (e: { target: { value: string | number | Date; }; }) => {
        const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD');
        setExpiration(newDate);
        console.log("expiration date: ", newDate);
      };

    function reset() {

    }

    return (
        <>
            <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
                <form className="font-dm_sans h-[580px]">
                    <div id="nameInput" className="py-2">
                        <p className="py-2 text-2xl">Ingredient name</p>
                        <input value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                            type="text"
                            placeholder="Enter name" />
                    </div>

                    <div id="amountInput" className="py-2">
                        <p className="py-2 text-2xl">Amount</p>
                        <textarea value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="min-h-[100px] resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                            placeholder="Enter amount"></textarea>
                    </div>

                    <div id="categoryInput" className="py-2">
                        <p className="py-2 text-2xl">Category</p>
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

                    <div id="expirationInput" className="py-2">
                        <p className="py-2 text-2xl">Expiration date</p>
                        <input type="date"
                            value={expiration}
                            onChange={handleDateChange}
                            required
                            className="resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded w-1/4 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"/>
                    </div>

                    <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                        <button type="reset" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-500 border-2 border-indigo-400 hover:border-indigo-500 rounded-md flex justify-center items-center" onClick={reset}>Reset</button>
                        <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 col-start-4 col-end-4 rounded-md flex justify-center items-center" onClick={onClose}>Cancel</button>
                        <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center">Save</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default IngredientModal