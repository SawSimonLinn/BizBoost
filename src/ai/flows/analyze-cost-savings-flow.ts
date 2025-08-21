'use server';
/**
 * @fileOverview Analyzes expense data to identify potential cost-saving opportunities.
 *
 * - analyzeCostSavings - A function that analyzes expense data and provides cost-saving suggestions.
 * - AnalyzeCostSavingsInput - The input type for the analyzeCostSavings function.
 * - AnalyzeCostSavingsOutput - The return type for the analyzeCostSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCostSavingsInputSchema = z.object({
  revenue: z.number().describe('The total revenue for the period.'),
  franchiseFee: z.number().describe('The franchise fee for the period.'),
  marketingFee: z.number().describe('The marketing fee for the period.'),
  techFee: z.number().describe('The technology fee for the period.'),
  staffCost: z.number().describe('The total staff cost for the period.'),
  inventoryCost: z.number().describe('The total inventory cost for the period.'),
  otherExpenses: z.string().describe('Any other expenses for the period.'),
  periodsAnalyzed: z.number().describe('The number of past periods to analyze'),
});
export type AnalyzeCostSavingsInput = z.infer<typeof AnalyzeCostSavingsInputSchema>;

const AnalyzeCostSavingsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of potential cost-saving opportunities, such as reducing staff costs or renegotiating fees, formatted as an HTML unordered list.'
    ),
});
export type AnalyzeCostSavingsOutput = z.infer<typeof AnalyzeCostSavingsOutputSchema>;

export async function analyzeCostSavings(
  input: AnalyzeCostSavingsInput
): Promise<AnalyzeCostSavingsOutput> {
  return analyzeCostSavingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCostSavingsPrompt',
  input: {schema: AnalyzeCostSavingsInputSchema},
  output: {schema: AnalyzeCostSavingsOutputSchema},
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

Your response should be an HTML unordered list (<ul>) with each suggestion as a list item (<li>). Do not include any other text or explanation outside of the list.`,
});

const analyzeCostSavingsFlow = ai.defineFlow(
  {
    name: 'analyzeCostSavingsFlow',
    inputSchema: AnalyzeCostSavingsInputSchema,
    outputSchema: AnalyzeCostSavingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
