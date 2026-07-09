"use client";
import { useState, useEffect } from 'react';
import { infoRecipe } from '../actions/info';
import { info } from 'console';

interface InfoRecipeProps {
  ingredients: string; 
  currentRecipe: string;
}

export default function InfoRecipe({ ingredients, currentRecipe } : InfoRecipeProps) {
  const [recipeInfo, setRecipeInfo] = useState<string>("Generating delicious recipes for you...") || null;
  
  useEffect(() => {
    const lookForRecipes = async () => {
      if (!ingredients || ingredients === 'No ingredients identified') {
        setRecipeInfo("No valid ingredients found to generate a recipe.");
        return;
      }

      try {
        const resultadoRecetas = await infoRecipe(currentRecipe, ingredients);
        if (resultadoRecetas) {
          setRecipeInfo(resultadoRecetas);
        } else {
          setRecipeInfo("No recipes identified.");
        }
      } catch (err) {
        console.error("Error creating recipes:", err);
        setRecipeInfo("An error occurred while fetching your recipes.");
      }
    };

    lookForRecipes();
  }, [ingredients]); 

  return (
    <div className="w-full flex flex-col gap-4">
      {recipeInfo && (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-red-800 w-full prose">
          <span className="material-symbols-outlined">star</span>
          <h2 className="text-2xl text-red-900 font-bold mb-4 border-b pb-2">{currentRecipe}</h2>
          <p className="whitespace-pre-line text-base leading-relaxed">{recipeInfo}</p>
        </div>
      )}
    </div>
  );
}