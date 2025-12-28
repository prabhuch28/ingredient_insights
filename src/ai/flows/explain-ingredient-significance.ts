'use server';

/**
 * @fileOverview Explains the significance of a highlighted ingredient.
 *
 * - explainIngredientSignificance - A function that handles the explanation process.
 * - ExplainIngredientSignificanceInput - The input type for the explainIngredientSignificance function.
 * - ExplainIngredientSignificanceOutput - The return type for the explainIngredientSignificance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainIngredientSignificanceInputSchema = z.object({
  ingredient: z.string().describe('The ingredient to explain.'),
  reason: z.string().describe('The reason why the ingredient is highlighted.'),
});
export type ExplainIngredientSignificanceInput = z.infer<
  typeof ExplainIngredientSignificanceInputSchema
>;

const ExplainIngredientSignificanceOutputSchema = z.object({
  explanation: z.string().describe('A clear, concise explanation of why the ingredient is potentially concerning.'),
  confidence: z.enum(['high', 'medium', 'low']).describe('The confidence level of the explanation.'),
  uncertaintyNote: z.string().nullable().describe('An optional note indicating uncertainty in the explanation.'),
});
export type ExplainIngredientSignificanceOutput = z.infer<
  typeof ExplainIngredientSignificanceOutputSchema
>;

export async function explainIngredientSignificance(
  input: ExplainIngredientSignificanceInput
): Promise<ExplainIngredientSignificanceOutput> {
  return explainIngredientSignificanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainIngredientSignificancePrompt',
  input: {schema: ExplainIngredientSignificanceInputSchema},
  output: {schema: ExplainIngredientSignificanceOutputSchema},
  prompt: `You are a cautious AI assistant explaining why an ingredient is potentially concerning.

  Ingredient: {{{ingredient}}}
  Reason: {{{reason}}}

  Provide a clear, concise explanation of why the ingredient is potentially concerning, along with a confidence level ('high', 'medium', or 'low'). If there's uncertainty in your explanation, include an uncertainty note.

  Format your response as JSON:
  {
    "explanation": "explanation",
    "confidence": "high | medium | low",
    "uncertaintyNote": "string or null"
  }`,
});

const explainIngredientSignificanceFlow = ai.defineFlow(
  {
    name: 'explainIngredientSignificanceFlow',
    inputSchema: ExplainIngredientSignificanceInputSchema,
    outputSchema: ExplainIngredientSignificanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
