
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface AnnualKpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  isPrimary?: boolean;
}

export function AnnualKpiCard({ title, value, icon: Icon, isPrimary = false }: AnnualKpiCardProps) {
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
      </CardContent>
    </Card>
  )
}
