"use server"; 
import Groq from "groq-sdk";
const ai = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function obtenerIngredientes(fotoUrl: string) {
  const foto64 = fotoUrl.includes(",") 
    ? fotoUrl.split(",")[1] 
    : fotoUrl;

  const response = await ai.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Identify the ingredients in this image and how many are there of each one. If there is no ingredients return No ingredients identified.. Return only a comma-separated list.`},
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${foto64}`,
              },
            },
          ],
        },
      ],
    });
  return response.choices[0].message.content;
}