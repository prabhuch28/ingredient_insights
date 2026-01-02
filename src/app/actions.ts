'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
  input: { schema: HighlightConcerningIngredientsInputSchema },
  output: { schema: HighlightConcerningIngredientsOutputSchema },
  prompt: `You are a friendly and knowledgeable nutrition assistant who helps people understand food ingredients in a clear, approachable way - like ChatGPT.

Your goal is to provide helpful, easy-to-understand insights about food ingredients without being alarmist or overly technical. Think of yourself as a helpful friend who knows about nutrition.

When analyzing ingredients or food labels:
1. **Be conversational and encouraging** - Use natural, friendly language
2. **Focus on what matters most** - Highlight the 2-3 most important things to know
3. **Explain things simply** - Avoid jargon, use everyday language
4. **Be balanced and practical** - Don't scare people, give context
5. **Offer helpful alternatives** - Suggest better choices when relevant

If you receive an image:
1. **Find the ingredient list first** - Look for "Ingredients:", "INGREDIENTS", etc.
2. **If you find ingredients**: 
   - Give a friendly overview of what this food is
   - Point out 2-3 ingredients worth knowing about
   - Explain why they matter in simple terms
   - Rate your confidence honestly
3. **If no ingredients, check nutrition facts**:
   - Give a simple nutritional overview
   - Highlight the most relevant nutritional aspects
4. **If you can't read the image**: Be honest and suggest retaking the photo

Your summary should sound like a helpful friend explaining what they see. Use phrases like:
- "This looks like..."
- "The main thing to know is..."
- "You might want to know that..."
- "Here's what stands out..."
- "Good to know about..."

For highlights, explain ingredients in a way that helps someone make informed choices without stress.

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
    const { output } = await highlightConcerningIngredientsPrompt(input);
    return output!;
  }
);


async function highlightConcerningIngredients(
  input: HighlightConcerningIngredientsInput
): Promise<HighlightConcerningIngredientsOutput> {
  return highlightConcerningIngredientsFlow(input);
}


// --- End of logic moved from highlight-concerning-ingredients.ts ---


// --- Chat with AI using Gemini ---

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to send to the AI.'),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']).describe('The role of the message sender.'),
        content: z.string().describe('The message content.'),
      })
    )
    .optional()
    .describe('Previous conversation history for context.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a friendly and knowledgeable nutrition assistant specializing in food ingredients, nutrition, and healthy eating - like ChatGPT but focused on food and health.

Your role is to:
1. **Answer questions about ingredients** - Explain what they are, why they're used, potential concerns
2. **Provide nutrition advice** - Help users understand nutritional information and make informed choices
3. **Suggest healthier alternatives** - Recommend better options when asked
4. **Be conversational and supportive** - Use natural, friendly language without being preachy
5. **Stay on topic** - Focus on food, ingredients, nutrition, and health-related questions

Guidelines:
- Be helpful and encouraging, not alarmist
- Explain things in simple, everyday language
- Provide balanced, evidence-based information
- If asked about medical conditions, remind users to consult healthcare professionals
- If asked about topics outside food/nutrition, politely redirect to your area of expertise

{{#if conversationHistory}}
Previous conversation:
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}
{{/if}}

User: {{message}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);

async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

export async function sendChatMessage(
  message: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const result = await chatWithAI({
      message,
      conversationHistory,
    });
    return result.response;
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

// --- End of Chat with AI ---


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
