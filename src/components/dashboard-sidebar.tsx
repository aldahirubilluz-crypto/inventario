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
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-md p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <PackageOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Inventario</h1>
        </div>
        <ThemeToggle />
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <div>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.name}
                        className={`
                          ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/60"
                          }
                          rounded-lg px-3 py-2 transition-all duration-200
                        `}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 bg-background/60 backdrop-blur-md p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 transition-all duration-200"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-linear-to-br from-background via-background/90 to-background/70">

      <Sidebar
        collapsible="icon"
        className="hidden lg:flex shadow-lg border-r border-border/40 bg-background/80 backdrop-blur-lg"
      >
        <SidebarNavContent />
        <SidebarRail />
      </Sidebar>

      <Sheet>
        <div className="fixed right-4 top-4 z-50 lg:hidden">
          <SidebarTrigger>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md shadow-md border border-border/40"
            >
              <Menu className="h-5 w-5" />
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
