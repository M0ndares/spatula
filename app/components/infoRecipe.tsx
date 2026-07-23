"use client";

import { useState, useEffect } from 'react';
import { infoRecipe } from '../actions/info';
import { getRecipeByName } from '../actions/recipesDb';
import { useBookmarks } from '../actions/useBookmarks';
import { RecipesTemplate } from '../page';

export default function InfoRecipe({ ingredients, name, id, steps }: RecipesTemplate) {
  const [recipeInfo, setRecipeInfo] = useState<RecipesTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { bookmarkIds, toggleBookmark, user } = useBookmarks();
  const [localIsBookmarked, setLocalIsBookmarked] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchOrGenerateRecipe = async () => {
      setIsLoading(true);
      
      if (steps && steps !== 'null' && steps.trim() !== '') {
        setRecipeInfo({ id, name, ingredients, steps });
        setIsLoading(false);
        return;
      }

      try {
        const exists = await getRecipeByName(name);
        
        if (exists && exists.length > 0) {
          setRecipeInfo(exists[0]);
        } else {
          const {stepsOutput, ingredientsOutput} = await infoRecipe(name, ingredients);
          if (ingredientsOutput && stepsOutput) {
            setRecipeInfo({
              id: id || name,
              name: name,
              ingredients: ingredientsOutput || ingredients,
              steps: stepsOutput || "No steps available.",
            });
          }
        }
      } catch (err) {
        console.error("Error generating recipe details:", err);
        setRecipeInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateRecipe();
  }, [id, name, ingredients, steps]);

  const isBookmarked = localIsBookmarked !== null 
    ? localIsBookmarked 
    : (recipeInfo ? bookmarkIds.includes(recipeInfo.id) : false);

  const handleBookmarkClick = () => {
    if (recipeInfo) {
      setLocalIsBookmarked(!isBookmarked); 
      toggleBookmark(recipeInfo);          
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {isLoading ? (
        <div className="text-center py-8 text-red-900 font-medium animate-pulse">
          Cooking your recipe details...
        </div>
      ) : recipeInfo ? (
        <div className="bg-gradient-to-b from-red-50/50 to-white p-6 md:p-8 rounded-2xl shadow-md border border-red-100/80 text-red-950 w-full relative group transition-all duration-300">
          
          {user && (
            <button
              onClick={handleBookmarkClick}
              className="absolute top-6 right-6 p-2 rounded-full hover:cursor-pointer bg-white shadow-sm border border-red-100 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
              title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
            >
              <span className={`material-symbols-outlined select-none text-2xl flex items-center justify-center ${
                isBookmarked ? "text-red-600 fill-current" : "text-red-900 hover:text-red-700"
              }`}>
                {isBookmarked ? "bookmark_added" : "bookmark"}
              </span>
            </button>
          )}

          <h2 className="text-2xl md:text-3xl text-red-900 font-extrabold mb-6 border-b-2 border-red-100 pb-4 pr-14 leading-tight">
            {recipeInfo.name}
          </h2>

          <div className="mb-6 bg-red-950/[0.02] p-4 rounded-xl border border-red-900/5">
            <h3 className="text-lg text-red-900 font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl select-none">shopping_basket</span>
              Required Ingredients
            </h3>
            <p className="text-red-950/80 text-sm md:text-base leading-relaxed whitespace-pre-line pl-1">
              {recipeInfo.ingredients}
            </p>
          </div>

          <div>
            <h3 className="text-lg text-red-900 font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl select-none">restaurant_menu</span>
              Preparation Steps
            </h3>
            <p className="whitespace-pre-line text-sm md:text-base leading-relaxed text-red-950/90 pl-1">
              {recipeInfo.steps.replaceAll('\\n', '\n')}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-red-900/40 italic bg-red-50/20 rounded-xl border border-dashed border-red-200">
          No recipe information available.
        </div>
      )}
    </div>
  );
}