"use server"
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function createRecipes(ingredients: string) {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", 
    messages: [
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `You are a world-class Executive Chef specialized in resourceful home cooking. Your task is to design exactly 3 distinct, realistic, and delicious recipes based on this list of available ingredients: "${ingredients}".

### CRITICAL RULES:
1. **Ingredient Restrictions**: You may ONLY use the ingredients provided in the list. However, you are automatically allowed to assume the user has standard kitchen staples: salt, black pepper, water, and basic cooking oil. Do NOT include any other external ingredients.
2. **Recipe Feasibility**: The recipes must be realistic to cook at home and actually taste good. Do not combine ingredients that clash.
3. **Concise Names**: Recipe titles must be short, appealing, and direct (maximum 5 words per title).

### OUTPUT FORMAT (STRICT):
- Return EXACTLY a comma-separated list containing only the 3 recipe names.
- **Anti-Breaking Rule**: Do NOT use commas inside the name of any recipe (e.g., write "Garlic and Tomato Pasta" INSTEAD of "Pasta with Tomato, Garlic, and Basil"). Commas must ONLY be used to separate the 3 recipes.
- **Example Expected Output**: Tomato Garlic Pasta, Cheesy Scrambled Eggs, Crispy Potato Hash
- Absolutely NO conversational filler, NO introductory phrases, NO numbered lists, and NO quotes around the titles.`
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}