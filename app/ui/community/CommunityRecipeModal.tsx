'use client'

import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from '../Modal'
import { useTestContext } from '@/app/protected/layout'

const CommunityRecipeModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [query, setQuery] = useState("");
    const [data, setData] = useState<any[]>([])

    const uid = useTestContext()

    function reset() {
        setQuery("");
    }

    // Move this to recipe page afterwards
    //Remember to test that it only request 1 per submission capped at 150
    const handleFetch = async () => {
        const apiQuery = query;
        const apiKey = "66a1a479f6384fcf8319c6a701e0637b"

        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${apiQuery}&apiKey=${apiKey}&number=18`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
                console.log(responseData);
                // Store data in sessionStorage
                localStorage.setItem('recipeData', JSON.stringify(responseData));
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }


    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleFetch();
        setTimeout(() => {
            window.location.reload(); // Reload the page after a delay
        }, 1000);
    }


    return (
        <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="font-dm_sans h-[550px]">
                <div id="titleInput" className="py-2">
                    <p className="py-2 text-2xl">Recipe or Ingredient</p>
                    <input value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                        className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                        type="text"
                        placeholder="Enter Recipe or Ingredient" />
                </div>


                <div id="buttonContainer" className="absolute px-4 bottom-0 left-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                    <button type="reset" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-500 border-2 border-indigo-400 hover:border-indigo-500 rounded-md flex justify-center items-center" onClick={reset}>Reset</button>
                    <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 col-start-4 col-end-4 rounded-md flex justify-center items-center" onClick={onClose}>Cancel</button>
                    <button type="submit" className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center" onClick={onClose}>Send</button>
                </div>
            </form>
        </Modal>
    )
}

export default CommunityRecipeModal