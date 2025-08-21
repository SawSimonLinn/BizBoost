"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2, Users, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { StaffCost } from "@/types";
import { formatCurrency } from "@/lib/utils";

const staffCostSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  paymentType: z.enum(['hourly', 'salary']),
  hours: z.number().optional(),
  wageRate: z.number().optional(),
  salary: z.number().optional(),
}).refine(data => {
    if (data.paymentType === 'hourly') {
        return data.hours !== undefined && data.hours > 0 && data.wageRate !== undefined && data.wageRate > 0;
    }
    if (data.paymentType === 'salary') {
        return data.salary !== undefined && data.salary > 0;
    }
    return false;
}, {
    message: "Please provide valid details for the selected payment type.",
    path: ['hours'] 
});


const StaffCostForm = ({ 
    onSave, 
    onClose, 
    defaultValues 
}: { 
    onSave: (data: StaffCost) => void;
    onClose: () => void;
    defaultValues: Partial<StaffCost>;
}) => {
    const { control, handleSubmit, reset } = useForm<z.infer<typeof staffCostSchema>>({
        resolver: zodResolver(staffCostSchema),
        defaultValues: {
            employeeName: defaultValues.employeeName ?? "",
            paymentType: defaultValues.paymentType ?? 'hourly',
            hours: defaultValues.hours ?? 0,
            wageRate: defaultValues.wageRate ?? 0,
            salary: defaultValues.salary ?? 0,
        },
    });
    
    const paymentType = useWatch({ control, name: 'paymentType' });

    const onSubmit = (data: z.infer<typeof staffCostSchema>) => {
        onSave({
            id: defaultValues.id || `staff-${Date.now()}`,
            ...data,
        });
        reset();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="employeeName">Employee Name</Label>
            <Controller
              name="employeeName"
              control={control}
              render={({ field }) => <Input {...field} id="employeeName" />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="paymentType">Hourly</Label>
            <Controller
               name="paymentType"
               control={control}
               render={({ field }) => (
                 <Switch
                    id="paymentType"
                    checked={field.value === 'salary'}
                    onCheckedChange={(checked) => field.onChange(checked ? 'salary' : 'hourly')}
                  />
               )}
            />
            <Label htmlFor="paymentType">Monthly Salary</Label>
          </div>

          {paymentType === 'hourly' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Controller
                  name="hours"
                  control={control}
                  render={({ field }) => <Input {...field} id="hours" type="number" step="0.5" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />}
                />
              </div>
              <div>
                <Label htmlFor="wageRate">Wage Rate ($/hr)</Label>
                <Controller
                  name="wageRate"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="wageRate" type="number" step="0.01" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                  )}
                />
              </div>
            </div>
          ) : (
             <div>
                <Label htmlFor="salary">Monthly Salary</Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="salary" type="number" step="0.01" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                  )}
                />
              </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
    )
}

export function StaffScheduler({ staffCosts, setStaffCosts }: { staffCosts: StaffCost[]; setStaffCosts: React.Dispatch<React.SetStateAction<StaffCost[]>> }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCost, setEditingCost] = React.useState<StaffCost | null>(null);

  const handleSave = (data: StaffCost) => {
    if (editingCost) {
        setStaffCosts(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
        setStaffCosts(prev => [...prev, data]);
    }
    closeDialog();
  };
  
  const handleRemove = (id: string) => {
    setStaffCosts(staffCosts.filter((cost) => cost.id !== id));
  };
  
  const openDialog = (cost: StaffCost | null = null) => {
    setEditingCost(cost);
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setEditingCost(null);
    setIsDialogOpen(false);
  }

  const totalWageCost = staffCosts.reduce(
    (acc, cost) => {
        if (cost.paymentType === 'hourly') {
            return acc + (cost.hours ?? 0) * (cost.wageRate ?? 0);
        }
        return acc + (cost.salary ?? 0);
    }, 0
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline flex items-center gap-2"><Users />Staff Costs & Scheduling</CardTitle>
          <CardDescription>
            Manage shifts and see the impact on your costs. Total:{" "}
            <span className="font-bold text-primary">{formatCurrency(totalWageCost)}</span>
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffCosts.map((cost) => {
              const costValue = cost.paymentType === 'hourly' 
                ? (cost.hours ?? 0) * (cost.wageRate ?? 0)
                : cost.salary ?? 0;

              return (
                 <TableRow key={cost.id}>
                    <TableCell>{cost.employeeName}</TableCell>
                    <TableCell className="capitalize">{cost.paymentType}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(costValue)}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(cost)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(cost.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                </TableRow>
              )
            })}
             {staffCosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No staff costs added for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCost ? 'Edit' : 'Add'} Staff Cost</DialogTitle>
            </DialogHeader>
            <StaffCostForm 
              onSave={handleSave} 
              onClose={closeDialog} 
              defaultValues={editingCost || { paymentType: 'hourly' }} 
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}