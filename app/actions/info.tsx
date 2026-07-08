"use server"; 
import Groq from "groq-sdk";

const ai = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function infoRecipe(recipe: string, ingredients: string) {
  const response = await ai.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Explain the process to cook a ${recipe} using ${ingredients}. Explain every single step briefly using ordinal numbers and DON'T SAY NOTHING MORE.`},
          ],
        },
      ],
    });
  return response.choices[0].message.content;
}