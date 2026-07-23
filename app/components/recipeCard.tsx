"use client";
import { useState } from "react";
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
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSelect = async () => {
    if (isGenerating) return; 
    
    setIsGenerating(true);
    try {
      const exists = await getRecipeByName(recipe.name);
      
      if (exists && exists.length > 0) {
        onSelect(exists[0]); 
      } else {
        const { stepsOutput, ingredientsOutput } = await infoRecipe(recipe.name, recipe.ingredients);
        
        if (!stepsOutput || !ingredientsOutput) return;
        
        const { success, returnRecipe } = await registerRecipe(stepsOutput, recipe.name, ingredientsOutput);
        
        if (success && returnRecipe) {
          const finalRecipe = Array.isArray(returnRecipe) ? returnRecipe[0] : returnRecipe;
          onSelect(finalRecipe);
        }
      }
    } catch (error) {
      console.error("Error al seleccionar receta:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div
      onClick={handleSelect}
      className={`p-4 m-2 px-5 rounded-xl border text-left transition-all duration-200 group relative
        ${isGenerating 
          ? "bg-red-950/40 border-red-900 cursor-wait opacity-80" // Estilos de cargando
          : "bg-red-950/20 border-red-950/40 cursor-pointer shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212] hover:-translate-y-0.5"
        }`}
    >
      <div className="flex justify-between items-center">
        <p className={`font-bold text-base transition-colors ${isGenerating ? "text-white" : "text-red-950 group-hover:text-white"}`}>
          {recipe.name}
        </p>
        
        {/* Ocultamos el bookmark si se está generando para evitar errores */}
        {!isGenerating && (
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
        )}
      </div>
      
      <p className={`text-xs mt-1 ${isGenerating ? "text-red-300 animate-pulse" : "text-red-950 group-hover:text-white"}`}>
        {isGenerating ? "Cooking instructions..." : "Tap to see full instructions"}
      </p>
    </div>
  );
}