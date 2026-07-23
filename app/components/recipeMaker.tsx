"use client";

import { useState, useEffect } from 'react';
import { createRecipes } from '../actions/recipe'; 
import { useBookmarks } from '../actions/useBookmarks'; 
import RecipeCard from './recipeCard'; 
import { getRecipeByName } from '../actions/recipesDb';
import { RecipesTemplate } from '../page';

interface RecipeMakerProps {
  ingredients: string; 
  onSelectRecipe: (receta: RecipesTemplate) => void; 
  existingRecipes?: RecipesTemplate[] | null;
  onCreateRecipe: (recipes: RecipesTemplate[]) => void;
}

export default function RecipeMaker({ 
  ingredients, 
  onSelectRecipe, 
  existingRecipes = null, 
  onCreateRecipe 
}: RecipeMakerProps) {
  const { bookmarkIds, toggleBookmark } = useBookmarks();
  const [localRecipes, setLocalRecipes] = useState<RecipesTemplate[]>(existingRecipes || []);
  const [statusMessage, setStatusMessage] = useState<string>(
    existingRecipes && existingRecipes.length > 0 ? "" : "Generating delicious recipes for you..."
  );
  
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
          const lineasRecetas = resultadoRecetas.split(',');

          const listaProcesada = await Promise.all(
            lineasRecetas.map(async (receta, index) => {
              const recetaLimpia = receta.trim();
              if (!recetaLimpia) return null;

              const nombreReceta = recetaLimpia.split('\n')[0] || `Recipe ${index + 1}`;
              const exists = await getRecipeByName(nombreReceta);
              const idReal = (exists && exists.length > 0) ? exists[0].id : nombreReceta;

              return {
                id: idReal, 
                name: nombreReceta,
                ingredients: ingredients,
                steps: 'null' 
              };
            })
          );

          const listaSincronizada = listaProcesada.filter((r): r is RecipesTemplate => r !== null);

          setLocalRecipes(listaSincronizada);
          onCreateRecipe(listaSincronizada);
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
    
  }, [ingredients]); 

  useEffect(() => {
    const syncRecipeIds = async () => {
      const hasTemporaryIds = localRecipes.some(r => r.id === r.name);
      if (!hasTemporaryIds) return; // Cortamos ejecución si no es necesario

      let needsUpdate = false;
      const updatedRecipes = await Promise.all(
        localRecipes.map(async (recipe) => {
          if (recipe.id === recipe.name) {
            const exists = await getRecipeByName(recipe.name);
            if (exists && exists.length > 0) {
              needsUpdate = true;
              return { ...recipe, id: exists[0].id }; // Intercambiamos por el UUID real
            }
          }
          return recipe; 
        })
      );

      if (needsUpdate) {
        setLocalRecipes(updatedRecipes);
      }
    };

    if (localRecipes.length > 0) {
      syncRecipeIds();
    }
  }, [bookmarkIds, localRecipes]); 

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
                onSelect={onSelectRecipe} 
                onBookmarkToggle={toggleBookmark} 
              />
            );
          })
        ) : (
          <p className="text-gray-500 italic text-center py-4 animate-pulse">{statusMessage}</p>
        )}
      </div>
    </div>
  );
}