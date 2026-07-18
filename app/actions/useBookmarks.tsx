"use client";

import { useState, useEffect } from "react";
import { getBookmarksByUserId, deleteBookmark, createBookmark } from "./bookmarksDb";
import { currentUser } from "./userDb";
import type { User } from "@supabase/supabase-js";
import { isSupabaseUser } from "../components/profileSection";
import { getRecipeByName, registerRecipe } from "./recipesDb";
import { infoRecipe } from "./info";

interface Recipe {
  id: string;
  name: string;
  steps: string;
  ingredients: string;
}

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  async function toggleBookmark(recipe: Recipe) {
    if (!user) return;

    let dbRecipe: Recipe = recipe; 
    const isRecipe = await getRecipeByName(recipe.name);
    
    if (isRecipe.length === 0) {
      const response = await infoRecipe(recipe.name, recipe.ingredients);
      if (response) {
        const toSplit = response.split('&&');
        recipe.steps = toSplit[0].trim();
        recipe.ingredients = toSplit[1].trim();
      }
      
      const { success, returnRecipe} = await registerRecipe(recipe.steps, recipe.name, recipe.ingredients);
      
      if (success && returnRecipe) {
        dbRecipe = returnRecipe;
      }
    } else {
      dbRecipe = isRecipe[0];
    }

    const exists = bookmarkIds.includes(recipe.id);
    
    if (exists) {
      setBookmarkIds((prev) => prev.filter((id) => id !== recipe.id));
      await deleteBookmark(user.id, dbRecipe?.id);
    } else {
      setBookmarkIds((prev) => [...prev, recipe.id]);
      await createBookmark(user.id, dbRecipe?.id);
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