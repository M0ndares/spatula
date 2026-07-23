"use client"
import BookmarksSection from "../components/bookmarksSection";

interface Recipes {
  id: string;
  name: string;
  ingredients: string;
  steps: string;
}

export default function Bookmarks() {
    return (
        <section className="mt-4 pt-4">
            <BookmarksSection 
                onSelectRecipe={(recetaObj: Recipes) => {
            }}
                      />
        </section>
    )
}