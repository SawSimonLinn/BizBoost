
"use client"

import { TakeHomeCalculator } from "@/components/dashboard/take-home-calculator";
import { PageHeader } from "@/components/page-header";
import { useAppContext } from "@/context/app-context";

export default function PersonalFinancesPage() {
    const { netEarningsAfterStaff, personalExpenses, setPersonalExpenses } = useAppContext();

    return (
        <div>
            <PageHeader title="Personal Finances" />
            <TakeHomeCalculator 
                netEarnings={netEarningsAfterStaff}
                personalExpenses={personalExpenses}
                setPersonalExpenses={setPersonalExpenses}
                asCard={false}
            />
        </div>
    )
}
