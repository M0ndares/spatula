import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("isActive").notNull(),
  bio: text("bio")
});

export const recipes = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ingredients: text("ingredients").notNull(), 
  steps: text("steps").notNull()
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  recipeId: uuid("recipeId").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
});