
"use client";

import { useAppContext } from "@/context/app-context";
import { PageHeader } from "@/components/page-header";
import { AnnualKpiCard } from "@/components/annual-report/annual-kpi-card";
import { MonthlyInputCard } from "@/components/annual-report/monthly-input-card";
import { DollarSign, TrendingDown, Building, Wallet } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

export default function AnnualReportPage() {
    const { annualData, periods, handlePeriodChange, feeConfig } = useAppContext();
    const { t } = useI18n();

    const kpiData = [
        { title: t("Total Revenue"), value: annualData.totalRevenue, icon: DollarSign },
        { title: t("Franchise Fees"), value: annualData.totalFranchiseFees, icon: TrendingDown },
        { title: t("Operating Costs"), value: annualData.totalOperatingCosts, icon: Building },
        { title: t("Net Take-Home"), value: annualData.totalNetTakeHome, icon: Wallet, isPrimary: true },
    ];
    
    return (
        <div>
            <PageHeader title={t("Annual Report")} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => (
                    <AnnualKpiCard key={kpi.title} {...kpi} />
                ))}
            </div>

            <div className="mt-8">
                <MonthlyInputCard 
                    periods={periods}
                    onPeriodChange={handlePeriodChange}
                    feeConfig={feeConfig}
                />
            </div>
        </div>
    )
}
