'use server';

/**
 * @fileOverview This file contains the Genkit flow for highlighting concerning ingredients.
 *
 * The flow takes ingredient text as input, infers user intent, calls an LLM to identify and explain potentially concerning ingredients,
 * and returns a structured JSON with highlights, reasons, confidence levels, and uncertainty notes.
 *
 * - highlightConcerningIngredients - A function that handles the process of highlighting concerning ingredients.
 * - HighlightConcerningIngredientsInput - The input type for the highlightConcerningIngredients function.
 * - HighlightConcerningIngredientsOutput - The return type for the highlightConcerningIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  highlights: z.array(
    z.object({
      ingredient: z.string().describe('The name of the ingredient.'),
      reason: z.string().describe('Why the ingredient might be concerning.'),
      confidence: z
        .enum(['high', 'medium', 'low'])
        .describe('The confidence level of the AI in its assessment.'),
    })
  ).describe('An array of highlighted ingredients and their explanations.'),
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

export async function highlightConcerningIngredients(
  input: HighlightConcerningIngredientsInput
): Promise<HighlightConcerningIngredientsOutput> {
  return highlightConcerningIngredientsFlow(input);
}

const highlightConcerningIngredientsPrompt = ai.definePrompt({
  name: 'highlightConcerningIngredientsPrompt',
  input: {schema: HighlightConcerningIngredientsInputSchema},
  output: {schema: HighlightConcerningIngredientsOutputSchema},
  prompt: `You are an AI assistant designed to analyze food ingredient lists and highlight potentially concerning ingredients.

  You will be given either a text list of ingredients, or an image of a food label. If you receive an image, extract the ingredient list from it first.
  Then, identify any ingredients that might be of concern to health-conscious users. Explain why each ingredient might be concerning and provide a confidence level for your assessment (high, medium, or low).

  If there are uncertainties in your analysis, clearly state them in the uncertaintyNote field. Suggest possible next actions based on the analysis.

  Output a JSON object in the following format:
  \{
    "summary": "High-level summary of the ingredient analysis",
    "highlights": [
      \{
        "ingredient": "Ingredient name",
        "reason": "Why it matters",
        "confidence": "high | medium | low"
      \}
    ],
    "uncertaintyNote": "string or null",
    "suggestedActions": ["string"]
  \}

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
