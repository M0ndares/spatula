"use client";

import { useEffect, useState } from "react";
import { fonts } from "../actions/fonts";
import { getRecipeById } from "../actions/recipesDb";
import { useBookmarks } from "../actions/useBookmarks"; 
import RecipeCard from "./recipeCard"; 

interface Recipes {
  name: string;
  steps: string;
  id: string;
  ingredients: string;
}

interface BookmarksSectionProps {
  onSelectRecipe: (receta: Recipes) => void;
}

export default function BookmarksSection({ onSelectRecipe }: BookmarksSectionProps) {
  const [currentBookmarks, setCurrentBookmarks] = useState<Recipes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { bookmarkIds, toggleBookmark } = useBookmarks();

  useEffect(() => {
    async function updateDetailedRecipes() {
      if (bookmarkIds.length === 0) {
        setCurrentBookmarks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const recetascompletas = await Promise.all(
          bookmarkIds.map((id) => getRecipeById(id))
        );

        if (recetascompletas) {
          setCurrentBookmarks(recetascompletas.flat().filter(Boolean) as Recipes[]);
        }
      } catch (error) {
        console.error("Error al sincronizar las recetas de los favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    updateDetailedRecipes();
  }, [bookmarkIds]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className={`font-serif italic duration-500 transform text-5xl sm:text-6xl text-center ${fonts()}`}>
        Bookmarks
      </h1>
      
      <div className="mt-8">
        {isLoading ? (
          <p className="text-center text-red-900/60 text-sm animate-pulse">
            Loading your saved culinary secrets...
          </p>
        ) : currentBookmarks.length === 0 ? (
          <div className="text-center py-10 bg-red-50/20 rounded-2xl border border-dashed border-red-200">
            <span className="material-symbols-outlined text-red-900/30 text-4xl block mb-2 select-none">
              bookmark
            </span>
            <p className="text-red-900/60 text-sm font-medium">No bookmarks saved yet.</p>
            <p className="text-gray-400 text-xs mt-1">Start scanning ingredients to save recipes!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentBookmarks.map((recipe) => {
              const isBookmarked = bookmarkIds.includes(recipe.id);
              return (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  isBookmarked={isBookmarked} 
                  onSelect={() => onSelectRecipe(recipe)} 
                  onBookmarkToggle={(r) => toggleBookmark(r as Recipes)} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}