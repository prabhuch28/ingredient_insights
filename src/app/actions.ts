'use server';

import {
  highlightConcerningIngredients,
  type HighlightConcerningIngredientsOutput,
} from '@/ai/flows/highlight-concerning-ingredients';
import {z} from 'zod';

const inputSchema = z.object({
  ingredients: z.string().optional(),
  image: z.instanceof(File).optional(),
});

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
    const image = formData.get('image') as File | undefined;

    if (!ingredients && (!image || image.size === 0)) {
      return {
        type: 'error',
        message: 'Please enter ingredients or upload an image.',
      };
    }

    const photoDataUri = (image && image.size > 0) ? await toDataURI(image) : undefined;

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
