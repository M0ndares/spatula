"use client";
import { useState, useEffect } from 'react';
import { createRecipes } from '../actions/recipe'; 

interface RecipeMakerProps {
  ingredients: string; 
  onSelectRecipe: (receta: string) => void; 
}

export default function RecipeMaker({ ingredients, onSelectRecipe }: RecipeMakerProps) {
  const [recipe, setRecipe] = useState<string>("Generating delicious recipes for you...");

  useEffect(() => {
    const lookForRecipes = async () => {
      if (!ingredients || ingredients === 'No ingredients identified') {
        setRecipe("No valid ingredients found to generate a recipe.");
        return;
      }
      try {
        const resultadoRecetas = await createRecipes(ingredients);
        if (resultadoRecetas) setRecipe(resultadoRecetas);
        else setRecipe("Could not generate recipes. Try again later.");
      } catch (err) {
        console.error("Error creating recipes:", err);
        setRecipe("An error occurred while fetching your recipes.");
      }
    };
    lookForRecipes();
  }, [ingredients]); 

  return (
    <div className="w-full flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-white p-5 rounded-2xl shadow-md border border-gray-100">
  <h2 className="text-2xl text-red-600 font-extrabold mb-2 border-b-2 border-red-100 pb-3 flex items-center gap-2">
     Ideal Recipes
  </h2>
  
  <div className="flex flex-col gap-3 mb-2">
    {recipe && recipe.trim() !== "" ? (
      recipe.split(',').map((receta, index) => {
        const recetaLimpia = receta.trim();
        if (!recetaLimpia) return null;

        return (
          <div 
            key={index} 
            onClick={() => onSelectRecipe(recetaLimpia)} 
            className="p-4 bg-white rounded-xl border border-gray-200 text-left cursor-pointer 
                       shadow-sm hover:shadow-md hover:border-red-300 hover:bg-red-50/50 
                       transition-all duration-200 transform hover:-translate-y-0.5 group"
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800 text-base group-hover:text-red-700 transition-colors">
                {recetaLimpia.split('\n')[0] || `Recipe ${index + 1}`}
              </p>
              <span className="text-gray-400 group-hover:text-red-500 font-bold transition-colors text-sm">
                →
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Tap to see full instructions</p>
          </div>
          );
          })
          ) : (
          <p className="text-gray-400 italic text-center py-4">No recipes text available</p>
          )}
            </div>
          </div>
  );
}