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
            { type: "text", text: `Identify the ingredients in this image and their approximate culinary amounts. " +
              "For countable ingridients (like avocado, prickly pears, pitayas) you may return a number." +
              "For uncountable ingredients (like rice, flour, sugar, water), DO NOT return just a number. " +
              "Instead, use visual estimates like '1 cup of rice', 'a handful of spinach', '1 bowl', 'half a package'. " +
              "Return the results as a comma-separated list. Example: 2 tomatoes, 1 cup of rice, a handful of cilantro, '1 pear', '3 pineapples'. +
              "DO NOT RETURN ANYTHING BESIDES THE LIST"` +
              "If no ingredients are visible return No ingredients identified."},
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