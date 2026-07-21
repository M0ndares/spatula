"use server";
import Groq from "groq-sdk";

const ai = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function obtenerIngredientes(fotoUrl: string) {
  const foto64 = fotoUrl.includes(",") 
    ? fotoUrl.split(",")[1] 
    : fotoUrl;

  try {
    const response = await ai.chat.completions.create({
      model: "qwen/qwen3.6-27b", 
      messages: [
        {
          role: "system",
          content: "You are a strict data extraction pipeline. You do not converse, you do not explain, and you do not format with markdown. Your ONLY purpose is to output the exact requested string starting with %%%. Any deviation will cause a critical system crash."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "List all edible food ingredients visible in this image with their approximate kitchen quantities.\n\nRULES:\n1. Output exactly ONE single line of text.\n2. The line MUST start with the characters %%%\n3. Display ingredients with quantities (1 tspn sugar, 3 pears).\n4. DO NOT output any other text, reasoning, greetings, or formatting.\n5. If no ingredients are identifiable, output exactly: %%% No ingredients identified.\n\nEXAMPLE OUTPUT:\n%%% 1. 1 pear, 2. 1 can of pickles, 3. 1 tspn of cocoa, 4. 4 eggs" 
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
      temperature: 0, 
    });

    const rawContent = response.choices[0].message.content || "";
    const match = rawContent.match(/(?:^|\n)(%%%.*)/);
    const contentLimpio = match 
      ? match[1].replace("%%%", "").trim() 
      : "No ingredients identified.";

    return contentLimpio;

  } catch (error) {
    console.error("Error en Groq API:", error);
    return `Error ${error}`
  }
}