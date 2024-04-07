'use client'

import React, { useEffect, useState } from 'react'
import CommunityCard from './CommunityCard';

export interface Community {
    id: number;
    title: string;
    image: string;
    imageType: string;

}

function DisplayCommunity() {
    const [recipes, setRecipes] = useState<Community[]>([]);

    // Load recipes from localStorage on component mount
    useEffect(() => {
        const storedData = localStorage.getItem('recipeData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setRecipes(parsedData.results);
        }
    }, []);


    return (
        <div className="pt-6 grid grid-cols-3 gap-4 h-full w-full">
            {recipes.map((recipe, index) => (
                <CommunityCard key={index} id={recipe.id} title={recipe.title} image={recipe.image} imageType={recipe.imageType}></CommunityCard>
            ))}
        </div>
    )
}

export default DisplayCommunity