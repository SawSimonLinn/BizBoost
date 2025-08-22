import type { Period, FeeConfig, StaffCost, PersonalExpense } from "@/types";

const generatePeriods = () => {
  const periods: Period[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const monthConfigs = [
    { name: "January", weeks: 4 },
    { name: "February", weeks: 4 },
    { name: "March", weeks: 5 },
    { name: "April", weeks: 4 },
    { name: "May", weeks: 4 },
    { name: "June", weeks: 5 },
    { name: "July", weeks: 4 },
    { name: "August", weeks: 4 },
    { name: "September", weeks: 5 },
    { name: "October", weeks: 4 },
    { name: "November", weeks: 4 },
    { name: "December", weeks: 5 },
  ];
  const currentYear = today.getFullYear();

  monthConfigs.forEach((month, index) => {
    if (index <= currentMonth) {
      const newPeriod: Period = {
        id: `period-${index + 1}`,
        name: `${month.name} ${currentYear}`,
        weeklySales: Array(month.weeks).fill(0),
        inventoryCost: 0,
        inventoryCostType: "amount",
        otherExpenses: [],
      };
      periods.push(newPeriod);
    }
  });

  // Set the latest month as active by default, and give it some mock data
  if (periods.length > 0) {
    const latestPeriod = periods[periods.length - 1];
    const monthIndex = new Date().getMonth();
    latestPeriod.weeklySales = latestPeriod.weeklySales.map(
      (_, weekIndex) => 5000 + monthIndex * 500 + weekIndex * 100
    );
    latestPeriod.inventoryCost = 22;
    latestPeriod.inventoryCostType = "percent";
  }

  return periods;
};

export const mockPeriods: Period[] = generatePeriods();

export const mockFeeConfig: FeeConfig = {
  royaltyPercent: 36,
};

export const mockStaffCosts: StaffCost[] = [
  {
    id: "staff-1",
    employeeName: "John Doe",
    paymentType: "hourly",
    hours: 160,
    wageRate: 20,
  },
  {
    id: "staff-2",
    employeeName: "Jane Smith",
    paymentType: "salary",
    salary: 4500,
  },
];

export const mockPersonalExpenses: PersonalExpense[] = [
  { id: "exp-1", name: "Rent/Mortgage", amount: 2000 },
  { id: "exp-2", name: "Car Loan", amount: 450 },
  { id: "exp-3", name: "Groceries", amount: 800 },
  { id: "exp-4", name: "Utilities", amount: 300 },
];
