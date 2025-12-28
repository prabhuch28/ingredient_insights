'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a concise summary of an ingredient list analysis.
 *
 * The flow takes an ingredient list as input and returns a summary string.
 * - generateConciseSummary - A function that handles the generation of a concise summary.
 * - GenerateConciseSummaryInput - The input type for the generateConciseSummary function.
 * - GenerateConciseSummaryOutput - The return type for the generateConciseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConciseSummaryInputSchema = z.object({
  ingredientList: z
    .string()
    .describe('The list of ingredients to be summarized.'),
});
export type GenerateConciseSummaryInput = z.infer<
  typeof GenerateConciseSummaryInputSchema
>;

const GenerateConciseSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the ingredient list.'),
});
export type GenerateConciseSummaryOutput = z.infer<
  typeof GenerateConciseSummaryOutputSchema
>;

export async function generateConciseSummary(
  input: GenerateConciseSummaryInput
): Promise<GenerateConciseSummaryOutput> {
  return generateConciseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConciseSummaryPrompt',
  input: {schema: GenerateConciseSummaryInputSchema},
  output: {schema: GenerateConciseSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes a list of ingredients into a concise, human-readable summary.

  Ingredient list: {{{ingredientList}}}
  
  Summary: `,
});

const generateConciseSummaryFlow = ai.defineFlow(
  {
    name: 'generateConciseSummaryFlow',
    inputSchema: GenerateConciseSummaryInputSchema,
    outputSchema: GenerateConciseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
