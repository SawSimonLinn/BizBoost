
"use client";

import * as React from 'react';
import type { Period, FeeConfig, StaffCost, PersonalExpense, HistoricalData } from '@/types';
import { mockPeriods, mockFeeConfig, mockStaffCosts, mockPersonalExpenses } from '@/lib/data';

interface AppContextType {
    periods: Period[];
    setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
    activePeriod: Period;
    setActivePeriodId: React.Dispatch<React.SetStateAction<string>>;
    feeConfig: FeeConfig;
    setFeeConfig: React.Dispatch<React.SetStateAction<FeeConfig>>;
    staffCosts: StaffCost[];
    setStaffCosts: React.Dispatch<React.SetStateAction<StaffCost[]>>;
    personalExpenses: PersonalExpense[];
    setPersonalExpenses: React.Dispatch<React.SetStateAction<PersonalExpense[]>>;
    handlePeriodChange: (periodId: string, field: keyof Period, value: any) => void;
    handleFeeConfigChange: (field: keyof FeeConfig, value: number) => void;
    totalSales: number;
    totalOtherExpenses: number;
    royaltyFee: number;
    staffCost: number;
    netTakeHome: number;
    franchisorCut: number;
    ownerCut: number;
    netEarningsAfterStaff: number;
    grossProfit: number;
    grossMargin: number;
    netMargin: number;
    historicalData: HistoricalData[];
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [periods, setPeriods] = React.useState<Period[]>(mockPeriods);
    const [activePeriodId, setActivePeriodId] = React.useState<string>(mockPeriods[mockPeriods.length - 1].id);
    const [feeConfig, setFeeConfig] = React.useState<FeeConfig>(mockFeeConfig);
    const [staffCosts, setStaffCosts] = React.useState<StaffCost[]>(mockStaffCosts);
    const [personalExpenses, setPersonalExpenses] = React.useState<PersonalExpense[]>(mockPersonalExpenses);

    const activePeriod = periods.find(p => p.id === activePeriodId) || periods[periods.length - 1];

    const calculateMetricsForPeriod = (period: Period, config: FeeConfig, costs: StaffCost[]) => {
        const totalSales = period.weeklySales.reduce((acc, curr) => acc + (curr || 0), 0);
        const royaltyFee = (totalSales * config.royaltyPercent) / 100;
        const totalOtherExpenses = period.otherExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        const staffCost = costs.reduce(
            (acc, cost) => {
                if (cost.paymentType === 'hourly') {
                    return acc + (cost.hours ?? 0) * (cost.wageRate ?? 0);
                }
                return acc + (cost.salary ?? 0);
            }, 0
        );

        const netTakeHome = totalSales - royaltyFee - period.inventoryCost - totalOtherExpenses;
        const netEarningsAfterStaff = netTakeHome - staffCost;
        const grossProfit = totalSales - period.inventoryCost;
        const franchisorCut = royaltyFee + totalOtherExpenses + period.inventoryCost + staffCost;
        const ownerCut = totalSales - franchisorCut;

        return {
            totalSales,
            royaltyFee,
            totalOtherExpenses,
            staffCost,
            netTakeHome,
            netEarningsAfterStaff,
            grossProfit,
            franchisorCut,
            ownerCut
        };
    };

    const historicalData = React.useMemo(() => {
        return periods.map(period => {
            const { totalSales, grossProfit, netEarningsAfterStaff } = calculateMetricsForPeriod(period, feeConfig, staffCosts);
            return {
                name: period.name.split(' ')[0], // e.g., "January"
                Sales: totalSales,
                "Gross Profit": grossProfit,
                "Net Profit": netEarningsAfterStaff,
            };
        });
    }, [periods, feeConfig, staffCosts]);

    const {
        totalSales,
        royaltyFee,
        totalOtherExpenses,
        staffCost,
        netTakeHome,
        franchisorCut,
        ownerCut,
        netEarningsAfterStaff,
        grossProfit
    } = calculateMetricsForPeriod(activePeriod, feeConfig, staffCosts);

    const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const netMargin = totalSales > 0 ? (netEarningsAfterStaff / totalSales) * 100 : 0;
    
    const handlePeriodChange = (periodId: string, field: keyof Period, value: any) => {
        setPeriods(prev => prev.map(p => p.id === periodId ? { ...p, [field]: value } : p));
    };
    
    const handleFeeConfigChange = (field: keyof FeeConfig, value: number) => {
        setFeeConfig(prev => ({...prev, [field]: value}));
    }

    const value = {
        periods,
        setPeriods,
        activePeriod,
        setActivePeriodId,
        feeConfig,
        setFeeConfig,
        staffCosts,
        setStaffCosts,
        personalExpenses,
        setPersonalExpenses,
        handlePeriodChange,
        handleFeeConfigChange,
        totalSales,
        totalOtherExpenses,
        royaltyFee,
        staffCost,
        netTakeHome,
        franchisorCut,
        ownerCut,
        netEarningsAfterStaff,
        grossProfit,
        grossMargin,
        netMargin,
        historicalData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
