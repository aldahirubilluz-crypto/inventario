"use client";

import {
  PackageOpen,
  Home,
  Users,
  Box,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-provider";

const menuItems = [
  { name: "Inicio", icon: Home, href: "/dashboard" },
  { name: "Registro", icon: Users, href: "/dashboard/registro" },
  { name: "Almacén", icon: Box, href: "/dashboard/almacen" },
  { name: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex flex-row items-center gap-2">
            <PackageOpen className="text-primary" size={28} />
            <h1 className="text-xl font-bold text-foreground">Inventario</h1>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(({ name, icon: Icon, href }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/dashboard/"
                : pathname.startsWith(href + "/") || pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{name}</span>

                {!isActive && (
                  <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex px-4 py-4 border-t border-border space-y-4">
          <button className="flex w-full justify-center items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/20 transition-all duration-200 group">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <PackageOpen className="text-primary" size={24} />
            <span className="text-lg font-semibold">Inventario</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={22} />
          </Button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-muted/20">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
