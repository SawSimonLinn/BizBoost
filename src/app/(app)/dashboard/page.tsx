
"use client";

import {
  DollarSign,
  TrendingDown,
  Building,
  Wallet,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { FeeBreakdownChart } from '@/components/dashboard/fee-breakdown-chart';
import { PayoutSplit } from '@/components/dashboard/payout-split';
import { TakeHomeTier } from '@/components/dashboard/take-home-tier';
import { StaffScheduler } from '@/components/dashboard/staff-scheduler';
import { AiInsights } from '@/components/dashboard/ai-insights';
import { FeeConfigurator } from '@/components/dashboard/fee-configurator';
import { TakeHomeCalculator } from '@/components/dashboard/take-home-calculator';
import { useAppContext } from '@/context/app-context';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const {
    periods,
    activePeriod,
    setActivePeriodId,
    feeConfig,
    handleFeeConfigChange,
    staffCosts,
    setStaffCosts,
    personalExpenses,
    setPersonalExpenses,
    handlePeriodChange,
    totalSales,
    royaltyFee,
    staffCost,
    totalOtherExpenses,
    netTakeHome,
    franchisorCut,
    ownerCut,
    netEarningsAfterStaff
  } = useAppContext();

  const kpiData = {
    revenue: totalSales,
    franchiseFees: royaltyFee + totalOtherExpenses,
    operatingCosts: activePeriod.inventoryCost,
    netTakeHome: netTakeHome,
  };

  const feeData = [
    { name: 'Royalty Fee', value: royaltyFee, fill: 'var(--chart-1)' },
    { name: 'Staff Cost', value: staffCost, fill: 'var(--chart-4)' },
    { name: 'Inventory', value: activePeriod.inventoryCost, fill: 'var(--chart-2)' },
    { name: 'Other', value: totalOtherExpenses, fill: 'var(--chart-3)' },
  ];

  const takeHomeTiers = { low: 5000, good: 10000, best: 15000 };
  
  const pastSalesForAI = "Month 1: $30000, Month 2: $32000, Month 3: $28000";
  const periodsDataForAI = JSON.stringify([
      { period: "Week 1", sales: 7000, promotions: "20% off", result: "average" },
      { period: "Week 2", sales: 9500, promotions: "BOGO", result: "best" },
      { period: "Week 3", sales: 6500, promotions: "none", result: "low" },
  ]);
  const costAnalysisDataForAI = {
      revenue: totalSales,
      franchiseFee: royaltyFee,
      marketingFee: 0,
      techFee: 0,
      staffCost,
      inventoryCost: activePeriod.inventoryCost,
      otherExpenses: JSON.stringify(activePeriod.otherExpenses),
      periodsAnalyzed: 3,
  };

  return (
    <>
      <DashboardHeader 
        periods={periods}
        activePeriod={activePeriod}
        onSetActivePeriod={setActivePeriodId}
      />

      <main className="mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Revenue" value={kpiData.revenue} icon={DollarSign} trend="up" />
          <KpiCard title="Franchise Fees" value={kpiData.franchiseFees} icon={TrendingDown} trend="down" />
          <KpiCard title="Operating Costs" value={kpiData.operatingCosts} icon={Building} trend="down" />
          <KpiCard title="Net Take-Home" value={kpiData.netTakeHome} icon={Wallet} trend="up" isPrimary />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             <FeeConfigurator 
                feeConfig={feeConfig} 
                onFeeChange={handleFeeConfigChange} 
                activePeriod={activePeriod}
                onPeriodChange={handlePeriodChange}
                totalSales={totalSales}
              />
            <PayoutSplit franchisorCut={franchisorCut} ownerCut={ownerCut} />
            <TakeHomeTier currentTakeHome={netEarningsAfterStaff} tiers={takeHomeTiers} />
            <StaffScheduler staffCosts={staffCosts} setStaffCosts={setStaffCosts} />
          </div>

          <div className="space-y-8">
            <FeeBreakdownChart data={feeData} />
             <TakeHomeCalculator
                netEarnings={netEarningsAfterStaff}
                personalExpenses={personalExpenses}
                setPersonalExpenses={setPersonalExpenses}
              />
          </div>
        </div>
        
        <AiInsights 
          pastSalesData={pastSalesForAI}
          periodsData={periodsDataForAI}
          costAnalysisData={costAnalysisDataForAI}
        />
      </main>
    </>
  );
}
