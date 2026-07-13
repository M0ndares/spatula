"use client";
import { useState } from "react";
import CameraScanner from "@/app/components/cameraScanner"; 
import PhotoCapture from "./components/photoCapture";
import IngredientsIdentifier from "./components/ingredientsIdentifier";
import RecipeMaker from "./components/recipeMaker";
import InfoRecipe from "./components/infoRecipe";
import NavigationBar from "./components/navigationBar";
import MenuSpatula from "./components/menuSpatula";
import BookmarksSection from "./components/bookmarksSection";
import ProfileSection from "./components/profileSection";

interface Recipes {
  name: string;
  steps: string; 
  id: string;
  ingredients: string;
}

export default function Spatula() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipes | null>(null);
  const [mostrarRecetas, setMostrarRecetas] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('menu');

  const newPhoto = (urlDeLaPhoto: string) => {
    setPhoto(urlDeLaPhoto);
    setIngredients(null); 
    setCurrentRecipe(null);
    setMostrarRecetas(false);
  };

  const toNav = (tab: string) => {
    setPhoto(null);
    setIngredients(null); 
    setCurrentRecipe(null);
    setMostrarRecetas(false);
    setCurrentTab(tab);
  };

  return (
    <main className="p-1 max-w-md mx-auto bg-gray-50 min-h-screen">
      <NavigationBar currentTab={currentTab} onNavigate={toNav}></NavigationBar>
      
      {currentTab === 'menu' && (
        <section className="mt-4 pt-4">
          <MenuSpatula></MenuSpatula>
        </section>
      )}
      
      {currentTab === 'recipes' && (
        <section className="mt-4 pt-4">
          {!photo && (
            <div className="flex flex-col items-center">
              <CameraScanner onCapturedPhoto={newPhoto} />
            </div>
          )} 
          
          {photo && !mostrarRecetas && (
            <div className="flex flex-col items-center">
              <PhotoCapture photoUrl={photo} onRestartCamera={() => setPhoto(null)} />
              <br></br>
              <IngredientsIdentifier 
                photoUrl={photo} 
                onIngredientesIdentificados={(resultado) => setIngredients(resultado)} 
              />
              <button 
                onClick={() => setMostrarRecetas(true)}
                disabled={!ingredients || ingredients === 'No ingredients identified.'}
                className={`text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-6 ${
                  !ingredients || ingredients === 'No ingredients identified.'
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-800 cursor-pointer shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212] transition-all duration-200 transform hover:-translate-y-0.5 group" 
                }`}
              >
                Look for recipes
              </button>
            </div>
          )}

          {photo && mostrarRecetas && ingredients && !currentRecipe && (
            <div className="flex flex-col items-center">
              <RecipeMaker 
                ingredients={ingredients} 
                onSelectRecipe={(recetaObj: Recipes) => {
                  setCurrentRecipe(recetaObj);
                }} 
              />
              <button 
                onClick={() => setPhoto(null)}
                className="text-sm text-gray-400 hover:text-gray-500 underline mt-4 cursor-pointer"
              >
                Take another photo
              </button>
            </div>
          )}

          {photo && mostrarRecetas && ingredients && currentRecipe && (
            <div className="flex flex-col items-center">
              <InfoRecipe 
                ingredients={ingredients} 
                currentRecipe={currentRecipe.name} 
                recipeId={currentRecipe.id} 
              />
              
              <button 
                onClick={() => setCurrentRecipe(null)}
                className="text-sm text-red-800 hover:text-red-900 font-semibold underline mt-6 block cursor-pointer"
              >
                ← Back to recipes list
              </button>
              <button 
                onClick={() => setPhoto(null)}
                className="text-sm text-gray-400 hover:text-gray-500 underline mt-2 cursor-pointer"
              >
                Take another photo
              </button>
            </div>
          )}
        </section>
      )}

      {currentTab === 'bookmarks' && (
        <section className="mt-4 pt-4">
          {/* 5. Modificamos la navegación y corregimos el callback para mandar el objeto completo y saltar a la pestaña */}
          <BookmarksSection 
            onSelectRecipe={(recetaObj: Recipes) => {
              setCurrentRecipe(recetaObj);
              setCurrentTab('recipes'); // Te lleva a la pestaña de recetas para poder ver el InfoRecipe
              setPhoto("true"); // Marcador visual dummy para simular que hay flujo activo y renderizar InfoRecipe
              setMostrarRecetas(true);
            }}
          />
        </section>
      )}

      {currentTab === 'profile' && (
        <section className="mt-4 pt-4">
          <ProfileSection></ProfileSection>
        </section>
      )}
    </main>
  );
}