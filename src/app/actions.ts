'use server';

import {
  highlightConcerningIngredients,
  type HighlightConcerningIngredientsOutput,
} from '@/ai/flows/highlight-concerning-ingredients';
import { z } from 'zod';

const inputSchema = z.object({
  ingredients: z
    .string()
    .min(3, { message: 'Please enter a list of ingredients.' }),
});

export type FormState = {
  type: 'initial' | 'success' | 'error';
  message?: string;
  data?: HighlightConcerningIngredientsOutput;
};

export async function analyzeIngredients(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = inputSchema.safeParse({
      ingredients: formData.get('ingredients'),
    });

    if (!validatedFields.success) {
      return {
        type: 'error',
        message:
          validatedFields.error.flatten().fieldErrors.ingredients?.[0] ||
          'Invalid input.',
      };
    }

    const result = await highlightConcerningIngredients({
      ingredientsText: validatedFields.data.ingredients,
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
