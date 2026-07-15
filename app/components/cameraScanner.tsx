"use client";
import { useRef, useEffect, useState } from "react";
import { fonts } from "../actions/fonts";

interface CamaraScannerProps {
  onCapturedPhoto: (dataUrl: string) => void;
}

export default function CameraScanner({ onCapturedPhoto }: CamaraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let streamActual: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: {ideal: "environment"} } })
    
      .then((stream) => {
        streamActual = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error en cámara:", err));

    return () => {
      if (streamActual) streamActual.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const contexto = canvas.getContext("2d");
      if (contexto) {
        contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
        const urlDeLaFoto = canvas.toDataURL("image/png");
        onCapturedPhoto(urlDeLaFoto);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
            <span className={`font-serif italic duration-500 transform`}>Recipes</span>
      </h1>
      <br></br>
      <p className="text-gray-500 text-center">
          Take a photo of your ingredients.</p>
      <div className="flex justify-center my-4">
        <video ref={videoRef} autoPlay playsInline width="350" height="200" className="rounded-lg shadow-md"></video>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      
      <button 
        onClick={takePhoto}
        className="bg-red-800 cursor-pointer
                       shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                       transition-all duration-200 transform hover:-translate-y-0.5 group text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-4"
      >
        Capture photo
      </button>
    </div>
  );
}