"use server";
import { db } from "@/app/db/index"
import { createClient } from "@/app/db/server";
import { eq } from "drizzle-orm";
import { recipes } from "@/app/db/schema";

export async function getRecipeById(id: string) {
  db.select().from(recipes).where(eq(recipes.id, id))
}

export async function registerRecipe(steps: string, name: string, ingredients: string) {
    db.insert(recipes).values({ 
        steps: steps,
        name: name, 
        ingredients: ingredients,
      })
  return { success: true };
}