"use client"

import { TakeHomeCalculator } from "@/components/dashboard/take-home-calculator";
import { useAppContext } from "@/context/app-context";

export default function PersonalFinancesPage() {
    const { netEarningsAfterStaff, personalExpenses, setPersonalExpenses } = useAppContext();

    return (
        <div>
            <h1 className="text-2xl font-bold font-headline text-foreground mb-4">
                Personal Finances
            </h1>
            <TakeHomeCalculator 
                netEarnings={netEarningsAfterStaff}
                personalExpenses={personalExpenses}
                setPersonalExpenses={setPersonalExpenses}
                asCard={false}
            />
        </div>
    )
}
