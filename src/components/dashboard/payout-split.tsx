
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useI18n } from "@/context/i18n-context"

interface PayoutSplitProps {
  franchisorCut: number
  ownerCut: number
}

export function PayoutSplit({ franchisorCut, ownerCut }: PayoutSplitProps) {
  const { t } = useI18n();
  const total = franchisorCut + ownerCut;
  const franchisorPercentage = total > 0 ? (franchisorCut / total) * 100 : 0;
  const ownerPercentage = total > 0 ? (ownerCut / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('Revenue Split')}</CardTitle>
        <CardDescription>
          {t("Here's the breakdown of revenue between your take-home and business expenses.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full h-12 rounded-full overflow-hidden bg-muted">
          <div 
            className="bg-accent h-full flex items-center justify-center text-accent-foreground font-bold" 
            style={{ width: `${franchisorPercentage}%`}}
            title={`${t('Business Expenses & Fees')}: ${franchisorPercentage.toFixed(1)}%`}
          >
            {franchisorPercentage > 10 && `${franchisorPercentage.toFixed(1)}%`}
          </div>
          <div 
            className="bg-primary h-full flex items-center justify-center text-primary-foreground font-bold" 
            style={{ width: `${ownerPercentage}%`}}
            title={`${t('You Keep')}: ${ownerPercentage.toFixed(1)}%`}
          >
            {ownerPercentage > 10 && `${ownerPercentage.toFixed(1)}%`}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-accent/10">
            <div className="flex items-center gap-2 text-accent font-semibold">
              <TrendingDown className="h-4 w-4" />
              <span>{t('Business Expenses & Fees')}</span>
            </div>
            <p className="text-xl font-bold mt-1 text-accent">{formatCurrency(franchisorCut)}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <TrendingUp className="h-4 w-4" />
              <span>{t('You Keep')}</span>
            </div>
            <p className="text-xl font-bold mt-1 text-primary">{formatCurrency(ownerCut)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
