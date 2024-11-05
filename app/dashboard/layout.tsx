"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold"></h1>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
