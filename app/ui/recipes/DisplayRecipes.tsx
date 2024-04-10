'use client'

import React, { useEffect, useState } from 'react'
import RecipeCard from './RecipeCard';
import { RecipeIngredient } from '@/app/utils/interfaces';
import { useTestContext } from '@/app/protected/layout';

export interface Recipe {
  rid: number;
  title: string;
  instruction: string;
  ingredients: RecipeIngredient[];
  last_modified: Date;
  favorite: boolean;
  uid: number;
}

function DisplayRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState<RecipeIngredient[]>([]);
  const uid = useTestContext();

  useEffect(() => {
    const handlePageLoad = async (uid: number) => {
      try {
        const response = await fetch('../../api/recipes?uid=' + uid, {method: 'GET'});

        if (!response.ok) {
          throw new Error('Failed to GET');
        }

        var fetched = await response.json();
        var fetchedRecipeIngredients = fetched.recipe_ingredients;
        var fetchedRecipes = fetched.recipes;

        setAllIngredients(fetchedRecipeIngredients);

        const recipesWithIngredients: Recipe[] = fetchedRecipes.map((recipe: any) => {
          const recipeIngredients: RecipeIngredient[] = fetchedRecipeIngredients
            .filter((ingredient: any) => ingredient.rid === recipe.rid)
            .map((ingredient: any) => ({
              rid: ingredient.rid,
              ingredient_name: ingredient.ingredient_name,
              amount: ingredient.amount,
              amount_type: ingredient.amount_type,
            }));

          return {
            rid: recipe.rid,
            title: recipe.recipe_name,
            instruction: recipe.instruction,
            ingredients: recipeIngredients,
            last_modified: recipe.last_modified,
            favorite: recipe.favorite,
            uid: recipe.uid,
          };
        });

        console.log(recipesWithIngredients)
        setRecipes(recipesWithIngredients)

      } catch (error) {
        console.error('Error with retrieving: ', error);
      } 
    }

    handlePageLoad(uid);
  }, []);

  return (
    <div className="pt-6 grid grid-cols-3 gap-4 h-full w-full">
      { recipes.map((recipe, index) => (
        <RecipeCard key={index} rid={recipe.rid} title_prop={recipe.title} ingredients_prop={recipe.ingredients} instruction_prop={recipe.instruction} last_modified_prop={recipe.last_modified} favorite_prop={recipe.favorite} allIngredients={allIngredients}></RecipeCard>
      ))}
    </div>
  )
}

export default DisplayRecipes