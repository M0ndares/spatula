"use client";
import { useState, useEffect } from 'react';
import { infoRecipe } from '../actions/info';
import { currentUser } from '../actions/userDb';
import { getBookmarksByUserId, createBookmark, deleteBookmark } from '../actions/bookmarksDb';
import type { User } from "@supabase/supabase-js";

interface InfoRecipeProps {
  ingredients: string; 
  currentRecipe: string; 
  recipeId: string;      
}

export default function InfoRecipe({ ingredients, currentRecipe, recipeId } : InfoRecipeProps) {
  const [recipeInfo, setRecipeInfo] = useState<string>("Generating delicious recipes for you...");
  const [user, setUser] = useState<User | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    async function checkUserAndBookmarks() {
      try {
        const {success, user} = await currentUser();
        if (success && user) {
          setUser(user);
          const userBookmarks = await getBookmarksByUserId(user.id);
          if (userBookmarks && Array.isArray(userBookmarks)) {
            // Verificamos si la receta actual está en sus marcadores
            const exists = userBookmarks.some((b: any) => b.id === recipeId);
            setIsBookmarked(exists);
          }
        }
      } catch (err) {
        console.error("Error validando usuario en InfoRecipe:", err);
      }
    }
    checkUserAndBookmarks();
  }, [recipeId]); 

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
  }, [ingredients, currentRecipe]); 

  // 3. Manejador para el botón de favorito (Estado optimista)
  async function toggleBookmark() {
    if (!user || !recipeId) return;

    if (isBookmarked) {
      setIsBookmarked(false); // Cambia en la UI al instante
      await deleteBookmark(user.id, recipeId);
    } else {
      setIsBookmarked(true);  // Cambia en la UI al instante
      await createBookmark(user.id, recipeId);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {recipeInfo && (
        <div className="bg-red-950/20 p-6 rounded-lg shadow-sm border text-red-950 w-full prose relative group">
          
          {user && (
            <button 
              onClick={toggleBookmark}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-950/10 transition-colors duration-200"
              title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
            >
              <span className={`material-symbols-outlined select-none text-2xl ${
                isBookmarked ? "text-red-600 fill-current" : "text-red-950 hover:text-red-700"
              }`}>
                {isBookmarked ? "bookmark_added" : "bookmark"}
              </span>
            </button>
          )}

          <h2 className="text-2xl text-red-900 font-bold mb-4 border-b pb-2 pr-12">{currentRecipe}</h2>
          <p className="whitespace-pre-line text-base leading-relaxed">{recipeInfo}</p>
        </div>
      )}
    </div>
  );
}