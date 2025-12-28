'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Start of logic moved from highlight-concerning-ingredients.ts ---

const HighlightConcerningIngredientsInputSchema = z.object({
  ingredientsText: z.string().optional().describe('The ingredient list text to analyze.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a food label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HighlightConcerningIngredientsInput = z.infer<
  typeof HighlightConcerningIngredientsInputSchema
>;

const HighlightConcerningIngredientsOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the ingredient analysis.'),
  highlights: z
    .array(
      z.object({
        ingredient: z.string().describe('The name of the ingredient.'),
        reason: z.string().describe('Why it might be concerning.'),
        confidence: z
          .enum(['high', 'medium', 'low'])
          .describe('The confidence level of the AI in its assessment.'),
      })
    )
    .describe('An array of highlighted ingredients and their explanations.'),
  uncertaintyNote: z
    .string()
    .nullable()
    .describe('A note indicating any uncertainties in the analysis.'),
  suggestedActions: z
    .array(z.string())
    .describe('An array of suggested actions based on the analysis.'),
});
export type HighlightConcerningIngredientsOutput = z.infer<
  typeof HighlightConcerningIngredientsOutputSchema
>;


const highlightConcerningIngredientsPrompt = ai.definePrompt({
  name: 'highlightConcerningIngredientsPrompt',
  input: {schema: HighlightConcerningIngredientsInputSchema},
  output: {schema: HighlightConcerningIngredientsOutputSchema},
  prompt: `You are an AI ingredient interpretation co-pilot.

Your job is NOT to list ingredients, NOT to provide nutrition tables, and NOT to act as a chatbot.

Your job is to:
- Interpret food ingredient information like a thoughtful human expert.
- Infer what matters to the user without asking them questions.
- Explain only the most relevant concerns in plain language.
- Be cautious, evidence-aware, and transparent about uncertainty.

You will be given either a text list of ingredients, or an image of a food label.

If you receive an image:
1.  **Prioritize the Ingredient List:** Your primary goal is to find and analyze the ingredient list. Look for a heading like "Ingredients:", "INGREDIENTS", or similar.
2.  **Analyze Ingredients:** If you find an ingredient list, identify any ingredients that might be of concern to health-conscious users. For each, provide the ingredient, a reason it matters, and a confidence level.
3.  **Fallback to Nutrition Facts:** If you **cannot** find an ingredient list, look for a "Nutrition Facts" table. Analyze its contents to provide an expert interpretation.
    -   Generate a thoughtful **summary** of the product's nutritional profile.
    -   Create **highlights** for the 2-3 most relevant nutritional components (e.g., "Sodium", "Carbohydrates", "Dietary Fiber"). For each highlight, explain the 'reason' it's relevant (e.g., "One serving contains a relatively high amount...").
    -   Provide an **uncertaintyNote** about the limitations of nutrition labels.
    -   Suggest 1-2 actionable **suggestedActions**.
4.  **Handle Failure:** If you cannot find an ingredient list OR a nutrition facts table, state that in the summary and uncertainty note, and leave highlights and suggested actions empty.

If you are given a text list of ingredients, analyze it for concerning ingredients as described in step 2.

Your final output MUST be a JSON object matching the specified output schema.

{{#if ingredientsText}}
Ingredient List:
{{ingredientsText}}
{{/if}}

{{#if photoDataUri}}
Food Label Photo:
{{media url=photoDataUri}}
{{/if}}`,
});

const highlightConcerningIngredientsFlow = ai.defineFlow(
  {
    name: 'highlightConcerningIngredientsFlow',
    inputSchema: HighlightConcerningIngredientsInputSchema,
    outputSchema: HighlightConcerningIngredientsOutputSchema,
  },
  async input => {
    const {output} = await highlightConcerningIngredientsPrompt(input);
    return output!;
  }
);


async function highlightConcerningIngredients(
  input: HighlightConcerningIngredientsInput
): Promise<HighlightConcerningIngredientsOutput> {
  return highlightConcerningIngredientsFlow(input);
}


// --- End of logic moved from highlight-concerning-ingredients.ts ---


export type FormState = {
  type: 'initial' | 'success' | 'error';
  message?: string;
  data?: HighlightConcerningIngredientsOutput;
};

async function toDataURI(image: File) {
  const imageBuffer = await image.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  return `data:${image.type};base64,${imageBase64}`;
}

export async function analyzeIngredients(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const ingredients = formData.get('ingredients') as string | undefined;
    const image = formData.get('image') as File | null;

    if (!ingredients && (!image || image.size === 0)) {
      return {
        type: 'error',
        message: 'Please enter ingredients or upload an image.',
      };
    }

    let photoDataUri: string | undefined = undefined;
    if (image instanceof File && image.size > 0) {
      photoDataUri = await toDataURI(image);
    }
    
    const result = await highlightConcerningIngredients({
      ingredientsText: ingredients,
      photoDataUri: photoDataUri,
    });

    if (!result) {
      return {
        type: 'error',
        message: 'Analysis failed. The AI could not process the ingredients.',
      };
    }

    return {
      type: 'success',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      type: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
