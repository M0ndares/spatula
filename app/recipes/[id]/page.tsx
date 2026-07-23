import InfoRecipe from "@/app/components/infoRecipe";
import { getRecipeById } from "@/app/actions/recipesDb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ from?: string }> | { from?: string };
}

export default async function RecipeDetail({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const recipeId = resolvedParams.id;
  const originPage = resolvedSearchParams?.from || "";
  const backHref = originPage ? `/${originPage}` : "/";
  const backLabel = originPage ? originPage : "/";
  const currentRecipe = await getRecipeById(recipeId) || null;

  return (
    <div className="mt-4">
      {currentRecipe && (
        <div>
          <InfoRecipe 
            id={currentRecipe[0].id}
            name={currentRecipe[0].name} 
            ingredients={currentRecipe[0].ingredients} 
            steps={currentRecipe[0].steps} 
          />
        </div>
      )}
        <Link 
            href={backHref}
            className="text-sm text-red-800 hover:text-red-900 font-semibold underline mt-6 block cursor-pointer pl-5 capitalize"
          >
            ← Back to {backLabel}
        </Link>
    </div>
  );
}