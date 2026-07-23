"use client"
import { useState } from "react"
import RecipeMaker from "@/app/components/recipeMaker"
import IngredientsIdentifier from "@/app/components/ingredientsIdentifier"
import { RecipesTemplate } from "@/app/page"
import PhotoCapture from "@/app/components/photoCapture"
import CameraScanner from "@/app/components/cameraScanner"
import { useRouter } from "next/navigation"

export default function Recipes() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<string | null>(null);
    const [createdRecipes, setCreatedRecipes] = useState<RecipesTemplate[]>([]);
    const [showRecipes, setShowRecipes] = useState<boolean>(false);

    const newPhoto = (urlDeLaPhoto: string) => {
        setPhoto(urlDeLaPhoto);
        setIngredients(null); 
        setCreatedRecipes([]);
        setShowRecipes(false); 
    };

    return (
        <section className="mt-4 pt-4">
              {!photo && (
                <div className="flex flex-col items-center">
                  <CameraScanner onCapturedPhoto={newPhoto} />
                </div>
              )} 
              
              {photo && !showRecipes && (
                <div className="flex flex-col items-center">
                  <PhotoCapture photoUrl={photo}  />
                  <br />
                  <IngredientsIdentifier 
                    photoUrl={photo} 
                    onIngredientsIdentified={(ingredients: string) => setIngredients(ingredients) } 
                  />
                  <div className="gap-4 flex">     
                    <button 
                      onClick={() => setPhoto(null)} 
                      className="py-3 px-3 mt-6 bg-red-800 hover:bg-red-900 cursor-pointer text-white font-bold rounded-full shadow-lg transition ">
                      Take another photo
                    </button>
                    <button 
                      onClick={() => setShowRecipes(true)}
                      disabled={!ingredients || ingredients === 'No ingredients identified.'}
                      className={`py-3 px-3 mt-6 text-white font-bold rounded-full shadow-lg transition ${
                        !ingredients || ingredients === 'No ingredients identified.'
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-800 cursor-pointer shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212] transition-all duration-200 transform hover:-translate-y-0.5 group" 
                      }`}
                    >
                      Look for recipes
                    </button>
                  </div>
                </div>
              )}

              {photo && ingredients && showRecipes && (
                <div className="flex flex-col items-center mt-6">
                  <RecipeMaker 
                    existingRecipes={createdRecipes}
                    onCreateRecipe={setCreatedRecipes}
                    ingredients={ingredients} 
                    onSelectRecipe={(recipeObj: RecipesTemplate) => {
                      router.push(`/recipes/${recipeObj.id}`)
                    }} 
                  />
                  <button 
                    onClick={() => {
                      setPhoto(null);
                      setCreatedRecipes([]);
                      setShowRecipes(false);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-500 underline mt-6 cursor-pointer"
                  >
                    Take another photo
                  </button>
                </div>
              )}
            </section>
    )
}