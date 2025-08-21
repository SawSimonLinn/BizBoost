"use client"

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface FeeBreakdownChartProps {
  data: { name: string; value: number; fill: string }[]
}

const chartConfig = {
  value: {
    label: "Value",
  },
  royalty: {
    label: "Royalty Fee",
    color: "hsl(var(--chart-1))",
  },
  inventory: {
    label: "Inventory",
    color: "hsl(var(--chart-2))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-3))",
  },
  staff: {
    label: "Staff Cost",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function FeeBreakdownChart({ data }: FeeBreakdownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Fee & Cost Breakdown</CardTitle>
        <CardDescription>A visual breakdown of your major expenses for the period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend
                content={({ payload }) => {
                  return (
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm text-muted-foreground">
                      {payload?.map((item) => (
                        <li key={item.value} className="flex items-center gap-2">
                           <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                           {item.value}
                        </li>
                      ))}
                    </ul>
                  )
                }}
              />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
