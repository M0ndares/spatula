"use client";

import { useState, useEffect } from 'react';
import { infoRecipe } from '../actions/info';
import { currentUser } from '../actions/userDb';
import { getBookmarksByUserId, createBookmark, deleteBookmark } from '../actions/bookmarksDb';
import type { User } from "@supabase/supabase-js";
import { getRecipeByName } from '../actions/recipesDb';

interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  steps: string;
}

export default function InfoRecipe({ ingredients, name, id, steps }: Recipe) {
  // Ajustamos el tipo para que acepte null si no hay datos o está cargando
  const [recipeInfo, setRecipeInfo] = useState<Recipe | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkUserAndBookmarks() {
      try {
        const { success, user } = await currentUser();
        if (success && user) {
          setUser(user);
          const userBookmarks = await getBookmarksByUserId(user.id);
          if (userBookmarks && Array.isArray(userBookmarks)) {
            const exists = userBookmarks.some((b: any) => b.id === id);
            setIsBookmarked(exists);
          }
        }
      } catch (err) {
        console.error("Error validando usuario en InfoRecipe:", err);
      }
    }
    checkUserAndBookmarks();
  }, [id]);

  useEffect(() => {
    const lookForRecipes = async () => {
      if (!ingredients || ingredients === 'No ingredients identified') {
        setRecipeInfo(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const exists = await getRecipeByName(name);
        
        if (exists.length === 0) {
          const resultadoRecetas = await infoRecipe(name, ingredients);
          const toSplit = resultadoRecetas?.split('&&')
          if (toSplit && resultadoRecetas) {
            const receta: Recipe = {
              id: id || name, 
              name: name,
              ingredients: toSplit[1],
              steps: toSplit[0],
            };

            setRecipeInfo(receta);
          }
        } else {
          setRecipeInfo(exists[0]);
        }
      } catch (err) {
        console.error("Error creating recipes:", err);
        setRecipeInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    lookForRecipes();
  }, [ingredients, name, id]);

  async function toggleBookmark() {
    if (!user || !id) return;

    if (isBookmarked) {
      setIsBookmarked(false);
      await deleteBookmark(user.id, id);
    } else {
      setIsBookmarked(true);
      await createBookmark(user.id, id);
    }
  }

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
              onClick={toggleBookmark}
              className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-sm border border-red-100 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
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