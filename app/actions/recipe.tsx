"use server"; 
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function createRecipes(ingredients: string) {
  const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text:  `Expose 3 popular recipes just by using ${ingredients} and nothing more. Return only a comma-separated list.`},
          ],
        },
      ],
    });
  return response.choices[0].message.content;
}