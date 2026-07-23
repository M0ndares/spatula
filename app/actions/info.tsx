"use server"; 
import Groq from "groq-sdk";

const ai = new Groq({ apiKey: process.env.GROQ_TOKEN });

export async function infoRecipe(recipe: string, ingredients: string) {
  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b", 
    messages: [{
      role: 'system',
      content: `You are an expert chef part of a perfectly aligned pipeline. If you do not follow the rules, the whole system crashes.`
    },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Your task is to write the preparation steps for the recipe: "${recipe}", using ONLY a subset of these available ingredients: "${ingredients}".

### CRITICAL RULES:
1. **Ingredient Quantities**: The ingredient amounts used in the steps MUST NOT exceed the available quantities provided in the list. If you must adjust them down to fit the recipe, do it silently.
2. **Kitchen Staples**: You are allowed to use standard pantry staples (salt, black pepper, water, basic cooking oil) if necessary.
3. **Sequential Steps**: 
   - Explain every single step using standard sequential numbering starting with "1. ", "2. ", "3. ".
   - Each step must be on its own individual line. Do NOT leave empty lines between steps.

### ABSOLUTE FORMATTING LOCKDOWN (ZERO TOLERANCE):
- **No Meta-Commentary**: Absolutely NO conversational filler, NO introductory text, and NO parenthetical notes (e.g., do NOT write things like "(I removed the 'a'...)" or "(Note: adjusted quantities)"). 
- **System Constraints**: Your output is processed directly by an automated string-parsing script. Any extra word, character, note, or clarification outside the requested template will completely crash the production application.
- **First Character**: The very first character of your entire response MUST be the number "1".
- Immediately after the final step, write exactly the delimiter "&&", and then list ONLY the ingredients used in this recipe (one per line, with their used quantities, without bullet points or dashes).

### TARGET TEMPLATE:
1. Step one instructions here.
2. Step two instructions here.
&&[Quantity] [Ingredient 1]
[Quantity] [Ingredient 2]`
          },
        ],
      },
    ],
  });
  const output = response.choices[0].message.content?.split('&&')
  if(output) return {ingredientsOutput: output[1], stepsOutput: output[0]};
  return {ingredientsOutput: null, stepsOutput: null}
}