"use client";

import { useState, useEffect } from 'react';
import { createRecipes } from '../actions/recipe'; 
import { useBookmarks } from '../actions/useBookmarks'; 
import RecipeCard from './recipeCard'; 

interface Recipes {
  id: string;
  name: string;
  ingredients: string;
  steps: string;
}

interface RecipeMakerProps {
  ingredients: string; 
  onSelectRecipe: (receta: Recipes) => void; 
  existingRecipes?: Recipes[] | null;
  onCreateRecipe: (recipes: Recipes[]) => void;
}

export default function RecipeMaker({ 
  ingredients, 
  onSelectRecipe, 
  existingRecipes = null, 
  onCreateRecipe 
}: RecipeMakerProps) {
  const [localRecipes, setLocalRecipes] = useState<Recipes[]>(existingRecipes || []);
  const [statusMessage, setStatusMessage] = useState<string>(
    existingRecipes && existingRecipes.length > 0 ? "" : "Generating delicious recipes for you..."
  );
  const { bookmarkIds, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (localRecipes.length > 0) return;

    const lookForRecipes = async () => {
      if (!ingredients || ingredients === 'No ingredients identified.') {
        setStatusMessage("No valid ingredients found to generate a recipe.");
        return;
      }

      try {
        const resultadoRecetas = await createRecipes(ingredients);
        
        if (resultadoRecetas && resultadoRecetas.trim() !== "") {
          const listaProcesada = resultadoRecetas
            .split(',')
            .map((receta, index) => {
              const recetaLimpia = receta.trim();
              if (!recetaLimpia) return null;

              const nombreReceta = recetaLimpia.split('\n')[0] || `Recipe ${index + 1}`;

              return {
                id: nombreReceta, 
                name: nombreReceta,
                ingredients: ingredients,
                steps: 'null' 
              };
            })
            .filter((r): r is Recipes => r !== null); 

          setLocalRecipes(listaProcesada);
          onCreateRecipe(listaProcesada);
          setStatusMessage(""); 
        } else {
          setStatusMessage("Could not generate recipes. Try again later.");
        }
      } catch (err) {
        console.error("Error creating recipes:", err);
        setStatusMessage("An error occurred while fetching your recipes.");
      }
    };

    lookForRecipes();
  }, [ingredients, localRecipes.length, onCreateRecipe]); 

  return (
    <div className="w-full flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl text-red-900 font-extrabold mb-2 border-b-2 border-red-100 pb-3 flex items-center gap-2">
        Ideal Recipes
      </h2>
      
      <div className="flex flex-col gap-3 mb-2">
        {localRecipes.length > 0 ? (
          localRecipes.map((currentRecipeObject, index) => {
            const isBookmarked = bookmarkIds.includes(currentRecipeObject.id);

            return (
              <RecipeCard 
                key={index}
                recipe={currentRecipeObject}
                isBookmarked={isBookmarked}
                onSelect={(r) => onSelectRecipe(r)}
                onBookmarkToggle={(r) => toggleBookmark(r)} 
              />
            );
          })
        ) : (
          <p className="text-gray-500 italic text-center py-4">{statusMessage}</p>
        )}
      </div>
    </div>
  );
}