"use client";

import { useState, useEffect } from 'react';
// 1. Importamos la Server Action que creaste (aquí es donde vive el token seguro)
import { obtenerIngredientes } from '../actions/gemini'; 

interface RecipeMakerProps {
  fotoUrl: string; 
}

export default function RecipeMaker({ fotoUrl }: RecipeMakerProps) {
  const [ingredientes, setIngredientes] = useState<string>("Cargando ingredientes...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function llamarServerAction() {
      try {
        if (!fotoUrl) return;
        setIngredientes("Analizando imagen...");
        const texto = await obtenerIngredientes(fotoUrl);
        
        if (texto) {
          setIngredientes(texto);
        } else {
          setIngredientes("No se encontraron ingredientes.");
        }
      } catch (err) {
        console.error("Error en el cliente:", err);
        setError("Hubo un error al procesar la imagen.");
      }
    }

    llamarServerAction();
  }, [fotoUrl]); 

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border text-gray-500 text-center w-full">
      <h2 className="text-xl text-gray-600 font-semibold mb-4 mt-6">Buscando recetas para:</h2>
      <p className="text-lg text-gray-800 font-medium">{ingredientes}</p>
    </div>
  );
}