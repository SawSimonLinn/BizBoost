
export interface OtherExpense {
  id: string;
  name: string;
  amount: number;
}

export interface Period {
  id: string;
  name: string;
  weeklySales: number[];
  inventoryCost: number;
  otherExpenses: OtherExpense[];
}

export interface FeeConfig {
  royaltyPercent: number;
}

export interface StaffCost {
  id: string;
  employeeName: string;
  paymentType: 'hourly' | 'salary';
  hours?: number;
  wageRate?: number;
  salary?: number;
}

export interface PersonalExpense {
    id:string;
    name: string;
    amount: number;
}

export interface HistoricalData {
    name: string;
    Sales: number;
    "Gross Profit": number;
    "Net Profit": number;
}
