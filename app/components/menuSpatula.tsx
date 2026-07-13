"use client";

import { useEffect, useState } from "react";
import { fonts } from "../actions/fonts";
import { getRecipeById } from "../actions/recipesDb";
import { useBookmarks } from "../actions/useBookmarks"; 
import RecipeCard from "./recipeCard";

interface Recipe {
  id: string;
  name: string;
  steps: string;
  ingredients: string;
}

export default function MenuSpatula() {
  const topRecipes = [
    '2bafe6b2-fedf-47dd-9562-fdf278fbea84', 
    'b8558334-39e5-4837-809a-894c6dd03643', 
    'd3e734a7-3eb5-47d0-88c7-4ed363a50e7b'
  ];
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setselectedRecipe] = useState<Recipe | null>(null);
  const { bookmarkIds, toggleBookmark } = useBookmarks();

  useEffect(() => {
    async function loadPageData() {
      try {
        const recetasObtenidas = await Promise.all(
          topRecipes.map((id) => getRecipeById(id))
        );

        if (recetasObtenidas) {
          setRecipes(recetasObtenidas.flat().filter(Boolean) as Recipe[]);
        }
      } catch (error) {
        console.error("Error cargando las recetas estáticas:", error);
      }
    }

    loadPageData();
  }, []);

  return (
    <section>
      <div className="max-w-xl text-center space-y-8 mx-auto p-4">
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-red-900 font-serif">
          Let's <span className={`font-serif italic duration-500 transform ${fonts()}`}>cook</span> it.
        </h1>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block">
          -- trending: summer '26 --
        </span>

        {selectedRecipe && (
          <p className="text-sm text-green-700 bg-green-100 p-2 rounded-lg inline-block">
            Receta seleccionada: <strong>{selectedRecipe.name}</strong>
          </p>
        )}

        <div className="space-y-4 mt-6">
          {recipes && recipes.map((recipe) => {
            const isBookmarked = bookmarkIds.includes(recipe.id);
            return (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isBookmarked={isBookmarked} 
                onSelect={(r) => setselectedRecipe(r)} 
                onBookmarkToggle={(r) => toggleBookmark(r)} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}