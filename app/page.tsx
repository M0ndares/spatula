"use client";
import { useState } from "react";
import CameraScanner from "@/app/components/cameraScanner"; 
import PhotoCapture from "./components/photoCapture";
import IngredientsIdentifier from "./components/ingredientsIdentifier";
import RecipeMaker from "./components/recipeMaker";
import InfoRecipe from "./components/infoRecipe";

export default function Spattula() {
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
    <main className="p-12 max-w-md mx-auto bg-gray-50 min-h-screen">
      <a onClick={() => setFoto(null)}>
         <img src={'spatula.png'} className="mb-6 cursor-pointer" alt="Spatula Logo" />
      </a>
      <section className="mt-8 border-t pt-6">
      
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