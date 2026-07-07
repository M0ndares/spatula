"use server"; 
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_TOKEN });

export async function obtenerIngredientes(fotoUrl: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { inlineData: { data: fotoUrl, mimeType: 'image/png' } },
      "Tell me the ingridients that you see in this image and how many are there of each one separating them with a comma. If there is no ingridients in the image say 'No hay ingredientes en la imagen'. IT IS PROHIBITED TO SAY ANYTHING MORE THAN THAT."
    ],
  });
  return response.text;
}