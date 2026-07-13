"use server";
import { db } from "@/app/db/index"
import { bookmarks } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { recipes } from "@/app/db/schema";

export async function getBookmarksByUserId(userId: string) {
  const result = await db
    .select({
      id: recipes.id,
      name: recipes.name,
      steps: recipes.steps,
    })
    .from(bookmarks)
    .leftJoin(recipes, eq(bookmarks.recipeId, recipes.id))
    .where(eq(bookmarks.userId, userId));
  return result.filter((row) => row.id !== null);
}

export async function countBookmarksById(userId: string) {
  return await db.select().from(bookmarks).where(eq(bookmarks.id, userId))
}

export async function createBookmark(userId: string, recipeId: string) {
  return await db.insert(bookmarks).values({ userId, recipeId });
}

export async function deleteBookmark(userId: string, recipeId: string) {
  return await db.delete(bookmarks).where(
    and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.recipeId, recipeId)
    )
  );
}