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
            { type: "text", text:  `You are a professional Executive Chef with years of experience in Michelin-star kitchens, specializing in resourceful cooking. 

            Your task is to look at this list of ingredients: "${ingredients}", and design just 3 realistic and delicious recipes that can be made at home. 

            Requirements:
            - Don't create a recipe that includes any other ingredient not presented previously.
            - Format the output as a comma-separated list of recipes where each recipe includes its name.
            - Separate each recipe ONLY with a comma (,).
            - Names of recipes should be concise.
            - Don't return ANYTHING more than that`},
          ],
        },
      ],
    });
  return response.choices[0].message.content;
}