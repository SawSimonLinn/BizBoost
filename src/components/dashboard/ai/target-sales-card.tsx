"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateTargetSales } from "@/ai/flows/generate-target-sales-flow";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TargetSalesCardProps {
  pastSalesData: string;
}

export function TargetSalesCard({ pastSalesData }: TargetSalesCardProps) {
  const [desiredPay, setDesiredPay] = useState(8000);
  const [targetSales, setTargetSales] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (desiredPay <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid desired take-home pay.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setTargetSales(null);
    setReasoning("");
    try {
      const result = await generateTargetSales({
        pastSalesData,
        desiredTakeHomePay: desiredPay,
      });
      setTargetSales(result.targetSales);
      setReasoning(result.reasoning);
    } catch (error) {
      console.error("Error generating target sales:", error);
      toast({
        title: "Error",
        description: "Failed to generate target sales. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
         <div className="flex items-center gap-3">
          <div className="bg-success/10 p-2 rounded-full">
            <TrendingUp className="text-success" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Target Sales</CardTitle>
            <CardDescription>Set a goal to reach your desired pay.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <Label htmlFor="desiredPay" className="text-xs">Desired Monthly Take-Home</Label>
          <Input
            id="desiredPay"
            type="number"
            value={desiredPay}
            onChange={(e) => setDesiredPay(Number(e.target.value))}
            placeholder="e.g., 8000"
            className="mt-1"
          />
        </div>
        {loading && <Skeleton className="h-20 w-full" />}
        {targetSales !== null && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Suggested Target Sales</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(targetSales)}</p>
            <p className="text-xs text-muted-foreground mt-2">{reasoning}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Generate Target"}
        </Button>
      </CardFooter>
    </Card>
  );
}
