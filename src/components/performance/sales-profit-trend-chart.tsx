
"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, Legend, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { HistoricalData } from "@/types"

const chartConfig = {
    Sales: {
        label: "Sales",
        color: "hsl(var(--chart-1))",
    },
    "Gross Profit": {
        label: "Gross Profit",
        color: "hsl(var(--chart-2))",
    },
    "Net Profit": {
        label: "Net Profit",
        color: "hsl(var(--chart-4))",
    },
}

interface SalesProfitTrendChartProps {
  data: HistoricalData[];
}

export function SalesProfitTrendChart({ data }: SalesProfitTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales & Profit Trend</CardTitle>
        <CardDescription>
          Monthly trend of your key financial metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
                tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="Sales" stroke="var(--color-Sales)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Gross Profit" stroke="var(--color-Gross Profit)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Net Profit" stroke="var(--color-Net Profit)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
