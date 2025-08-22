"use client";

import * as React from "react";
import type {
  Period,
  FeeConfig,
  StaffCost,
  PersonalExpense,
  HistoricalData,
  User,
} from "@/types";
import {
  mockPeriods,
  mockFeeConfig,
  mockStaffCosts,
  mockPersonalExpenses,
} from "@/lib/data";

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
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
  handlePeriodChange: (
    periodId: string,
    field: keyof Period,
    value: any
  ) => void;
  handleFeeConfigChange: (field: keyof FeeConfig, value: number) => void;
  totalSales: number;
  totalOtherExpenses: number;
  royaltyFee: number;
  inventoryCostValue: number;
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

const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);

  const [periods, setPeriods] = React.useState<Period[]>(mockPeriods);
  const [activePeriodId, setActivePeriodId] = React.useState<string>(
    mockPeriods[mockPeriods.length - 1].id
  );
  const [feeConfig, setFeeConfig] = React.useState<FeeConfig>(mockFeeConfig);
  const [staffCosts, setStaffCosts] =
    React.useState<StaffCost[]>(mockStaffCosts);
  const [personalExpenses, setPersonalExpenses] =
    React.useState<PersonalExpense[]>(mockPersonalExpenses);

  React.useEffect(() => {
    setPeriods(getFromLocalStorage("bizboost_periods", mockPeriods));
    setActivePeriodId(
      getFromLocalStorage(
        "bizboost_activePeriodId",
        mockPeriods[mockPeriods.length - 1].id
      )
    );
    setFeeConfig(getFromLocalStorage("bizboost_feeConfig", mockFeeConfig));
    setStaffCosts(getFromLocalStorage("bizboost_staffCosts", mockStaffCosts));
    setPersonalExpenses(
      getFromLocalStorage("bizboost_personalExpenses", mockPersonalExpenses)
    );

    setTimeout(() => {
      const storedUser = localStorage.getItem("bizboost_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }, 500);

    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("bizboost_periods", JSON.stringify(periods));
    }
  }, [periods, isHydrated]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("bizboost_activePeriodId", activePeriodId);
    }
  }, [activePeriodId, isHydrated]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("bizboost_feeConfig", JSON.stringify(feeConfig));
    }
  }, [feeConfig, isHydrated]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("bizboost_staffCosts", JSON.stringify(staffCosts));
    }
  }, [staffCosts, isHydrated]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        "bizboost_personalExpenses",
        JSON.stringify(personalExpenses)
      );
    }
  }, [personalExpenses, isHydrated]);

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (pass === "password") {
          const newUser = { uid: Date.now().toString(), email };
          localStorage.setItem("bizboost_user", JSON.stringify(newUser));
          setUser(newUser);
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error("Invalid password"));
        }
      }, 1000);
    });
  };

  const signup = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { uid: Date.now().toString(), email };
        localStorage.setItem("bizboost_user", JSON.stringify(newUser));
        setUser(newUser);
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("bizboost_user");
      setUser(null);
      setLoading(false);
    }, 500);
  };

  const activePeriod =
    periods.find((p) => p.id === activePeriodId) || periods[periods.length - 1];

  const calculateMetricsForPeriod = (
    period: Period,
    config: FeeConfig,
    costs: StaffCost[]
  ) => {
    if (!period) {
      period = mockPeriods[mockPeriods.length - 1];
    }
    const totalSales = period.weeklySales.reduce(
      (acc, curr) => acc + (curr || 0),
      0
    );
    const royaltyFee = (totalSales * config.royaltyPercent) / 100;
    const totalOtherExpenses = period.otherExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    const inventoryCostValue =
      period.inventoryCostType === "percent"
        ? (totalSales * period.inventoryCost) / 100
        : period.inventoryCost;

    const staffCost = costs.reduce((acc, cost) => {
      if (cost.paymentType === "hourly") {
        return acc + (cost.hours ?? 0) * (cost.wageRate ?? 0);
      }
      return acc + (cost.salary ?? 0);
    }, 0);

    const netTakeHome =
      totalSales - royaltyFee - inventoryCostValue - totalOtherExpenses;
    const netEarningsAfterStaff = netTakeHome - staffCost;
    const grossProfit = totalSales - inventoryCostValue;
    const franchisorCut =
      royaltyFee + totalOtherExpenses + inventoryCostValue + staffCost;
    const ownerCut = totalSales - franchisorCut;

    return {
      totalSales,
      royaltyFee,
      totalOtherExpenses,
      inventoryCostValue,
      staffCost,
      netTakeHome,
      netEarningsAfterStaff,
      grossProfit,
      franchisorCut,
      ownerCut,
    };
  };

  const historicalData = React.useMemo(() => {
    return periods.map((period) => {
      const { totalSales, grossProfit, netEarningsAfterStaff } =
        calculateMetricsForPeriod(period, feeConfig, staffCosts);
      return {
        name: period.name.split(" ")[0],
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
    inventoryCostValue,
    staffCost,
    netTakeHome,
    franchisorCut,
    ownerCut,
    netEarningsAfterStaff,
    grossProfit,
  } = calculateMetricsForPeriod(activePeriod, feeConfig, staffCosts);

  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const netMargin =
    totalSales > 0 ? (netEarningsAfterStaff / totalSales) * 100 : 0;

  const handlePeriodChange = (
    periodId: string,
    field: keyof Period,
    value: any
  ) => {
    setPeriods((prev) =>
      prev.map((p) => (p.id === periodId ? { ...p, [field]: value } : p))
    );
  };

  const handleFeeConfigChange = (field: keyof FeeConfig, value: number) => {
    setFeeConfig((prev) => ({ ...prev, [field]: value }));
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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
    inventoryCostValue,
    staffCost,
    netTakeHome,
    franchisorCut,
    ownerCut,
    netEarningsAfterStaff,
    grossProfit,
    grossMargin,
    netMargin,
    historicalData,
  };

  if (!isHydrated) {
    const defaultContext = {
      ...value,
      periods: mockPeriods,
      activePeriod: mockPeriods[mockPeriods.length - 1],
      feeConfig: mockFeeConfig,
      staffCosts: mockStaffCosts,
      personalExpenses: mockPersonalExpenses,
      inventoryCostValue:
        mockPeriods[mockPeriods.length - 1].inventoryCostType === "percent"
          ? (mockPeriods[mockPeriods.length - 1].weeklySales.reduce(
              (a, b) => a + b,
              0
            ) *
              mockPeriods[mockPeriods.length - 1].inventoryCost) /
            100
          : mockPeriods[mockPeriods.length - 1].inventoryCost,
    };
    return (
      <AppContext.Provider value={defaultContext}>
        {children}
      </AppContext.Provider>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function useAuth() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  const { user, loading, login, signup, logout } = context;
  return { user, loading, login, signup, logout };
}
