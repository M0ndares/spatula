"use client";

interface PhotoScannerProps {
  photoUrl: string;                
}

export default function PhotoCapture({ photoUrl }: PhotoScannerProps) {
  return (
    <div className="flex flex-col items-center">
      <img src={photoUrl} width="350" height="200" alt="Tu refri" className="rounded-lg max-w-full h-auto shadow" />      
    </div>
  );
}