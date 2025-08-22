
"use client"

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Period, FeeConfig } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/context/i18n-context";

interface MonthlyInputCardProps {
    periods: Period[];
    onPeriodChange: (periodId: string, field: keyof Period, value: any) => void;
    feeConfig: FeeConfig;
}

export function MonthlyInputCard({ periods, onPeriodChange, feeConfig }: MonthlyInputCardProps) {
    const { t } = useI18n();

    const handleSalesChange = (periodId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        const period = periods.find(p => p.id === periodId);
        if (!period) return;

        const numWeeks = period.weeklySales.length || 4;
        const evenSplit = numericValue / numWeeks;
        const newWeeklySales = value === '' ? Array(numWeeks).fill(0) : Array(numWeeks).fill(evenSplit);
        onPeriodChange(periodId, 'weeklySales', newWeeklySales);
    };

    const handleInventoryCostChange = (periodId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        onPeriodChange(periodId, 'inventoryCost', numericValue);
    };
    
    const handleInventoryCostTypeChange = (periodId: string, checked: boolean) => {
        const newType = checked ? 'percent' : 'amount';
        const newCost = newType === 'percent' ? 22 : 0;
        onPeriodChange(periodId, 'inventoryCostType', newType);
        onPeriodChange(periodId, 'inventoryCost', newCost);
    }

    const handleOtherExpensesChange = (periodId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        const newOtherExpenses = value === '' ? [] : [{ id: 'misc', name: 'Miscellaneous', amount: numericValue }];
        onPeriodChange(periodId, 'otherExpenses', newOtherExpenses);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("Monthly Data Input")}</CardTitle>
                <CardDescription>{t("Enter or update your financial data for each month of the year.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("Month")}</TableHead>
                            <TableHead className="text-right">{t("Total Sales")}</TableHead>
                            <TableHead className="text-right">{t("Inventory Cost")}</TableHead>
                            <TableHead className="text-right">{t("Additional Fees")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {periods.map(period => {
                            const totalSales = period.weeklySales.reduce((a, b) => a + b, 0);
                            const totalOtherExpenses = period.otherExpenses.reduce((a, b) => a + b.amount, 0);
                            const totalSalesDisplay = totalSales === 0 ? '' : totalSales;
                            const inventoryCostDisplay = period.inventoryCost === 0 ? '' : period.inventoryCost;
                            const totalOtherExpensesDisplay = totalOtherExpenses === 0 ? '' : totalOtherExpenses;


                            return (
                                <TableRow key={period.id}>
                                    <TableCell className="font-medium">{period.name}</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={totalSalesDisplay} 
                                            onChange={e => handleSalesChange(period.id, e.target.value)} 
                                            className="text-right"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end items-center gap-2">
                                            <Input 
                                                type="number" 
                                                value={inventoryCostDisplay} 
                                                onChange={e => handleInventoryCostChange(period.id, e.target.value)}
                                                className="text-right max-w-24"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <Label htmlFor={`inventory-type-${period.id}`} className="text-sm font-normal">$</Label>
                                                <Switch
                                                    id={`inventory-type-${period.id}`}
                                                    checked={period.inventoryCostType === 'percent'}
                                                    onCheckedChange={(checked) => handleInventoryCostTypeChange(period.id, checked)}
                                                />
                                                <Label htmlFor={`inventory-type-${period.id}`} className="text-sm font-normal">%</Label>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={totalOtherExpensesDisplay} 
                                            onChange={e => handleOtherExpensesChange(period.id, e.target.value)}
                                            className="text-right"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    