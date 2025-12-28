'use server';

/**
 * @fileOverview A Genkit flow to add confidence scores to ingredient interpretations.
 *
 * - addConfidenceScores - A function that enhances ingredient interpretations with confidence scores.
 * - AddConfidenceScoresInput - The input type for the addConfidenceScores function, extending the base analysis response.
 * - AddConfidenceScoresOutput - The return type for the addConfidenceScores function, including confidence scores.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for the base analysis response
const BaseAnalysisResponseSchema = z.object({
  summary: z.string(),
  highlights: z.array(
    z.object({
      ingredient: z.string(),
      reason: z.string(),
    })
  ),
  uncertainty_note: z.string().nullable(),
  suggested_actions: z.array(z.string()),
});

// Define the input schema, extending the base response
const AddConfidenceScoresInputSchema = BaseAnalysisResponseSchema.extend({
  // No additional input needed, but the base analysis is required
});

export type AddConfidenceScoresInput = z.infer<typeof AddConfidenceScoresInputSchema>;

// Define the output schema, adding a confidence field to each highlight
const AddConfidenceScoresOutputSchema = BaseAnalysisResponseSchema.extend({
  highlights: z.array(
    z.object({
      ingredient: z.string(),
      reason: z.string(),
      confidence: z.enum(['high', 'medium', 'low']).describe('The confidence level of the reason.'),
    })
  ),
});

export type AddConfidenceScoresOutput = z.infer<typeof AddConfidenceScoresOutputSchema>;

export async function addConfidenceScores(input: AddConfidenceScoresInput): Promise<AddConfidenceScoresOutput> {
  return addConfidenceScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addConfidenceScoresPrompt',
  input: {schema: AddConfidenceScoresInputSchema},
  output: {schema: AddConfidenceScoresOutputSchema},
  prompt: `You are an AI assistant that adds a confidence score (high, medium, or low) to each ingredient highlight based on the reliability of the reason provided. The confidence score should reflect the certainty of the AI's assessment.

Base Analysis:
{{json input=input}}`,
});

const addConfidenceScoresFlow = ai.defineFlow(
  {
    name: 'addConfidenceScoresFlow',
    inputSchema: AddConfidenceScoresInputSchema,
    outputSchema: AddConfidenceScoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
