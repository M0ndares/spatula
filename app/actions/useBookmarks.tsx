"use client";

import { useState, useEffect } from "react";
import { getBookmarksByUserId, deleteBookmark, createBookmark } from "./bookmarksDb";
import { currentUser } from "./userDb";
import type { User } from "@supabase/supabase-js";
import { isSupabaseUser } from "../components/profileSection";
import { getRecipeByName, registerRecipe } from "./recipesDb";
import { infoRecipe } from "./info";
import { RecipesTemplate } from "../page";

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  async function toggleBookmark(recipe: RecipesTemplate) {
    if (!user) return;
    const isCurrentlyBookmarked = bookmarkIds.includes(recipe.id);
    const previousBookmarkIds = [...bookmarkIds];

    if (isCurrentlyBookmarked) {
      setBookmarkIds((prev) => prev.filter((id) => id !== recipe.id));
    } else {
      setBookmarkIds((prev) => [...prev, recipe.id]);
    }

    try {
      let dbRecipe: RecipesTemplate = recipe; 
      const isRecipe = await getRecipeByName(recipe.name);
      
      if (isRecipe.length === 0) {
        const {ingredientsOutput, stepsOutput} = await infoRecipe(recipe.name, recipe.ingredients);
        if (ingredientsOutput && stepsOutput) {
          recipe.steps = stepsOutput;
          recipe.ingredients = ingredientsOutput;
        }
        
        const { success, returnRecipe} = await registerRecipe(recipe.steps, recipe.name, recipe.ingredients);
        
        if (success && returnRecipe) {
          dbRecipe = returnRecipe;
        }
      } else {
        dbRecipe = isRecipe[0];
      }
      if (isCurrentlyBookmarked) {
        await deleteBookmark(user.id, dbRecipe?.id);
      } else {
        await createBookmark(user.id, dbRecipe?.id);
      }

    } catch (error) {
      console.error("Failed to sync bookmark. Reverting UI:", error);
      setBookmarkIds(previousBookmarkIds);
    }
  }

  useEffect(() => {
    async function loadUserAndBookmarks() {
      try {
        const userResponse = await currentUser();

        if (userResponse && userResponse.success && userResponse.user) {
          const loggedUser = userResponse.user;
          if (!isSupabaseUser(loggedUser)) return;
          setUser(loggedUser);

          const userBookmarks = await getBookmarksByUserId(loggedUser.id);
          if (userBookmarks && Array.isArray(userBookmarks)) {
            const ids = userBookmarks.map((b: any) => b.id);
            setBookmarkIds(ids);
          }
        } else {
          setUser(null);
          setBookmarkIds([]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    loadUserAndBookmarks();
  }, []);

  return { bookmarkIds, toggleBookmark, user };
}