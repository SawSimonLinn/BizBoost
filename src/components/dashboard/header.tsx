

import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Period } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  periods: Period[];
  activePeriod: Period;
  onSetActivePeriod: (id: string) => void;
}

export function DashboardHeader({ 
  periods,
  activePeriod,
  onSetActivePeriod,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex-grow">
          <h1 className="text-2xl font-bold font-headline text-foreground">
          Franchise Performance Dashboard
          </h1>
          <p className="text-muted-foreground">
          Showing data for: <span className="font-semibold text-foreground">{activePeriod.name}</span>
          </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={activePeriod.id} onValueChange={onSetActivePeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select a period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  )
}
