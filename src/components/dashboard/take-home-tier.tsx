"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

interface TakeHomeTierProps {
  currentTakeHome: number
  tiers: { low: number; good: number; best: number }
}

export function TakeHomeTier({ currentTakeHome, tiers }: TakeHomeTierProps) {
  const getTierInfo = () => {
    if (currentTakeHome >= tiers.best) {
      return { label: "Best", textClass: "text-success", progressClass: "bg-success", progress: 100 }
    }
    if (currentTakeHome >= tiers.good) {
      return { label: "Good", textClass: "text-primary", progressClass: "bg-primary", progress: 66 }
    }
    if (currentTakeHome >= tiers.low) {
      return { label: "Low", textClass: "text-warning", progressClass: "bg-warning", progress: 33 }
    }
    return { label: "Below Low", textClass: "text-destructive", progressClass: "bg-destructive", progress: 10 }
  }

  const { label, textClass, progressClass, progress } = getTierInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Take-Home Tier</CardTitle>
        <CardDescription>
          Your current take-home pay is <span className={cn("font-bold", textClass)}>{label}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-3" indicatorClassName={progressClass} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(tiers.low)}</span>
            <span>{formatCurrency(tiers.good)}</span>
            <span>{formatCurrency(tiers.best)}+</span>
        </div>
      </CardContent>
    </Card>
  )
}
