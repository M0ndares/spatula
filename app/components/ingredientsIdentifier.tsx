"use client";
import { useState, useEffect } from 'react';
import { obtenerIngredientes } from '../actions/ingredients'; 

interface IngredientsIdentifierProps {
  photoUrl: string; 
  onIngredientesIdentificados: (ingredientes: string) => void; 
}

export default function IngredientsIdentifier({ photoUrl, onIngredientesIdentificados }: IngredientsIdentifierProps) {
  const [ingredientes, setIngredientes] = useState<string>("Cargando ingredientes...");

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
    <div className="bg-white rounded-lg shadow-sm border text-gray-500 text-center w-80">
      <h2 className="text-xl text-gray-600 font-semibold mb-4">Detected ingredients:</h2>
      <p className="text-lg text-gray-800 font-medium">{ingredientes}</p>
    </div>
  );
}