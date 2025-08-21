
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PerformanceKpiCardProps {
  title: string;
  value: number;
  format: "currency" | "percent" | "number";
  icon: LucideIcon;
}

export function PerformanceKpiCard({ title, value, format, icon: Icon }: PerformanceKpiCardProps) {
  const formattedValue = () => {
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percent":
        return `${value.toFixed(2)}%`;
      case "number":
        return value.toLocaleString();
      default:
        return value;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue()}</div>
        <p className="text-xs text-muted-foreground">vs. last period</p>
      </CardContent>
    </Card>
  );
}
