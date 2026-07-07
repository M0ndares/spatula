"use client";
import { useRef, useEffect } from "react";

interface PhotoScannerProps {
  fotoUrl: string;                
  onReiniciarCamara: () => void;  
}

export default function PhotoCapture({ fotoUrl, onReiniciarCamara }: PhotoScannerProps) {
  return (
    <div className="flex flex-col items-center">
      <img src={fotoUrl} alt="Tu refri" className="rounded-lg max-w-full h-auto shadow" />      
        <button 
        onClick={onReiniciarCamara} 
        className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-6">
        Tomar otra foto
      </button>
    </div>
  );
}