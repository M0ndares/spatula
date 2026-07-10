"use client";
import { useRef, useEffect } from "react";

interface PhotoScannerProps {
  photoUrl: string;                
  onRestartCamera: () => void;  
}

export default function PhotoCapture({ photoUrl, onRestartCamera }: PhotoScannerProps) {
  return (
    <div className="flex flex-col items-center">
      <img src={photoUrl} width="350" height="200" alt="Tu refri" className="rounded-lg max-w-full h-auto shadow" />      
        <button 
        onClick={onRestartCamera} 
        className="bg-red-800 hover:bg-red-900 cursor-pointer text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-6">
        Take another photo
      </button>
    </div>
  );
}