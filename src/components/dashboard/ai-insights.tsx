"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { TargetSalesCard } from "./ai/target-sales-card"
import { CostSavingsCard } from "./ai/cost-savings-card"
import { FocusAreasCard } from "./ai/focus-areas-card"
import type { AnalyzeCostSavingsInput } from "@/ai/flows/analyze-cost-savings-flow"

interface AiInsightsProps {
  pastSalesData: string
  periodsData: string
  costAnalysisData: AnalyzeCostSavingsInput
}

export function AiInsights({ pastSalesData, periodsData, costAnalysisData }: AiInsightsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <Lightbulb className="text-accent" />
          <span>AI-Powered Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TargetSalesCard pastSalesData={pastSalesData} />
        <CostSavingsCard costAnalysisData={costAnalysisData} />
        <FocusAreasCard periodsData={periodsData} />
      </CardContent>
    </Card>
  )
}
