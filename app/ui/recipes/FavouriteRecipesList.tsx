'use client'
import { useTestContext } from "@/app/protected/layout";
import { get } from "http";
import { useEffect, useState } from "react";

interface RecipeInfo {
    rid: number;
    recipe_name: string;
}

function FavouriteRecipesList() {
    const uid = useTestContext();
    const [recipes, setRecipes] = useState<RecipeInfo[]>([]);
    
    const getFavourites = async () => {
        try {
            const response = await fetch('/api/favourites?uid=' + uid);

            if (response.ok) {
                const data = await response.json();
                console.log(data.recipes)
                setRecipes(data.recipes);
            } else {
                console.error('Failed to fetch favourites:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching favourites:', error);
        }
    };

    useEffect(() => {
        getFavourites();
    }, []);

    return (
        <>
        {recipes.map((recipes) => (
            <ul key={recipes.rid}>
                <li>{recipes.recipe_name}</li>
            </ul>
        ))}
        </>
    )
}

export default FavouriteRecipesList;