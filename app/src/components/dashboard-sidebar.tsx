"use client";

import {
  PackageOpen,
  Home,
  UserPen,
  Users,
  Box,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
  useSidebar, // 👈 importado para detectar si está colapsado
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isAdmin = session?.user?.role === "ADMIN";

  const menuItems = [
    { name: "Inicio", icon: Home, href: "/dashboard" },
    ...(isAdmin
      ? [{ name: "Agentes", icon: UserPen, href: "/dashboard/agentes" }]
      : []),
    { name: "Registro", icon: Users, href: "/dashboard/registro" },
    { name: "Almacén", icon: Box, href: "/dashboard/almacen" },
    { name: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
  ];

  const SidebarNavContent = () => (
    <>
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-sidebar p-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <PackageOpen className="h-5 w-5 text-red-400" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold tracking-tight">Inventario</h1>
          )}
        </div>
        {!isCollapsed && <ThemeToggle />}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Navegación
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? item.name : undefined}
                      className={`${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/60"
                      } rounded-lg px-4 py-5 transition-all duration-200`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 bg-sidebar backdrop-blur-md p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive bg-primary/80 hover:bg-destructive/80 transition-all duration-200"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 text-primary-foreground" />
              {!isCollapsed && (
                <span className="text-primary-foreground">Cerrar sesión</span>
              )}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsible="icon"
        className="hidden sm:flex shadow-lg border-r border-border/40 bg-background/80 backdrop-blur-lg"
      >
        <SidebarNavContent />
        <SidebarRail />
      </Sidebar>

      <Sheet>
        <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-linear-to-b from-primary/20 to-primary/5 backdrop-blur-xl px-4 shadow-md lg:hidden rounded-b-2xl border-b border-primary/10">
          <span className="text-sm font-semibold text-foreground/90 tracking-tight">
            Sistema de inventario
          </span>

          <SidebarTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-xl shadow-lg border border-primary/20 text-primary-foreground/80 transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:text-primary-foreground hover:shadow-xl hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SidebarTrigger>
        </div>

        <SheetContent
          side="left"
          className="w-72 p-0 bg-background/95 backdrop-blur-xl"
        >
          <Sidebar collapsible="none">
            <SidebarNavContent />
          </Sidebar>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 transition-all">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
