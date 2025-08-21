'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting a target sales amount needed to reach a specific take-home goal.
 *
 * - suggestTargetSales - A function that suggests a target sales amount based on desired take-home pay.
 * - SuggestTargetSalesInput - The input type for the suggestTargetSales function.
 * - SuggestTargetSalesOutput - The return type for the suggestTargetSales function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTargetSalesInputSchema = z.object({
  pastSalesData: z
    .string()
    .describe('Historical sales data, preferably as a CSV string.'),
  desiredTakeHomePay: z
    .number()
    .describe('The desired take-home pay for the franchisee.'),
  currentSales: z.number().describe('The current sales for the franchisee.'),
});
export type SuggestTargetSalesInput = z.infer<typeof SuggestTargetSalesInputSchema>;

const SuggestTargetSalesOutputSchema = z.object({
  targetSalesSuggestion: z
    .number()
    .describe(
      'A suggestion for the franchisee to target sales, based on analysis of their sales and desired take home pay, to maximize sales.'
    ),
});
export type SuggestTargetSalesOutput = z.infer<typeof SuggestTargetSalesOutputSchema>;

export async function suggestTargetSales(
  input: SuggestTargetSalesInput
): Promise<SuggestTargetSalesOutput> {
  return suggestTargetSalesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTargetSalesPrompt',
  input: {schema: SuggestTargetSalesInputSchema},
  output: {schema: SuggestTargetSalesOutputSchema},
  prompt: `You are a business consultant specializing in franchise performance optimization.

  Analyze the historical sales data and current sales data provided to suggest a target sales to achieve the desired take home pay.

  Past Sales Data: {{{pastSalesData}}}
  Desired Take-Home Pay: {{desiredTakeHomePay}}
  Current Sales: {{currentSales}}
  `,
});

const suggestTargetSalesFlow = ai.defineFlow(
  {
    name: 'suggestTargetSalesFlow',
    inputSchema: SuggestTargetSalesInputSchema,
    outputSchema: SuggestTargetSalesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
