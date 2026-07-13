"use server";
import { db } from "@/app/db/index"
import { eq } from "drizzle-orm";
import { recipes } from "@/app/db/schema";

export async function getRecipeById(id: string) {
  return db.select().from(recipes).where(eq(recipes.id, id))
}

export async function getRecipeByName(name: string) {
  return db.select().from(recipes).where(eq(recipes.name, name))
}

export async function registerRecipe(steps: string, name: string, ingredients: string) {
    const result = await db.insert(recipes).values({ 
        steps: steps,
        name: name, 
        ingredients: ingredients,
      })
      .returning(); 
  return { success: true, returnRecipe: result[0] };
}