"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link';
import {
  LayoutGrid,
  Settings,
  Wallet,
  PieChart,
  Lightbulb,
} from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/personal-finances", label: "Personal Finances", icon: Wallet },
    { href: "/performance", label: "Performance", icon: PieChart },
    { href: "/ai-insights", label: "AI Insights", icon: Lightbulb },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <Logo />
            <h1 className="font-headline text-lg font-semibold text-primary">BizBoost</h1>
        </Link>
      </SidebarHeader>
      <SidebarMenu>
        {menuItems.map(item => (
            <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  )
}
