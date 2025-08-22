"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, PiggyBank, Target, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PersonalExpense } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { ScrollArea } from "../ui/scroll-area";

interface TakeHomeCalculatorProps {
  netEarnings: number;
  personalExpenses: PersonalExpense[];
  setPersonalExpenses: React.Dispatch<React.SetStateAction<PersonalExpense[]>>;
  asCard?: boolean;
}

const CalculatorContent = ({
  netEarnings,
  personalExpenses,
  setPersonalExpenses,
}: Omit<TakeHomeCalculatorProps, "asCard">) => {
  const [newItem, setNewItem] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [savingsGoal, setSavingsGoal] = React.useState(10000);

  const totalPersonalExpenses = personalExpenses.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const remainingForSavings = netEarnings - totalPersonalExpenses;
  const monthsToGoal =
    savingsGoal > 0 && remainingForSavings > 0
      ? Math.ceil(savingsGoal / remainingForSavings)
      : 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem && newAmount) {
      setPersonalExpenses([
        ...personalExpenses,
        {
          id: Date.now().toString(),
          name: newItem,
          amount: parseFloat(newAmount),
        },
      ]);
      setNewItem("");
      setNewAmount("");
    }
  };

  const handleRemoveExpense = (id: string) => {
    setPersonalExpenses(personalExpenses.filter((item) => item.id !== id));
  };

  const handleUpdateExpense = (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    const numericValue =
      field === "amount" ? parseFloat(value as string) || 0 : value;
    setPersonalExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, [field]: numericValue } : exp
      )
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <Label>Net Earnings After Staff</Label>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(netEarnings)}
          </div>
        </div>
        <div className="p-4 bg-destructive/10 rounded-lg">
          <Label>Total Personal Expenses</Label>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(totalPersonalExpenses)}
          </div>
        </div>
        <div className="p-4 bg-success/10 rounded-lg">
          <Label>Remaining for Savings</Label>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(remainingForSavings)}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <h4 className="font-semibold mb-2">Personal Expenses</h4>
        <div className="max-h-64 overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {personalExpenses.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateExpense(item.id, "name", e.target.value)
                      }
                      className="h-8 border-transparent hover:border-input focus:border-input"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative max-w-[150px] ml-auto">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleUpdateExpense(item.id, "amount", e.target.value)
                        }
                        className="h-8 pr-6 border-transparent hover:border-input focus:border-input text-right"
                        step="0.01"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExpense(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {personalExpenses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No expenses added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <form
          onSubmit={handleAddExpense}
          className="mt-4 flex items-end gap-2 border-t pt-4"
        >
          <div className="flex-grow">
            <Label htmlFor="new-expense-name" className="text-xs font-medium">
              New Expense
            </Label>
            <Input
              id="new-expense-name"
              placeholder="e.g., Groceries"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Label htmlFor="new-expense-amount" className="text-xs font-medium">
              Amount
            </Label>
            <Input
              id="new-expense-amount"
              type="number"
              placeholder="$"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              step="0.01"
            />
          </div>
          <Button type="submit" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="mt-6 border-t pt-6">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Target /> Savings Goal
        </h4>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-grow min-w-[200px]">
            <Label htmlFor="savingsGoal">Goal Amount</Label>
            <Input
              id="savingsGoal"
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
            />
          </div>
          {monthsToGoal > 0 && (
            <div className="text-center p-4 bg-accent/10 rounded-lg flex-grow">
              <p className="text-sm text-muted-foreground">
                Months to reach goal
              </p>
              <p className="text-2xl font-bold text-accent">{monthsToGoal}</p>
            </div>
          )}
          {remainingForSavings <= 0 && savingsGoal > 0 && (
            <div className="text-center p-4 bg-warning/10 rounded-lg flex-grow">
              <p className="text-sm text-muted-foreground">
                Your expenses exceed your take-home pay.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export function TakeHomeCalculator({
  netEarnings,
  personalExpenses,
  setPersonalExpenses,
  asCard = true,
}: TakeHomeCalculatorProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const totalPersonalExpenses = personalExpenses.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const remainingForSavings = netEarnings - totalPersonalExpenses;

  if (asCard) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline flex items-center gap-2">
                <PiggyBank />
                Personal Finances
              </CardTitle>
              <CardDescription>Plan your savings and expenses.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Calculator</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    Personal Take-Home Calculator
                  </DialogTitle>
                  <DialogDescription>
                    Log your personal expenses to see what's left for savings.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="pr-6 -mr-6">
                  <CalculatorContent
                    netEarnings={netEarnings}
                    personalExpenses={personalExpenses}
                    setPersonalExpenses={setPersonalExpenses}
                  />
                </ScrollArea>
                <DialogFooter className="mt-auto pt-4 border-t">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">
                Net Earnings After Staff
              </span>
              <span className="font-semibold text-lg text-primary">
                {formatCurrency(netEarnings)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">
                Personal Expenses
              </span>
              <span className="font-semibold text-lg text-destructive">
                -{formatCurrency(totalPersonalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t pt-2 mt-2">
              <span className="text-sm font-bold">REMAINDER FOR SAVINGS</span>
              <span className="font-bold text-xl text-success">
                {formatCurrency(remainingForSavings)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <PiggyBank />
          Personal Finances
        </CardTitle>
        <CardDescription>
          Log your personal expenses to see what's left for savings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CalculatorContent
          netEarnings={netEarnings}
          personalExpenses={personalExpenses}
          setPersonalExpenses={setPersonalExpenses}
        />
      </CardContent>
    </Card>
  );
}
