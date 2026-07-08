"use client";
import { useState, useEffect } from 'react';
import { obtenerIngredientes } from '../actions/ingredients'; 

interface IngredientsIdentifierProps {
  fotoUrl: string; 
  onIngredientesIdentificados: (ingredientes: string) => void; 
}

export default function IngredientsIdentifier({ fotoUrl, onIngredientesIdentificados }: IngredientsIdentifierProps) {
  const [ingredientes, setIngredientes] = useState<string>("Cargando ingredientes...");

  useEffect(() => {
    async function llamarServerAction() {
      try {
        if (!fotoUrl) return;
        setIngredientes("Analizando imagen...");
        const texto = await obtenerIngredientes(fotoUrl);
        
        if (texto) {
          setIngredientes(texto);
          onIngredientesIdentificados(texto); 
        }
      } catch (err) {
        console.error("Error en el cliente:", err);
      }
    }

    llamarServerAction();
  }, [fotoUrl]); 

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border text-gray-500 text-center w-full">
      <h2 className="text-xl text-gray-600 font-semibold mb-4 mt-6">Detected ingredients:</h2>
      <p className="text-lg text-gray-800 font-medium">{ingredientes}</p>
    </div>
  );
}