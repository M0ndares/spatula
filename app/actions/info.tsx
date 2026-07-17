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
          { 
            type: "text", 
            text: `You are a Michelin-star Executive Chef specialized in clear, precise, and resourceful culinary instructions.

Your task is to write the detailed preparation steps for the recipe: "${recipe}", using ONLY a subset of these available ingredients: "${ingredients}".

### CRITICAL RULES:
1. **Ingredient Quantities**: The ingredient amounts used in the steps MUST NOT exceed the available quantities provided in the list.
2. **Kitchen Staples**: You are allowed to use standard pantry staples (salt, black pepper, water, basic cooking oil) even if they are not in the list. Do NOT use any other external ingredients.
3. **Sequential Steps**: 
   - Explain every single step using standard sequential numbering starting with "1. ", "2. ", "3. " (do not use words like "First", "Second").
   - Each step must be on its own individual line.
   - Do NOT leave empty lines between the steps.

### OUTPUT FORMAT (STRICT):
- Start directly with step 1. Do NOT include any introductory text, titles, or conversational filler.
- Immediately after the final step, add a line break, write exactly the delimiter "&&", add another line break, and then list ONLY the ingredients used in this recipe (one per line, with their used quantities, without bullet points or dashes).
- Absolutely NO other text or formatting is allowed.

### TARGET TEMPLATE:
1. Step one instructions here.
2. Step two instructions here.
3. Step three instructions here.
&&
[Quantity] [Ingredient 1]
[Quantity] [Ingredient 2]
[Quantity] [Pantry Staple used, if any]`
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}