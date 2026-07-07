"use client";
import { useState } from "react";
import CameraScanner from "@/app/components/cameraScanner"; 
import PhotoCapture from "./components/photoCapture";
import RecipeMaker from "./components/recipeMaker";

export default function ChefInteligenteApp() {
  const tituloApp = "spatula";
  const [foto, setFoto] = useState<string | null>(null);

  const manejarNuevaFoto = (urlDeLaFoto: string) => {
    setFoto(urlDeLaFoto);
  };

  return (
    <main className="p-12 max-w-md mx-auto bg-gray-50 min-h-screen">
      <img src={'spatula.png'} className="mb-6"></img>
      <section className="mt-8 border-t pt-6">
      {foto ? (
        <div className="flex flex-col items-center">
          <PhotoCapture fotoUrl={foto} onReiniciarCamara={() => setFoto(null)}></PhotoCapture>
          <RecipeMaker fotoUrl={foto}></RecipeMaker>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <CameraScanner onFotoCapturada={manejarNuevaFoto} />
        </div>
      )}
      </section>
    </main>
  );
}