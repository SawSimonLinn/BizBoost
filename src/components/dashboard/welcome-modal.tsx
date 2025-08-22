
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pencil, FilePenLine } from 'lucide-react';
import type { Period, FeeConfig } from '@/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePeriod: Period;
  onPeriodChange: (periodId: string, field: keyof Period, value: any) => void;
  feeConfig: FeeConfig;
  onFeeChange: (field: keyof FeeConfig, value: number) => void;
  totalSales: number;
}

const InputField = ({ id, label, value, onChange, unit, type = "number", className, disabled = false }: { id: string; label: string; value: number | string; onChange: (value: string) => void; unit: string, type?: string, className?: string, disabled?: boolean }) => (
    <div className={("space-y-1 " + className)}>
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12 text-base font-semibold"
          disabled={disabled}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

export function WelcomeModal({ 
  isOpen, onClose, activePeriod, onPeriodChange, feeConfig, onFeeChange, totalSales 
}: WelcomeModalProps) {
  
  const [isWeeklySalesDialogOpen, setIsWeeklySalesDialogOpen] = React.useState(false);
  const [localWeeklySales, setLocalWeeklySales] = React.useState<(string|number)[]>(activePeriod.weeklySales);
  const [numWeeks, setNumWeeks] = React.useState(activePeriod.weeklySales.length.toString());


  React.useEffect(() => {
    setLocalWeeklySales(activePeriod.weeklySales);
    setNumWeeks(activePeriod.weeklySales.length.toString());
  }, [activePeriod]);

  const handleTotalSalesChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;

    const currentNumWeeks = activePeriod.weeklySales.length || 1;
    const evenSplit = numericValue / currentNumWeeks;
    const newWeeklySales = value === '' ? Array(currentNumWeeks).fill(0) : Array(currentNumWeeks).fill(evenSplit);
    onPeriodChange(activePeriod.id, 'weeklySales', newWeeklySales);
  };
  
  const handleInventoryCostTypeChange = (checked: boolean) => {
    onPeriodChange(activePeriod.id, 'inventoryCostType', checked ? 'percent' : 'amount');
  }

  const handleLocalWeeklySaleChange = (index: number, value: string) => {
    const newWeeklySales = [...localWeeklySales];
    newWeeklySales[index] = value;
    setLocalWeeklySales(newWeeklySales);
  };

  const handleSaveWeeklySales = () => {
    const newSales = localWeeklySales.map(s => parseFloat(s as string) || 0);
    onPeriodChange(activePeriod.id, 'weeklySales', newSales);
    setIsWeeklySalesDialogOpen(false);
  };

  const handleWeekCountChange = (value: string) => {
    const newWeekCount = parseInt(value, 10);
    setNumWeeks(value);

    const oldTotal = localWeeklySales.map(s => parseFloat(s as string) || 0).reduce((a,b) => a+b, 0);
    const newWeeklyAverage = newWeekCount > 0 ? oldTotal / newWeekCount : 0;
    const newWeeklySales = Array(newWeekCount).fill(newWeeklyAverage);

    setLocalWeeklySales(newWeeklySales);
  }

  const totalSalesDisplay = totalSales === 0 ? '' : totalSales;
  const royaltyPercentDisplay = feeConfig.royaltyPercent === 0 ? '' : feeConfig.royaltyPercent;
  const inventoryCostDisplay = activePeriod.inventoryCost === 0 ? '' : activePeriod.inventoryCost;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-xl">
             <FilePenLine />
             Welcome to BizBoost!
          </DialogTitle>
          <DialogDescription>
            Let's get started by entering some key figures for your business.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <div className="space-y-1">
                <Label htmlFor="total-sales" className="text-sm font-medium">Total Monthly Sales</Label>
                <div className="relative">
                <Input 
                    id="total-sales"
                    type="number"
                    value={totalSalesDisplay} 
                    onChange={(e) => handleTotalSalesChange(e.target.value)}
                    className="pr-12 text-base font-bold" 
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">$</span>
                <Dialog open={isWeeklySalesDialogOpen} onOpenChange={setIsWeeklySalesDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Enter Weekly Sales</DialogTitle>
                        </DialogHeader>
                        <div className='py-4 space-y-4'>
                          <div>
                            <Label>Number of weeks in period</Label>
                            <RadioGroup value={numWeeks} onValueChange={handleWeekCountChange} className="flex gap-4 mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4" id="r1" />
                                <Label htmlFor="r1">4 Weeks</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="5" id="r2" />
                                <Label htmlFor="r2">5 Weeks</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="ghost" onClick={() => setIsWeeklySalesDialogOpen(false)}>Cancel</Button>
                          <Button type="button" onClick={handleSaveWeeklySales}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
            </div>

            <InputField 
                id="royalty-fee"
                label="Your Percentage (%)"
                value={royaltyPercentDisplay}
                onChange={(v) => onFeeChange('royaltyPercent', parseFloat(v) || 0)}
                unit="%"
            />

            <div className="space-y-1">
                <Label htmlFor="inventory-cost" className="text-sm font-medium">Inventory Cost</Label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Input
                        id="inventory-cost"
                        type="number"
                        value={inventoryCostDisplay}
                        onChange={(e) => onPeriodChange(activePeriod.id, 'inventoryCost', parseFloat(e.target.value) || 0)}
                        className="pr-12 text-base font-semibold"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                            {activePeriod.inventoryCostType === 'amount' ? '$' : '%'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                        <Label htmlFor="inventory-cost-type" className="text-sm font-normal">$</Label>
                        <Switch
                            id="inventory-cost-type"
                            checked={activePeriod.inventoryCostType === 'percent'}
                            onCheckedChange={handleInventoryCostTypeChange}
                        />
                            <Label htmlFor="inventory-cost-type" className="text-sm font-normal">%</Label>
                    </div>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    