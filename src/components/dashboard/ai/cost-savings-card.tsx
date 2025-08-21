"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeCostSavings, type AnalyzeCostSavingsInput } from "@/ai/flows/analyze-cost-savings-flow";
import { Coins } from "lucide-react";

interface CostSavingsCardProps {
  costAnalysisData: AnalyzeCostSavingsInput;
}

export function CostSavingsCard({ costAnalysisData }: CostSavingsCardProps) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestion("");
    try {
      const result = await analyzeCostSavings(costAnalysisData);
      setSuggestion(result.suggestions);
    } catch (error) {
      console.error("Error analyzing cost savings:", error);
      toast({
        title: "Error",
        description: "Failed to generate cost-saving suggestions. Please try again.",
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
          <div className="bg-accent/10 p-2 rounded-full">
            <Coins className="text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Cost-Saving Tips</CardTitle>
            <CardDescription>Identify opportunities to cut costs.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {suggestion && 
            <div 
                className="text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1" 
                dangerouslySetInnerHTML={{ __html: suggestion }} 
            />
        }
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? "Analyzing..." : "Analyze Costs"}
        </Button>
      </CardFooter>
    </Card>
  );
}
