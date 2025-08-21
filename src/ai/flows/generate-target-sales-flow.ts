'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating target sales figures based on past sales data and desired take-home pay.
 *
 * - generateTargetSales - A function that initiates the target sales generation process.
 * - GenerateTargetSalesInput - The input type for the generateTargetSales function.
 * - GenerateTargetSalesOutput - The return type for the generateTargetSales function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTargetSalesInputSchema = z.object({
  pastSalesData: z
    .string()
    .describe('Historical sales data, preferably as a CSV string.'),
  desiredTakeHomePay: z
    .number()
    .describe('The desired take-home pay for the franchisee.'),
});
export type GenerateTargetSalesInput = z.infer<typeof GenerateTargetSalesInputSchema>;

const GenerateTargetSalesOutputSchema = z.object({
  targetSales: z
    .number()
    .describe(
      'The suggested target sales figure to reach the desired take-home pay.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of how the target sales figure was derived from the input data.'
    ),
});
export type GenerateTargetSalesOutput = z.infer<typeof GenerateTargetSalesOutputSchema>;

export async function generateTargetSales(
  input: GenerateTargetSalesInput
): Promise<GenerateTargetSalesOutput> {
  return generateTargetSalesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTargetSalesPrompt',
  input: {schema: GenerateTargetSalesInputSchema},
  output: {schema: GenerateTargetSalesOutputSchema},
  prompt: `You are an AI assistant designed to help franchisees set realistic sales goals.

  Analyze the following past sales data and suggest a target sales figure to reach the desired take-home pay. Provide a brief explanation of your reasoning.

  Past Sales Data: {{{pastSalesData}}}
  Desired Take-Home Pay: {{desiredTakeHomePay}}
  
  Consider factors such as seasonality, trends, and any other relevant information in the sales data.
  Output the target sales value and the reasoning behind the value.`,
});

const generateTargetSalesFlow = ai.defineFlow(
  {
    name: 'generateTargetSalesFlow',
    inputSchema: GenerateTargetSalesInputSchema,
    outputSchema: GenerateTargetSalesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
