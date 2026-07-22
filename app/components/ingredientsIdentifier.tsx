"use client";
import { useState, useEffect } from 'react';
import { obtenerIngredientes } from '../actions/ingredients'; 
import EditableBio from './bioSection';

interface IngredientsIdentifierProps {
  photoUrl: string; 
  onIngredientesIdentified: (ingredientes: string) => void; 
}

export default function IngredientsIdentifier({ photoUrl, onIngredientesIdentified }: IngredientsIdentifierProps) {
  const [ingredientes, setIngredientes] = useState<string>("Loading ingredients...");
  const handleSaveIngredients = async (newIngredients: string) => {
    if(newIngredients) setIngredientes(newIngredients);
  }
  useEffect(() => {
    async function callServerAction() {
      try {
        if (!photoUrl) return;
        setIngredientes("Analizing image...");
        const texto = await obtenerIngredientes(photoUrl);
        
        if (texto) {
          setIngredientes(texto);
          onIngredientesIdentified(texto); 
        }
      } catch (err) {
        console.error("Client error:", err);
      }
    }

    callServerAction();
  }, [photoUrl]); 

  return (
    <div className="bg-red-950/20 rounded-xl shadow-sm border text-gray-500 text-center w-87">
      <h2 className="text-xl text-red-900 font-semibold m-2">Detected ingredients:</h2>
      <EditableBio initialBio={ingredientes} onSave={handleSaveIngredients}></EditableBio>
    </div>
  );
}