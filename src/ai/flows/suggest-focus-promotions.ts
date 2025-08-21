// src/ai/flows/suggest-focus-promotions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest focus promotional periods for franchisees based on their best-performing weeks.
 *
 * - suggestFocusPromotions - A function that suggests focus promotion periods to maximize sales.
 * - SuggestFocusPromotionsInput - The input type for the suggestFocusPromotions function.
 * - SuggestFocusPromotionsOutput - The return type for the suggestFocusPromotions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFocusPromotionsInputSchema = z.object({
  weeklySalesData: z
    .string()
    .describe(
      'A stringified JSON array containing historical weekly sales data, including sales, expenses, and promotional activities for each week.'
    ),
});
export type SuggestFocusPromotionsInput = z.infer<typeof SuggestFocusPromotionsInputSchema>;

const SuggestFocusPromotionsOutputSchema = z.object({
  focusPromotionsSuggestion: z
    .string()
    .describe(
      'A suggestion for the franchisee to focus promotional efforts, based on analysis of their best-performing weeks, to maximize sales.'
    ),
});
export type SuggestFocusPromotionsOutput = z.infer<typeof SuggestFocusPromotionsOutputSchema>;

export async function suggestFocusPromotions(input: SuggestFocusPromotionsInput): Promise<SuggestFocusPromotionsOutput> {
  return suggestFocusPromotionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFocusPromotionsPrompt',
  input: {schema: SuggestFocusPromotionsInputSchema},
  output: {schema: SuggestFocusPromotionsOutputSchema},
  prompt: `You are a business consultant specializing in franchise performance optimization.

  Analyze the historical weekly sales data provided to identify patterns and insights from the best-performing weeks.
  Suggest specific, actionable strategies the franchisee can implement to replicate the success of those periods and maximize sales by focusing promotions during those weeks.

  Weekly Sales Data: {{{weeklySalesData}}}
  `,
});

const suggestFocusPromotionsFlow = ai.defineFlow(
  {
    name: 'suggestFocusPromotionsFlow',
    inputSchema: SuggestFocusPromotionsInputSchema,
    outputSchema: SuggestFocusPromotionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
