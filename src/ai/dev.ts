import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-cost-savings-flow.ts';
import '@/ai/flows/generate-target-sales-flow.ts';
import '@/ai/flows/suggest-focus-areas-flow.ts';
import '@/ai/flows/suggest-target-sales.ts';
import '@/ai/flows/suggest-cost-saving.ts';
import '@/ai/flows/suggest-focus-promotions.ts';