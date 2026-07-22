"use client";
import { useState, useEffect } from 'react';
import { obtenerIngredientes } from '../actions/ingredients'; 
import EditableBio from './bioSection';

interface IngredientsIdentifierProps {
  photoUrl: string; 
  onIngredientesIdentificados: (ingredientes: string) => void; 
}

export default function IngredientsIdentifier({ photoUrl, onIngredientesIdentificados }: IngredientsIdentifierProps) {
  const [ingredientes, setIngredientes] = useState<string>("Cargando ingredientes...");
  const handleSaveIngredients = async (newIngredients: string) => {
    if(newIngredients) setIngredientes(newIngredients);
  }
  useEffect(() => {
    async function llamarServerAction() {
      try {
        if (!photoUrl) return;
        setIngredientes("Analizando imagen...");
        const texto = await obtenerIngredientes(photoUrl);
        
        if (texto) {
          setIngredientes(texto);
          onIngredientesIdentificados(texto); 
        }
      } catch (err) {
        console.error("Error en el cliente:", err);
      }
    }

    llamarServerAction();
  }, [photoUrl]); 

  return (
    <div className="bg-red-950/20 rounded-xl shadow-sm border text-gray-500 text-center w-87">
      <h2 className="text-xl text-red-900 font-semibold m-2">Detected ingredients:</h2>
      <EditableBio initialBio={ingredientes} onSave={handleSaveIngredients}></EditableBio>

    </div>
  );
}