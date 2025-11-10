"use client"

import {
  PackageOpen,
  Home,
  UserPen,
  Users,
  Box,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-provider"
import { signOut, useSession } from "next-auth/react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardSidebar({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"
  const [open, setOpen] = useState(false)

  const menuItems = [
    { name: "Inicio", icon: Home, href: "/dashboard" },
    ...(isAdmin ? [{ name: "Agentes", icon: UserPen, href: "/dashboard/agentes" }] : []),
    { name: "Registro", icon: Users, href: "/dashboard/registro" },
    { name: "Almacén", icon: Box, href: "/dashboard/almacen" },
    { name: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
  ]

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div className="flex items-center gap-3">
          <PackageOpen className="text-primary" size={28} />
          <h1 className="text-xl font-bold">Inventario</h1>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map(({ name, icon: Icon, href }) => {
          // RESALTADO EXACTO: solo la ruta actual
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon size={18} />
              {name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t px-4 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={18} className="mr-3" />
          Cerrar sesión
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-card border-r">
        <NavContent />
      </aside>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Contenido */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageOpen className="text-primary" size={24} />
              <span className="text-lg font-semibold">Inventario</span>
            </div>
            <ThemeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}