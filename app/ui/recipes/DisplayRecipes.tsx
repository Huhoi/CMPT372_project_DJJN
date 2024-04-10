'use client'

import React, { useEffect, useState } from 'react'
import RecipeCard from './RecipeCard';
import { RecipeIngredient } from '@/app/utils/interfaces';
import { useTestContext } from '@/app/protected/layout';

export interface Recipe {
  rid: number;
  title: string;
  instruction: string;
  ingredients: RecipeIngredient;
  last_modified: Date;
  favorite: boolean;
  uid: number;
}

function DisplayRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const uid = useTestContext();

  useEffect(() => {
    const handlePageLoad = async (uid: number) => {
      try {
        const response = await fetch('../../api/recipes?uid=' + uid, {method: 'GET'});

        if (!response.ok) {
          throw new Error('Failed to GET');
        }

        var fetched = await response.json();
        var fetchedRecipes = fetched.recipes;
        const items: Recipe[] = fetchedRecipes.map((item: any) => ({
          rid: item.rid,
          title: item.recipe_name,
          instruction: item.instruction,
          last_modified: item.last_modified,
          favorite: item.favorite,
          uid: item.uid,
        }));
        setRecipes(items);

        if (recipes.length > 0) {
          const rid = recipes[0].rid;
          var fetchedIngredients = fetched.ingredients;
          const recipeIngredients = fetchedIngredients.filter((ingredient: { rid: number; }) => ingredient.rid === rid);
          console.log(recipeIngredients)
        }

      } catch (error) {
        console.error('Error with retrieving: ', error);
      } 
    }

    handlePageLoad(uid);
  }, []);

  return (
    <div className="pt-6 grid grid-cols-3 gap-4 h-full w-full">
      { recipes.map((recipe, index) => (
        <RecipeCard key={index} rid={recipe.rid} title={recipe.title} ingredients={recipe.ingredients} instruction={recipe.instruction} last_modified={recipe.last_modified} favorite={recipe.favorite} uid={recipe.uid}></RecipeCard>
      ))}
    </div>
  )
}

export default DisplayRecipes