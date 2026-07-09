"use client";
import { useState } from "react";
import CameraScanner from "@/app/components/cameraScanner"; 
import PhotoCapture from "./components/photoCapture";
import IngredientsIdentifier from "./components/ingredientsIdentifier";
import RecipeMaker from "./components/recipeMaker";
import InfoRecipe from "./components/infoRecipe";

export default function Spatula() {
  const [foto, setFoto] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<string | null>(null);
  const [mostrarRecetas, setMostrarRecetas] = useState<boolean>(false);

  const manejarNuevaFoto = (urlDeLaFoto: string) => {
    setFoto(urlDeLaFoto);
    setIngredients(null); 
    setCurrentRecipe(null);
    setMostrarRecetas(false);
  };

  return (
    <main className="p-1 max-w-md mx-auto bg-gray-50 min-h-screen">
    <nav className="w-full bg-red-50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 py-3 shadow-sm">
      <div className="w-full flex justify-between items-center">
        <a 
          onClick={() => setFoto(null)} 
          className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <img 
            src={'logo.png'} 
            className="h-8 w-auto object-contain" // 💡 Quitamos mb-6 y controlamos su altura
            alt="Spatula Logo" 
          />
        </a>

        <ul className="flex items-center gap-4 text-sm font-semibold text-gray-600">
          <li className="flex items-center gap-1 cursor-pointer hover:text-red-900 transition-colors group">
            <span className="material-symbols-outlined text-[22px]">
              egg_alt
            </span>
            <span className="hidden sm:inline">Recipes</span>
          </li>

          <li className="flex items-center gap-1 cursor-pointer hover:text-red-900 transition-colors group">
            <span className="material-symbols-outlined text-[22px]">
              star
            </span>
            <span className="hidden sm:inline">Bookmarks</span>
          </li>

          <li className="flex items-center gap-1 cursor-pointer hover:text-red-900 transition-colors group">
            <span className="material-symbols-outlined text-[22px]">
              account_circle
            </span>
            <span className="hidden sm:inline">Profile</span>
          </li>
        </ul>

      </div>
    </nav>
      <section className="mt-4 border-t pt-4">
      
      {!foto && (
        <div className="flex flex-col items-center">
          <CameraScanner onFotoCapturada={manejarNuevaFoto} />
        </div>
      )} 
      
      {foto && !mostrarRecetas && (
        <div className="flex flex-col items-center">
          <PhotoCapture fotoUrl={foto} onReiniciarCamara={() => setFoto(null)} />
          <br></br>

          <IngredientsIdentifier 
            fotoUrl={foto} 
            onIngredientesIdentificados={(resultado) => setIngredients(resultado)} 
          />
          <button 
            onClick={() => setMostrarRecetas(true)}
            disabled={!ingredients || ingredients === 'No ingredients identified.'}
            className={`text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-6 ${
              !ingredients || ingredients === 'No ingredients identified.'
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-800 hover:bg-red-900 cursor-pointer" 
            }`}
          >
            Look for recipes
          </button>
        </div>
      )}

      {foto && mostrarRecetas && ingredients && !currentRecipe && (
        <div className="flex flex-col items-center">
          <RecipeMaker 
            ingredients={ingredients} 
            onSelectRecipe={(recetaSeleccionada) => setCurrentRecipe(recetaSeleccionada)} 
          />

          <button 
            onClick={() => setFoto(null)}
            className="text-sm text-gray-400 hover:text-gray-500 underline mt-4 cursor-pointer"
          >
            Take another photo
          </button>
        </div>
      )}

      {foto && mostrarRecetas && ingredients && currentRecipe && (
        <div className="flex flex-col items-center">
          <InfoRecipe ingredients={ingredients} currentRecipe={currentRecipe}></InfoRecipe>
          
          <button 
            onClick={() => setCurrentRecipe(null)}
            className="text-sm text-red-800 hover:text-red-900 font-semibold underline mt-6 block cursor-pointer"
          >
            ← Back to recipes list
          </button>

          <button 
            onClick={() => setFoto(null)}
            className="text-sm text-gray-400 hover:text-gray-500 underline mt-2 cursor-pointer"
          >
            Take another photo
          </button>
        </div>
      )}
      </section>
    </main>
  );
}