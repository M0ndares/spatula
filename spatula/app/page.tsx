"use client";
import { useState } from "react";
import CameraScanner from "@/app/components/cameraScanner"; 

export default function ChefInteligenteApp() {
  const tituloApp = "spatula";
  const [foto, setFoto] = useState<string | null>(null);

  const manejarNuevaFoto = (urlDeLaFoto: string) => {
    setFoto(urlDeLaFoto);
    console.log("¡Foto recibida en el padre! Lista para Hugging Face.");
  };

  return (
    <main className="p-12 max-w-md mx-auto bg-gray-50 min-h-screen">
      <img src={'spatula.png'} className="mb-6"></img>
      <p className="text-gray-600 text-center">
        Toma una foto a tus ingredientes.
      </p>

      <CameraScanner onFotoCapturada={manejarNuevaFoto} />
      
      <section className="mt-8 border-t pt-6">
        <h2 className="text-xl text-gray-600 font-semibold mb-4">Recetas sugeridas:</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-gray-500 text-center">
          {foto ? (
            <div className="flex flex-col items-center">
              <img src={foto} alt="Tu refri" className="rounded-lg max-w-full h-auto shadow" />
            </div>
          ) : (
            "Aún no has subido ninguna foto."
          )}
        </div>
      </section>
    </main>
  );
}