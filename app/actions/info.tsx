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
            { type: "text", text: `You are a professional Executive Chef with years of experience in Michelin-star kitchens, specializing in creative, resourceful cooking. 

            Your task is to look at this list of ingredients: "${ingredients}", and explain the steps needed to cook this recipe: ${recipe}. 

            Requirements:
            - Every step should be presented in its own line.
            - Explain every single step using ordinal numbers.
            - You don't have to use all the ingredients list
            - The quantities can't be greater than the available ingredients.
            - After the last step, write '&&' followed by the ingredients needed for this recipe separated by a line break. Remember, you don't have to use all the ingredients list.
            - DON'T SAY ANYTHING MORE.`},
          ],
        },
      ],
    });
  return response.choices[0].message.content;
}