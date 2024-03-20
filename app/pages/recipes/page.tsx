import AddButton from "@/app/ui/recipes/AddButton";
import DisplayRecipes from "@/app/ui/recipes/DisplayRecipes";

export default function RecipePage() {
  const recipes = [];
  
  return (
    <>
      <AddButton />
      <DisplayRecipes />
    </>
  )
}