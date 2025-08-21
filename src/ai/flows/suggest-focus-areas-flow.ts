'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest focus areas for franchisees based on their best-performing periods.
 *
 * - suggestFocusAreas - A function that suggests focus areas to maximize sales.
 * - SuggestFocusAreasInput - The input type for the suggestFocusAreas function.
 * - SuggestFocusAreasOutput - The return type for the suggestFocusAreas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFocusAreasInputSchema = z.object({
  periodsData: z
    .string()
    .describe(
      'A stringified JSON array containing historical periods data, including sales, expenses, and promotional activities for each period.'
    ),
});
export type SuggestFocusAreasInput = z.infer<typeof SuggestFocusAreasInputSchema>;

const SuggestFocusAreasOutputSchema = z.object({
  focusAreaSuggestion: z
    .string()
    .describe(
      'A suggestion for the franchisee to focus on, based on analysis of their best-performing periods, to maximize sales.'
    ),
});
export type SuggestFocusAreasOutput = z.infer<typeof SuggestFocusAreasOutputSchema>;

export async function suggestFocusAreas(input: SuggestFocusAreasInput): Promise<SuggestFocusAreasOutput> {
  return suggestFocusAreasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFocusAreasPrompt',
  input: {schema: SuggestFocusAreasInputSchema},
  output: {schema: SuggestFocusAreasOutputSchema},
  prompt: `You are a business consultant specializing in franchise performance optimization.

  Analyze the historical periods data provided to identify patterns and insights from the best-performing periods.
  Suggest specific, actionable strategies the franchisee can implement to replicate the success of those periods and maximize sales.

  Periods Data: {{{periodsData}}}
  `,
});

const suggestFocusAreasFlow = ai.defineFlow(
  {
    name: 'suggestFocusAreasFlow',
    inputSchema: SuggestFocusAreasInputSchema,
    outputSchema: SuggestFocusAreasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
