"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { suggestFocusAreas } from "@/ai/flows/suggest-focus-areas-flow";
import { Target } from "lucide-react";

interface FocusAreasCardProps {
  periodsData: string;
}

export function FocusAreasCard({ periodsData }: FocusAreasCardProps) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestion("");
    try {
      const result = await suggestFocusAreas({ periodsData });
      setSuggestion(result.focusAreaSuggestion);
    } catch (error) {
      console.error("Error suggesting focus areas:", error);
      toast({
        title: "Error",
        description: "Failed to generate focus area suggestions. Please try again.",
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
          <div className="bg-primary/10 p-2 rounded-full">
            <Target className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Focus Areas</CardTitle>
            <CardDescription>Get suggestions for what to focus on.</CardDescription>
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
        {suggestion && <p className="text-sm text-muted-foreground">{suggestion}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? "Suggesting..." : "Suggest Focus"}
        </Button>
      </CardFooter>
    </Card>
  );
}
