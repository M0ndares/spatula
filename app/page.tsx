"use client";
import MenuSpatula from "./components/menuSpatula";
import { useRouter } from "next/navigation";

export interface RecipesTemplate {
  name: string;
  steps: string; 
  id: string;
  ingredients: string;
}

export default function Spatula() {
  const router = useRouter();
  return (
    <main>
      <section className="mt-4 pt-4">
        <MenuSpatula onSelectRecipe={(recipeObj: RecipesTemplate) => router.push(`/recipes/${recipeObj.id}`)}></MenuSpatula>
      </section>
    </main>
  );
}
