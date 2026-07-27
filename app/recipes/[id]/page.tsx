import InfoRecipe from "@/app/components/infoRecipe";
import { getRecipeById } from "@/app/actions/recipesDb";
import BackButton from "@/app/components/backButton";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function RecipeDetail({ params }: PageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  const currentRecipe = await getRecipeById(recipeId);
  return (
    <div className="mt-4">
      {currentRecipe && (
        <div>
          <InfoRecipe 
            id={currentRecipe.id}
            name={currentRecipe.name} 
            ingredients={currentRecipe.ingredients} 
            steps={currentRecipe.steps} 
          />
        </div>
      )}
        <BackButton></BackButton>
    </div>
  );
}