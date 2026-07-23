import InfoRecipe from "@/app/components/infoRecipe";
import { getRecipeById } from "@/app/actions/recipesDb";
import BackButton from "@/app/components/backButton";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function RecipeDetail({ params }: PageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  const currentRecipe = await getRecipeById(recipeId) || null;
  return (
    <div className="mt-4">
      {currentRecipe.length > 0 && (
        <div>
          <InfoRecipe 
            id={currentRecipe[0].id}
            name={currentRecipe[0].name} 
            ingredients={currentRecipe[0].ingredients} 
            steps={currentRecipe[0].steps} 
          />
        </div>
      )}
        <BackButton></BackButton>
    </div>
  );
}