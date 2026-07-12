"use server";
import { db } from "@/app/db/index"
import { bookmarks } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function getBookmarksByUserId(userId: string) {
  return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
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