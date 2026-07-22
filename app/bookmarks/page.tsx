"use client"
import BookmarksSection from "../components/bookmarksSection";
import { useRouter } from "next/navigation";

interface Recipes {
  id: string;
  name: string;
  ingredients: string;
  steps: string;
}

export default function Bookmarks() {
    const router = useRouter();

    return (
        <section className="mt-4 pt-4">
            <BookmarksSection 
                onSelectRecipe={(recetaObj: Recipes) => {
                router.push(`/recipes/${recetaObj.id}?from=bookmarks`);
            }}
                      />
        </section>
    )
}