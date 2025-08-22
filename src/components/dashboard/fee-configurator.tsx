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
import { useI18n } from "@/context/i18n-context";

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
  const { t } = useI18n();
  const [isWeeklySalesDialogOpen, setIsWeeklySalesDialogOpen] =
    React.useState(false);
  const [isFeesDialogOpen, setIsFeesDialogOpen] = React.useState(false);

  const [localWeeklySales, setLocalWeeklySales] = React.useState<
    (number | string)[]
  >(activePeriod.weeklySales);
  const [localOtherExpenses, setLocalOtherExpenses] = React.useState<
    (Omit<OtherExpense, "amount"> & { amount: number | string })[]
  >(activePeriod.otherExpenses);
  const [newExpenseName, setNewExpenseName] = React.useState("");
  const [newExpenseAmount, setNewExpenseAmount] = React.useState<
    number | string
  >("");

  React.useEffect(() => {
    setLocalWeeklySales(activePeriod.weeklySales);
    setLocalOtherExpenses(activePeriod.otherExpenses);
  }, [activePeriod]);

  const handleLocalWeeklySaleChange = (index: number, value: string) => {
    const newWeeklySales = [...localWeeklySales];
    newWeeklySales[index] = value;
    setLocalWeeklySales(newWeeklySales);
  };

  const handleTotalSalesChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;

    const numWeeks = activePeriod.weeklySales.length || 1;
    const evenSplit = numericValue / numWeeks;
    const newWeeklySales = Array(numWeeks).fill(evenSplit);
    onPeriodChange(activePeriod.id, "weeklySales", newWeeklySales);
  };

  const handleSaveWeeklySales = () => {
    const newSales = localWeeklySales.map(
      (sale) => parseFloat(sale as string) || 0
    );
    onPeriodChange(activePeriod.id, "weeklySales", newSales);
    setIsWeeklySalesDialogOpen(false);
  };

  const handleCancelWeeklySales = () => {
    setLocalWeeklySales(activePeriod.weeklySales);
    setIsWeeklySalesDialogOpen(false);
  };

  const handleSaveFees = () => {
    const newExpenses = localOtherExpenses.map((exp) => ({
      ...exp,
      amount: parseFloat(exp.amount as string) || 0,
    }));
    onPeriodChange(activePeriod.id, "otherExpenses", newExpenses);
    setIsFeesDialogOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpenseName && newExpenseAmount) {
      const newExpense = {
        id: `oe-${Date.now()}`,
        name: newExpenseName,
        amount: newExpenseAmount,
      };
      setLocalOtherExpenses((prev) => [...prev, newExpense]);
      setNewExpenseName("");
      setNewExpenseAmount("");
    }
  };

  const handleUpdateExpense = (
    expenseId: string,
    field: "name" | "amount",
    value: string
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
    const numericValue = parseFloat(value) || 0;

    const newOtherExpenses: OtherExpense[] =
      value === ""
        ? []
        : [
            {
              id: `oe-misc-${Date.now()}`,
              name: "Miscellaneous Fees",
              amount: numericValue,
            },
          ];
    onPeriodChange(activePeriod.id, "otherExpenses", newOtherExpenses);
  };

  const handleInventoryCostTypeChange = (checked: boolean) => {
    const newType = checked ? "percent" : "amount";
    onPeriodChange(activePeriod.id, "inventoryCostType", newType);

    const newCost = newType === "percent" ? 22 : 0;
    onPeriodChange(activePeriod.id, "inventoryCost", newCost);
  };

  const inventoryCostDisplay =
    activePeriod.inventoryCost === 0 ? "" : activePeriod.inventoryCost;
  const totalOtherExpensesDisplay =
    totalOtherExpenses === 0 ? "" : totalOtherExpenses;
  const totalSalesDisplay = totalSales === 0 ? "" : totalSales;
  const royaltyPercentDisplay =
    feeConfig.royaltyPercent === 0 ? "" : feeConfig.royaltyPercent;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FilePenLine />
          {t("Data Input & Fee Configuration")}
        </CardTitle>
        <CardDescription>
          {t(
            "Adjust your period data and fee structure here to see real-time updates."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="total-sales" className="text-xs font-medium">
              {t("Total Monthly Sales")}
            </Label>
            <div className="relative">
              <Input
                id="total-sales"
                type="number"
                value={totalSalesDisplay}
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
                      {t("Enter Weekly Sales for")} {activePeriod.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {localWeeklySales.map((sale, index) => (
                      <InputField
                        key={index}
                        id={`weekly-sale-${index}`}
                        label={`${t("Week")} ${index + 1} ${t("Sales")}`}
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
                      {t("Cancel")}
                    </Button>
                    <Button type="button" onClick={handleSaveWeeklySales}>
                      {t("Save Changes")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="inventory-cost" className="text-xs font-medium">
              {t("Inventory Cost")}
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  id="inventory-cost"
                  type="number"
                  value={inventoryCostDisplay}
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

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="royalty-fee" className="text-xs font-medium">
              {t("Your Percentage (%)")}
            </Label>
            <div className="relative">
              <Input
                id="royalty-fee"
                type="number"
                value={royaltyPercentDisplay}
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
              {t("Additional Charges")}
            </Label>
            <div className="relative">
              <Input
                id="total-additional-fees"
                type="number"
                value={totalOtherExpensesDisplay}
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
                    <DialogTitle>{t("Edit Additional Charges")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 rounded-lg border p-4 max-h-60 overflow-y-auto">
                    {localOtherExpenses.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t("No fees added yet.")}
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
                          placeholder={t("Fee Name")}
                        />
                        <div className="relative w-32">
                          <Input
                            type="number"
                            value={exp.amount}
                            onChange={(e) =>
                              handleUpdateExpense(
                                exp.id,
                                "amount",
                                e.target.value
                              )
                            }
                            className="text-sm pr-8"
                            placeholder={t("Amount")}
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
                        {t("New Fee Name")}
                      </Label>
                      <Input
                        id="new-expense-name"
                        placeholder={t("e.g., Tech Fee")}
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label
                        htmlFor="new-expense-amount"
                        className="text-xs font-medium"
                      >
                        {t("Amount")}
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
                      {t("Cancel")}
                    </Button>
                    <Button type="button" onClick={handleSaveFees}>
                      {t("Save Changes")}
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
