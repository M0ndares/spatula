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
      <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
        <span className="font-serif italic duration-500 transform">Bookmarks</span>
      </h1>
      <br />
      
      {isLoading ? (
        <p className="text-center text-gray-400 text-sm mt-5 animate-pulse">Loading saved recipes...</p>
      ) : currentBookmarks.length === 0 ? (
        <p className="text-center text-gray-400 text-sm mt-5">No bookmarks available.</p>
      ) : (
        <div className="space-y-4 mt-6">
          {currentBookmarks.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isBookmarked={true} 
              onSelect={(r) => onSelectRecipe(r as Recipes)} 
              onBookmarkToggle={(r) => toggleBookmark(r as Recipes)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}