"use client";
import { useState, useRef } from 'react'; 
import { HfInference } from '@huggingface/inference'; 

export default function ChefInteligenteApp() {
  const tituloApp = "spatula";
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const manejarClickCamara = () => {
    console.log("Abriendo cámara...");
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        console.log(canvas);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600">
        {tituloApp}
      </h1>
      
      <p className="text-gray-600 text-center mt-2 ">
        Toma una foto a tu refrigerador y te daré opciones de recetas.
      </p>

      <video ref={videoRef} autoPlay playsInline width="400" height="300"></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div className="flex justify-center mt-8">
        <button 
          onClick={manejarClickCamara}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition"
        >
          Tomar Foto
        </button>
      </div>
      
      <section className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Recetas sugeridas:</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-gray-500 text-center">
          Aún no has subido ninguna foto.
        </div>
      </section>
    </main>
  );
}