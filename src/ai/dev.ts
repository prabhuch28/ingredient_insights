import { config } from 'dotenv';
config();

import '@/ai/flows/highlight-concerning-ingredients.ts';
import '@/ai/flows/generate-concise-summary.ts';
import '@/ai/flows/explain-ingredient-significance.ts';
import '@/ai/flows/add-confidence-scores.ts';