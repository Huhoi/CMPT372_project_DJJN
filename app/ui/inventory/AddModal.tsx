'use client'
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { AmountType } from "@/app/utils/interfaces";

interface AddModalProps {
    cid: number;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

// modal for adding a new category using Modal component
const AddModal: React.FC<AddModalProps> = ({ cid , isOpen , onClose, onOpen}) => {
    const [ingredientName, setIngredientName] = useState<string>('' as string);
    const [expiration, setExpiration] = useState<Date | null>(null as Date | null);
    const [amount, setAmount] = useState<number | null>(null);
    const [amountType, setAmountType] = useState<AmountType>(AmountType.GRAM);

    const openModal = () => onOpen();
    const closeModal = () => onClose();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('../../api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredient_name: ingredientName, expiration: expiration, amount: amount, amount_type: amountType, cid: cid }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message === 'Ingredient successfully added') {
                    closeModal();
                    setIngredientName('');
                    setAmount(0);
                }
            }
            else {
                const res = await response.json();
                console.error("Error adding ingredient: ", res.error);
            }
        }
        catch (error) {
            console.error("Error adding ingredient: ", error);
        }
    };

    return (
        <>
            <button className="py-1 px-2 mt-1 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center" onClick={openModal}>
                Add Ingredient
            </button>
            <Modal modalTitle="Add Ingredient" isOpen={isOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="font-dm_sans h-[580px]">
                    <div id="nameInput" className="py-2">
                        <p className="py-2 text-2xl">Ingredient Name</p>
                        <input
                            type="text"
                            id="ingredient"
                            autoComplete="off"
                            value={ingredientName}
                            className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                            required
                            placeholder="Enter Ingredient Name"
                            onChange={(e) => setIngredientName(e.target.value)}
                        />
                    </div>

                    <div id="expirationInput" className="py-2">
                        <p className="py-2 text-2xl">Expiration Date</p>
                        <input
                            type="date"
                            id="expiration"
                            required
                            onChange={(e) => setExpiration(new Date(e.target.value))}
                            className="resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded w-1/4 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        /> 
                    </div>

                    
                    <div id="amountInput" className="py-2">
                        <p className="py-2 text-2xl">Amount</p>
                        <input
                            type="number"
                            id="amount"
                            required
                            autoComplete="off"
                            className="resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                            onChange={(e) => setAmount(e.target.valueAsNumber)}
                            placeholder="Enter Amount"
                            />
                        <select 
                            name="amountType" 
                            id="amountType" 
                            value={amountType} 
                            onChange={(e) => setAmountType(e.target.value as AmountType)}
                            className="resize-none bg-slate-200 appearance-none border-2 border-slate-300 rounded py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400">
                                {Object.values(AmountType).map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                        </select>
                    </div>

                    <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                        <button type="button" onClick={closeModal} className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 rounded-md flex justify-center items-center">Close</button>
                        <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AddModal;