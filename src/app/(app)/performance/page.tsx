
"use client";

import { useAppContext } from "@/context/app-context";
import { PerformanceKpiCard } from "@/components/performance/performance-kpi-card";
import { SalesProfitTrendChart } from "@/components/performance/sales-profit-trend-chart";
import { FeeBreakdownChart } from "@/components/dashboard/fee-breakdown-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Users, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";


export default function PerformancePage() {
    const { 
        totalSales,
        netEarningsAfterStaff,
        grossProfit,
        grossMargin,
        netMargin,
        staffCost,
        staffCosts,
        royaltyFee,
        totalOtherExpenses,
        activePeriod,
        historicalData
    } = useAppContext();

    const staffCostPercent = totalSales > 0 ? (staffCost / totalSales) * 100 : 0;
    const salesPerEmployee = staffCosts.length > 0 ? totalSales / staffCosts.length : 0;

    const feeData = [
        { name: 'Royalty Fee', value: royaltyFee, fill: 'var(--chart-1)' },
        { name: 'Staff Cost', value: staffCost, fill: 'var(--chart-4)' },
        { name: 'Inventory', value: activePeriod.inventoryCost, fill: 'var(--chart-2)' },
        { name: 'Other', value: totalOtherExpenses, fill: 'var(--chart-3)' },
    ];
    
    return (
        <div>
            <PageHeader title="Performance Analytics" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PerformanceKpiCard title="Gross Profit" value={grossProfit} format="currency" icon={DollarSign} />
                <PerformanceKpiCard title="Net Profit" value={netEarningsAfterStaff} format="currency" icon={Wallet} />
                <PerformanceKpiCard title="Gross Margin" value={grossMargin} format="percent" icon={Percent} />
                <PerformanceKpiCard title="Net Margin" value={netMargin} format="percent" icon={TrendingUp} />
                <PerformanceKpiCard title="Staff Cost %" value={staffCostPercent} format="percent" icon={TrendingDown} />
                <PerformanceKpiCard title="Sales per Employee" value={salesPerEmployee} format="currency" icon={Users} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <SalesProfitTrendChart data={historicalData} />
                </div>
                <div>
                     <FeeBreakdownChart data={feeData} />
                </div>
            </div>
        </div>
    )
}
