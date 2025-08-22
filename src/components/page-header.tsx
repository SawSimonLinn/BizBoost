
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
    title: string;
    children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div className="flex-grow">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            {title}
          </h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <SidebarTrigger />
      </div>
    </header>
  )
}
