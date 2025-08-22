"use client";

import { useAppContext } from "@/context/app-context";
import { PageHeader } from "@/components/page-header";
import { PayoutSplit } from "@/components/dashboard/payout-split";
import { TakeHomeTier } from "@/components/dashboard/take-home-tier";
import { FeeBreakdownChart } from "@/components/dashboard/fee-breakdown-chart";
import { useI18n } from "@/context/i18n-context";

export default function FinancialBreakdownPage() {
  const {
    franchisorCut,
    ownerCut,
    netEarningsAfterStaff,
    royaltyFee,
    staffCost,
    inventoryCostValue,
    totalOtherExpenses,
  } = useAppContext();
  const { t } = useI18n();

  const takeHomeTiers = { low: 5000, good: 10000, best: 15000 };

  const feeData = [
    { name: t("Royalty Fee"), value: royaltyFee, fill: "var(--chart-1)" },
    { name: t("Staff Cost"), value: staffCost, fill: "var(--chart-4)" },
    { name: t("Inventory"), value: inventoryCostValue, fill: "var(--chart-2)" },
    { name: t("Other"), value: totalOtherExpenses, fill: "var(--chart-3)" },
  ];

  return (
    <div>
      <PageHeader title="Financial Breakdown" />
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PayoutSplit franchisorCut={franchisorCut} ownerCut={ownerCut} />
          </div>
          <div>
            <FeeBreakdownChart data={feeData} />
          </div>
        </div>
        <div>
          <TakeHomeTier
            currentTakeHome={netEarningsAfterStaff}
            tiers={takeHomeTiers}
          />
        </div>
      </div>
    </div>
  );
}
