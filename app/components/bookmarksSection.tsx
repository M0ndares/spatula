"use client";

import { useEffect, useState } from "react";
import { fonts } from "../actions/fonts";
import { getRecipeById } from "../actions/recipesDb";
import { useBookmarks } from "../actions/useBookmarks"; 
import RecipeCard from "./recipeCard"; 
import { RecipesTemplate } from "../page";
import Link from "next/link";

interface BookmarksSectionProps {
  onSelectRecipe: (receta: RecipesTemplate) => void;
}

export default function BookmarksSection({ onSelectRecipe }: BookmarksSectionProps) {
  const [currentBookmarks, setCurrentBookmarks] = useState<RecipesTemplate[]>([]);
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
          setCurrentBookmarks(recetascompletas.flat().filter(Boolean) as RecipesTemplate[]);
        }
      } catch (error) {
        console.error("Error syncing bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    updateDetailedRecipes();
  }, [bookmarkIds]);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className={`font-serif italic duration-500 transform text-5xl sm:text-6xl text-center ${fonts()}`}>
        bookmarks
      </h1>
      <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block mt-6 text-center">
          𐂐𓇋  save your favorite recipes  
        </span>
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
                <Link
                  key={recipe.id} 
                  href={`/recipes/${recipe.id}`} 
                  className="block">
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    isBookmarked={isBookmarked} 
                    onSelect={() => onSelectRecipe(recipe)} 
                    onBookmarkToggle={(r) => toggleBookmark(r as RecipesTemplate)} 
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}