'use server';
/**
 * @fileOverview Suggests cost-saving opportunities based on expense data.
 *
 * - suggestCostSaving - A function that analyzes expense data and provides cost-saving suggestions.
 * - SuggestCostSavingInput - The input type for the suggestCostSaving function.
 * - SuggestCostSavingOutput - The return type for the suggestCostSaving function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCostSavingInputSchema = z.object({
  revenue: z.number().describe('The total revenue for the period.'),
  franchiseFee: z.number().describe('The franchise fee for the period.'),
  marketingFee: z.number().describe('The marketing fee for the period.'),
  techFee: z.number().describe('The technology fee for the period.'),
  staffCost: z.number().describe('The total staff cost for the period.'),
  inventoryCost: z.number().describe('The total inventory cost for the period.'),
  otherExpenses: z.string().describe('Any other expenses for the period.'),
  periodsAnalyzed: z.number().describe('The number of past periods to analyze'),
});
export type SuggestCostSavingInput = z.infer<typeof SuggestCostSavingInputSchema>;

const SuggestCostSavingOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of potential cost-saving opportunities, such as reducing staff costs or renegotiating fees.'
    ),
});
export type SuggestCostSavingOutput = z.infer<typeof SuggestCostSavingOutputSchema>;

export async function suggestCostSaving(
  input: SuggestCostSavingInput
): Promise<SuggestCostSavingOutput> {
  return suggestCostSavingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCostSavingPrompt',
  input: {schema: SuggestCostSavingInputSchema},
  output: {schema: SuggestCostSavingOutputSchema},
  prompt: `You are a financial advisor for franchisees. Analyze the following expense data and identify potential cost-saving opportunities, such as reducing staff costs or renegotiating fees.

Revenue: {{revenue}}
Franchise Fee: {{franchiseFee}}
Marketing Fee: {{marketingFee}}
Tech Fee: {{techFee}}
Staff Cost: {{staffCost}}
Inventory Cost: {{inventoryCost}}
Other Expenses: {{otherExpenses}}

Based on the last {{periodsAnalyzed}} periods, what are some specific, actionable steps the franchisee can take to improve profitability? Focus on cost-saving measures.

Consider the impact of reducing staff costs, renegotiating fees, optimizing inventory, and other relevant factors. Provide clear and concise suggestions.

Your response should be a paragraph.`,
});

const suggestCostSavingFlow = ai.defineFlow(
  {
    name: 'suggestCostSavingFlow',
    inputSchema: SuggestCostSavingInputSchema,
    outputSchema: SuggestCostSavingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
