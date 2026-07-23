"use client";

import { useEffect, useState } from "react";
import { fonts } from "../actions/fonts";
import { getRecipeById } from "../actions/recipesDb";
import { useBookmarks } from "../actions/useBookmarks"; 
import RecipeCard from "./recipeCard";
import { RecipesTemplate } from "../page";

interface MenuSpatulaProps {
  onSelectRecipe: (recipe: RecipesTemplate) => void;
}
export default function MenuSpatula({ onSelectRecipe }: MenuSpatulaProps) {
  const topRecipes = [
    '59840c00-b1cd-4a46-8afe-1843a63f6a94', 
    'd20521c7-436e-4be0-a307-a0e51f9a4b2e', 
    'fae280c8-950e-47eb-9973-a4e6b34b7547'
  ];
  
  const [recipes, setRecipes] = useState<RecipesTemplate[]>([]);
  const { bookmarkIds, toggleBookmark } = useBookmarks();

  useEffect(() => {
    async function loadPageData() {
      try {
        const recetasObtenidas = await Promise.all(
          topRecipes.map((id) => getRecipeById(id))
        );

        if (recetasObtenidas) {
          setRecipes(recetasObtenidas.flat().filter(Boolean) as RecipesTemplate[]);
        }
      } catch (error) {
        console.error("Error cargando las recetas estáticas:", error);
      }
    }

    loadPageData();
  }, []);

  return (
    <section>
      <div className="max-w-xl text-center space-y-8 mx-auto">
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-red-900 font-serif">
          <span className={`font-serif italic duration-500 transform ${fonts()}`}>spatula</span> 
        </h1>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block">
          𐂐𓇋 trending recipes for you 
        </span>

        <div className="space-y-4 mt-6">
          {recipes && recipes.map((recipe) => {
            const isBookmarked = bookmarkIds.includes(recipe.id);
            return (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isBookmarked={isBookmarked} 
                onSelect={() => onSelectRecipe(recipe)} 
                onBookmarkToggle={(r) => toggleBookmark(r as RecipesTemplate)} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}