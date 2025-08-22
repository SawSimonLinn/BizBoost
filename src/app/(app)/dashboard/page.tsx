"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingDown,
  Building,
  Wallet,
  LayoutGrid,
  BarChart,
  Lightbulb,
  Landmark,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { FeeBreakdownChart } from "@/components/dashboard/fee-breakdown-chart";
import { PayoutSplit } from "@/components/dashboard/payout-split";
import { StaffScheduler } from "@/components/dashboard/staff-scheduler";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { FeeConfigurator } from "@/components/dashboard/fee-configurator";
import { TakeHomeCalculator } from "@/components/dashboard/take-home-calculator";
import { useAppContext } from "@/context/app-context";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";
import { useI18n } from "@/context/i18n-context";

const WELCOME_MODAL_SEEN_KEY = "bizboost_welcomeModalSeen";

export default function DashboardPage() {
  const { t } = useI18n();
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
    inventoryCostValue,
    staffCost,
    totalOtherExpenses,
    netTakeHome,
    franchisorCut,
    ownerCut,
    netEarningsAfterStaff,
  } = useAppContext();

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = React.useState(false);

  React.useEffect(() => {
    const hasSeenModal = localStorage.getItem(WELCOME_MODAL_SEEN_KEY);
    if (!hasSeenModal) {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const handleWelcomeModalClose = () => {
    localStorage.setItem(WELCOME_MODAL_SEEN_KEY, "true");
    setIsWelcomeModalOpen(false);
  };

  const kpiData = {
    revenue: totalSales,
    franchiseFees: royaltyFee,
    operatingCosts: inventoryCostValue + totalOtherExpenses,
    netTakeHome: netTakeHome,
  };

  const feeData = [
    { name: t("Royalty Fee"), value: royaltyFee, fill: "var(--chart-1)" },
    { name: t("Staff Cost"), value: staffCost, fill: "var(--chart-4)" },
    { name: t("Inventory"), value: inventoryCostValue, fill: "var(--chart-2)" },
    { name: t("Other"), value: totalOtherExpenses, fill: "var(--chart-3)" },
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
    inventoryCost: inventoryCostValue,
    otherExpenses: JSON.stringify(activePeriod.otherExpenses),
    periodsAnalyzed: 3,
  };

  return (
    <>
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={handleWelcomeModalClose}
        activePeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        feeConfig={feeConfig}
        onFeeChange={handleFeeConfigChange}
        totalSales={totalSales}
      />
      <DashboardHeader
        periods={periods}
        activePeriod={activePeriod}
        onSetActivePeriod={setActivePeriodId}
      />

      <main className="mt-8 space-y-8">
        {/* Section 1: Core Performance & Input */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <LayoutGrid className="h-5 w-5" />
            Net Deposit After Company Deductions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                <KpiCard
                  title={t("Total Revenue")}
                  value={kpiData.revenue}
                  icon={DollarSign}
                  trend="up"
                />
                <KpiCard
                  title={t("Franchise Fees")}
                  value={kpiData.franchiseFees}
                  icon={TrendingDown}
                  trend="down"
                />
                <KpiCard
                  title={t("Operating Costs")}
                  value={kpiData.operatingCosts}
                  icon={Building}
                  trend="down"
                />
                <KpiCard
                  title={t("Net Take-Home")}
                  value={kpiData.netTakeHome}
                  icon={Wallet}
                  trend="up"
                  isPrimary
                />
              </div>
            </div>
            <FeeConfigurator
              feeConfig={feeConfig}
              onFeeChange={handleFeeConfigChange}
              activePeriod={activePeriod}
              onPeriodChange={handlePeriodChange}
              totalSales={totalSales}
            />
          </div>
        </section>

        {/* Section 2: Business Expenses */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <Landmark className="h-5 w-5" />
            Business Expenses
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PayoutSplit franchisorCut={franchisorCut} ownerCut={ownerCut} />
              <StaffScheduler
                staffCosts={staffCosts}
                setStaffCosts={setStaffCosts}
              />
            </div>
            <div className="space-y-8">
              <FeeBreakdownChart data={feeData} />
            </div>
          </div>
        </section>

        {/* Section 3: Personal & AI Insights */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            Personal & AI Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TakeHomeCalculator
                netEarnings={netEarningsAfterStaff}
                personalExpenses={personalExpenses}
                setPersonalExpenses={setPersonalExpenses}
              />
            </div>
            <div className="lg:col-span-2">
              <AiInsights
                pastSalesData={pastSalesForAI}
                periodsData={periodsDataForAI}
                costAnalysisData={costAnalysisDataForAI}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
