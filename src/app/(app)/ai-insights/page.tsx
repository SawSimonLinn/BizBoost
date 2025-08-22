
"use client"

import { AiInsights } from "@/components/dashboard/ai-insights";
import { PageHeader } from "@/components/page-header";
import { useAppContext } from "@/context/app-context";

export default function AiInsightsPage() {
    const { totalSales, royaltyFee, staffCost, activePeriod } = useAppContext();

    const pastSalesForAI = "Month 1: $30000, Month 2: $32000, Month 3: $28000";
    const periodsDataForAI = JSON.stringify([
        { period: "Week 1", sales: 7000, promotions: "20% off", result: "average" },
        { period: "Week 2", sales: 9500, promotions: "BOGO", result: "best" },
        { period: "Week 3", sales: 6500, promotions: "none", result: "low" },
    ]);
    const costAnalysisDataForAI = {
        revenue: totalSales,
        franchiseFee: royaltyFee,
        marketingFee: 0,
        techFee: 0,
        staffCost,
        inventoryCost: activePeriod.inventoryCost,
        otherExpenses: JSON.stringify(activePeriod.otherExpenses),
        periodsAnalyzed: 3,
    };


    return (
         <div>
            <PageHeader title="AI-Powered Insights" />
            <AiInsights 
              pastSalesData={pastSalesForAI}
              periodsData={periodsDataForAI}
              costAnalysisData={costAnalysisDataForAI}
            />
        </div>
    )
}
