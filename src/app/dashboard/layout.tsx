// src/app/dashboard/layout.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/")
  }

  return <DashboardSidebar>{children}</DashboardSidebar>
}