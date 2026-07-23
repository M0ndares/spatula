"use client";
import { RecipesTemplate } from "../page";
import { getRecipeByName, registerRecipe } from "../actions/recipesDb";
import { infoRecipe } from "../actions/info";

interface RecipeCardProps {
  recipe: RecipesTemplate;
  isBookmarked: boolean;
  onSelect: (recipe: RecipesTemplate) => void;
  onBookmarkToggle: (recipe: RecipesTemplate) => void;
}

export default function RecipeCard({ 
  recipe, 
  isBookmarked, 
  onSelect, 
  onBookmarkToggle 
  }: RecipeCardProps) {
  
  const handleSelect = async () => {
      const exists = await getRecipeByName(recipe.name);
      if(exists.length > 0) onSelect(recipe)
      else {
        const {stepsOutput, ingredientsOutput} = await infoRecipe(recipe.name, recipe.ingredients)
        if(!stepsOutput || !ingredientsOutput) return
        const {success, returnRecipe} = await registerRecipe(stepsOutput, recipe.name, ingredientsOutput);
        if(success) onSelect(returnRecipe);
        else return 
      }
    }
  
  return (
    <div
      onClick={() => handleSelect()}
      className="p-4 m-2 px-5 bg-red-950/20 rounded-xl border border-red-950/40 text-left cursor-pointer
                 shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                 transition-all duration-200 transform hover:-translate-y-0.5 group"
    >
      <div className="flex justify-between items-center">
        <p className="font-bold text-red-950 text-base group-hover:text-white transition-colors">
          {recipe.name}
        </p>
        
        <span 
          className={`material-symbols-outlined cursor-pointer transition-colors ${
            isBookmarked 
              ? "text-red-950 group-hover:text-white hover:text-red-700" 
              : "text-gray-400 group-hover:text-white hover:text-red-700"
          }`}
          onClick={(e) => {
            e.stopPropagation(); 
            onBookmarkToggle(recipe);
          }}
        >
          {isBookmarked ? "bookmark_added" : "bookmark"}
        </span>
      </div>
      <p className="text-xs text-red-950 mt-1 group-hover:text-white">
        Tap to see full instructions
      </p>
    </div>
  );
}