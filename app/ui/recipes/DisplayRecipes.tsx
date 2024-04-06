'use client'

import React, { useEffect, useState } from 'react'
import RecipeCard from './RecipeCard';

export interface Recipe {
  rid: number;
  title: string;
  instruction: string;
  last_modified: Date;
  favorite: boolean;
  uid: number;
}

function DisplayRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const handlePageLoad = async () => {
      try {
        const response = await fetch(`../../api/recipes`);

        if (!response.ok) {
          throw new Error('Failed to GET');
        }

        var fetched = await response.json();
        fetched = fetched.recipes;
        console.log(fetched);
        const items: Recipe[] = fetched.map((item: any) => ({
          rid: item.rid,
          title: item.recipe_name,
          instruction: item.instruction,
          last_modified: item.last_modified,
          favorite: item.favorite,
          uid: item.uid,
        }))
        setRecipes(items);

      } catch (error) {
        console.error('Error with retrieving: ', error);
      } 
    }

    handlePageLoad();
  }, []);

  return (
    <div className="pt-6 grid grid-cols-3 gap-4 h-full w-full">
      { recipes.map((recipe, index) => (
        <RecipeCard key={index} rid={recipe.rid} title={recipe.title} instruction={recipe.instruction} last_modified={recipe.last_modified} favorite={recipe.favorite} uid={recipe.uid}></RecipeCard>
      ))}
    </div>
  )
}

export default DisplayRecipes