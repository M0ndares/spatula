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
          { 
            type: "text", 
            text: `You are a high-precision culinary vision assistant. Analyze the image carefully to identify all food ingredients and estimate their approximate kitchen quantities.

### ANALYSIS GUIDELINES:
1. **Double-Check Textures**: Carefully analyze shapes, colors, and textures to distinguish between similar ingredients (e.g., flour vs. powdered sugar, cilantro vs. parsley).
2. **Countable Ingredients** (e.g., avocados, tomatoes, limes): Return an approximate or exact integer (e.g., "2 avocados", "3 tomatoes").
3. **Uncountable Ingredients** (e.g., flour, rice, spinach, water): Do NOT use raw numbers. Use visual kitchen estimates (e.g., "1 cup of rice", "a handful of spinach", "half a package of pasta").
4. **Exclusion Guardrail**: Ignore cutting boards, knives, plates, plastic packaging labels, or background kitchen clutter. Only identify edible ingredients.

### OUTPUT FORMAT:
- Return ONLY a single, flat, comma-separated list of the identified ingredients with their quantities.
- **Example Output**: 2 tomatoes, 1 cup of rice, a handful of spinach, 1 avocado
- Absolutely NO conversational filler, NO introductory text (like "Here is your list:"), and NO markdown formatting (no bold text, no bullet points).
- If no edible food ingredients are clearly visible in the image, return exactly: No ingredients identified.`
          },
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