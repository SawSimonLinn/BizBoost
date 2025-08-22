import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useI18n } from "@/context/i18n-context"

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: "up" | "down";
  isPrimary?: boolean;
}

export function KpiCard({ title, value, icon: Icon, trend, isPrimary = false }: KpiCardProps) {
  const { t } = useI18n();
  return (
    <Card className={cn(
      "relative overflow-hidden",
      isPrimary ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", isPrimary ? "text-primary-foreground/70" : "text-muted-foreground")} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">
          {formatCurrency(value)}
        </div>
        <div className={cn("text-xs flex items-center gap-1", isPrimary ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {trend === "up" ?
            <ArrowUp className="h-3 w-3 text-success" /> :
            <ArrowDown className="h-3 w-3 text-destructive" />
          }
          <span>{t('vs last period')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
