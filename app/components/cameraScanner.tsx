"use client";
import { useRef, useEffect } from "react";

interface CamaraScannerProps {
  onFotoCapturada: (dataUrl: string) => void;
}

export default function CameraScanner({ onFotoCapturada }: CamaraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let streamActual: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        streamActual = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error en cámara:", err));

    return () => {
      if (streamActual) streamActual.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capturarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const contexto = canvas.getContext("2d");
      if (contexto) {
        contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
        const urlDeLaFoto = canvas.toDataURL("image/png");
        onFotoCapturada(urlDeLaFoto);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-600 text-center">
          Take a photo of your ingredients.</p>
      <div className="flex justify-center my-4">
        <video ref={videoRef} autoPlay playsInline width="400" height="300" className="rounded-lg shadow-md"></video>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      
      <button 
        onClick={capturarFoto}
        className="bg-red-800 hover:bg-red-900 cursor-pointer text-white font-bold py-3 px-6 rounded-full shadow-lg transition mt-4"
      >
        Capture photo
      </button>
    </div>
  );
}