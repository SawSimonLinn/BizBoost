"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FeeConfig, Period, OtherExpense } from "@/types";
import { FilePenLine, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "../ui/switch";

interface FeeConfiguratorProps {
  feeConfig: FeeConfig;
  onFeeChange: (field: keyof FeeConfig, value: number) => void;
  activePeriod: Period;
  onPeriodChange: (periodId: string, field: keyof Period, value: any) => void;
  totalSales: number;
}

const InputField = ({
  id,
  label,
  value,
  onChange,
  unit,
  type = "number",
  className,
  disabled = false,
}: {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  unit: string;
  type?: string;
  className?: string;
  disabled?: boolean;
}) => (
  <div className={cn("space-y-1", className)}>
    <Label htmlFor={id} className="text-xs font-medium">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-12 text-base font-semibold"
        disabled={disabled}
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
        {unit}
      </span>
    </div>
  </div>
);

export function FeeConfigurator({
  feeConfig,
  onFeeChange,
  activePeriod,
  onPeriodChange,
  totalSales,
}: FeeConfiguratorProps) {
  const [isWeeklySalesDialogOpen, setIsWeeklySalesDialogOpen] =
    React.useState(false);
  const [isFeesDialogOpen, setIsFeesDialogOpen] = React.useState(false);

  const [localWeeklySales, setLocalWeeklySales] = React.useState(
    activePeriod.weeklySales
  );
  const [localOtherExpenses, setLocalOtherExpenses] = React.useState<
    OtherExpense[]
  >(activePeriod.otherExpenses);
  const [newExpenseName, setNewExpenseName] = React.useState("");
  const [newExpenseAmount, setNewExpenseAmount] = React.useState("");

  React.useEffect(() => {
    setLocalWeeklySales(activePeriod.weeklySales);
    setLocalOtherExpenses(activePeriod.otherExpenses);
  }, [activePeriod]);

  const handleLocalWeeklySaleChange = (index: number, value: string) => {
    const newWeeklySales = [...localWeeklySales];
    const numericValue = value === "" ? 0 : parseFloat(value);

    if (isNaN(numericValue)) return;

    newWeeklySales[index] = numericValue;

    if (value === "") {
      setLocalWeeklySales(newWeeklySales);
      return;
    }

    const subsequentWeeks = newWeeklySales.slice(index + 1);
    if (
      subsequentWeeks.every(
        (val) =>
          val === 0 ||
          val === null ||
          val === undefined ||
          val === newWeeklySales[index - 1]
      )
    ) {
      for (let i = index + 1; i < newWeeklySales.length; i++) {
        if (
          newWeeklySales[i] === 0 ||
          newWeeklySales[i] === newWeeklySales[index - 1]
        ) {
          newWeeklySales[i] = numericValue;
        }
      }
    }
    setLocalWeeklySales(newWeeklySales);
  };

  const handleTotalSalesChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    const numWeeks = activePeriod.weeklySales.length;
    const evenSplit = numericValue / numWeeks;
    const newWeeklySales = Array(numWeeks).fill(evenSplit);
    onPeriodChange(activePeriod.id, "weeklySales", newWeeklySales);
  };

  const handleSaveWeeklySales = () => {
    onPeriodChange(activePeriod.id, "weeklySales", localWeeklySales);
    setIsWeeklySalesDialogOpen(false);
  };

  const handleCancelWeeklySales = () => {
    setLocalWeeklySales(activePeriod.weeklySales);
    setIsWeeklySalesDialogOpen(false);
  };

  const handleSaveFees = () => {
    onPeriodChange(activePeriod.id, "otherExpenses", localOtherExpenses);
    setIsFeesDialogOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpenseName && newExpenseAmount) {
      const newExpense: OtherExpense = {
        id: `oe-${Date.now()}`,
        name: newExpenseName,
        amount: parseFloat(newExpenseAmount),
      };
      setLocalOtherExpenses((prev) => [...prev, newExpense]);
      setNewExpenseName("");
      setNewExpenseAmount("");
    }
  };

  const handleUpdateExpense = (
    expenseId: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    setLocalOtherExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleRemoveExpense = (expenseId: string) => {
    setLocalOtherExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
  };

  const totalOtherExpenses = React.useMemo(() => {
    return activePeriod.otherExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
  }, [activePeriod.otherExpenses]);

  const handleTotalOtherExpensesChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    const newOtherExpenses: OtherExpense[] = [
      {
        id: `oe-misc-${Date.now()}`,
        name: "Miscellaneous Fees",
        amount: numericValue,
      },
    ];
    onPeriodChange(activePeriod.id, "otherExpenses", newOtherExpenses);
  };

  const handleInventoryCostTypeChange = (checked: boolean) => {
    onPeriodChange(
      activePeriod.id,
      "inventoryCostType",
      checked ? "percent" : "amount"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FilePenLine />
          Data Input & Fee Configuration
        </CardTitle>
        <CardDescription>
          Adjust your period data and fee structure here to see real-time
          updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Period Data */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Period Data</h3>
          <div className="space-y-1">
            <Label htmlFor="total-sales" className="text-xs font-medium">
              Total Monthly Sales
            </Label>
            <div className="relative">
              <Input
                id="total-sales"
                type="number"
                value={totalSales}
                onChange={(e) => handleTotalSalesChange(e.target.value)}
                className="pr-12 text-base font-bold"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                $
              </span>
              <Dialog
                open={isWeeklySalesDialogOpen}
                onOpenChange={setIsWeeklySalesDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Enter Weekly Sales for {activePeriod.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {localWeeklySales.map((sale, index) => (
                      <InputField
                        key={index}
                        id={`weekly-sale-${index}`}
                        label={`Week ${index + 1} Sales`}
                        value={sale}
                        onChange={(v) => handleLocalWeeklySaleChange(index, v)}
                        unit="$"
                      />
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancelWeeklySales}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveWeeklySales}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="inventory-cost" className="text-xs font-medium">
              Inventory Cost
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  id="inventory-cost"
                  type="number"
                  value={activePeriod.inventoryCost}
                  onChange={(e) =>
                    onPeriodChange(
                      activePeriod.id,
                      "inventoryCost",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="pr-12 text-base font-semibold"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                  {activePeriod.inventoryCostType === "amount" ? "$" : "%"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="inventory-cost-type"
                  className="text-sm font-normal"
                >
                  $
                </Label>
                <Switch
                  id="inventory-cost-type"
                  checked={activePeriod.inventoryCostType === "percent"}
                  onCheckedChange={handleInventoryCostTypeChange}
                />
                <Label
                  htmlFor="inventory-cost-type"
                  className="text-sm font-normal"
                >
                  %
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Franchise Fees */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Franchise Fees</h3>
          <div className="space-y-1">
            <Label htmlFor="royalty-fee" className="text-xs font-medium">
              Royalty Fee
            </Label>
            <div className="relative">
              <Input
                id="royalty-fee"
                type="number"
                value={feeConfig.royaltyPercent}
                onChange={(e) =>
                  onFeeChange("royaltyPercent", parseFloat(e.target.value) || 0)
                }
                className="pr-12 text-base font-semibold"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="total-additional-fees"
              className="text-xs font-medium"
            >
              Additional Franchisee Fees
            </Label>
            <div className="relative">
              <Input
                id="total-additional-fees"
                type="number"
                value={totalOtherExpenses}
                onChange={(e) => handleTotalOtherExpensesChange(e.target.value)}
                className="pr-12 text-base font-semibold"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                $
              </span>
              <Dialog
                open={isFeesDialogOpen}
                onOpenChange={setIsFeesDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Additional Franchisee Fees</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 rounded-lg border p-4 max-h-60 overflow-y-auto">
                    {localOtherExpenses.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No fees added yet.
                      </p>
                    )}
                    {localOtherExpenses.map((exp) => (
                      <div key={exp.id} className="flex items-center gap-2">
                        <Input
                          value={exp.name}
                          onChange={(e) =>
                            handleUpdateExpense(exp.id, "name", e.target.value)
                          }
                          className="text-sm"
                          placeholder="Fee Name"
                        />
                        <div className="relative w-32">
                          <Input
                            type="number"
                            value={exp.amount}
                            onChange={(e) =>
                              handleUpdateExpense(
                                exp.id,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="text-sm pr-8"
                            placeholder="Amount"
                            step="0.01"
                          />
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm">
                            $
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExpense(exp.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleAddExpense}
                    className="mt-4 flex items-end gap-2 border-t pt-4"
                  >
                    <div className="flex-grow">
                      <Label
                        htmlFor="new-expense-name"
                        className="text-xs font-medium"
                      >
                        New Fee Name
                      </Label>
                      <Input
                        id="new-expense-name"
                        placeholder="e.g., Tech Fee"
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label
                        htmlFor="new-expense-amount"
                        className="text-xs font-medium"
                      >
                        Amount
                      </Label>
                      <Input
                        id="new-expense-amount"
                        type="number"
                        placeholder="$"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <Button type="submit" size="icon">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </form>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsFeesDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveFees}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
