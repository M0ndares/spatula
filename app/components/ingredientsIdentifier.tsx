"use client";
import { useState, useEffect } from 'react';
import { getIngredients } from '../actions/ingredients'; 
import EditableBio from './bioSection';

interface IngredientsIdentifierProps {
  photoUrl: string; 
  onIngredientsIdentified: (ingredients: string) => void; 
}

export default function IngredientsIdentifier({ photoUrl, onIngredientsIdentified }: IngredientsIdentifierProps) {
  const [ingredients, setIngredients] = useState<string>("Loading ingredients...");
  const handleSaveIngredients = async (newIngredients: string) => {
    if(newIngredients) setIngredients(newIngredients);
  }
  useEffect(() => {
    async function callServerAction() {
      try {
        if (!photoUrl) return;
        setIngredients("Analizing image...");
        const ingredients = await getIngredients(photoUrl);
        if (ingredients) {
          setIngredients(ingredients);
          onIngredientsIdentified(ingredients); 
        }
      } catch (err) {
        console.error("Client error:", err);
      }
    }

    callServerAction();
  }, [photoUrl]); 

  return (
    <div className="bg-red-950/20 border-red-900 rounded-xl shadow-sm border text-gray-500 text-center w-87">
      <h2 className="text-xl text-red-900 font-semibold m-2">Detected ingredients:</h2>
      <EditableBio initialBio={ingredients} onSave={handleSaveIngredients}></EditableBio>
    </div>
  );
}