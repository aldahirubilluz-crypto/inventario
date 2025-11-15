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
  FileText,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
type Office = "OTIC" | "PATRIMONIO" | "ABASTECIMIENTO";

interface MenuItem {
  name: string;
  icon: typeof Home;
  href: string;
  allowedRoles: UserRole[];
  allowedOffices?: Office[];
}

const hasAccess = (
  item: MenuItem,
  userRole: UserRole | undefined,
  userOffice: Office | null | undefined
): boolean => {
  if (!userRole) return false;
  if (!item.allowedRoles.includes(userRole)) return false;

  if (userRole === "ADMIN") return true;

  if (!item.allowedOffices || item.allowedOffices.length === 0) return true;
  if (!userOffice) return false;
  return item.allowedOffices.includes(userOffice);
};

const allMenuItems: MenuItem[] = [
  {
    name: "Inicio",
    icon: Home,
    href: "/dashboard",
    allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Agentes",
    icon: UserPen,
    href: "/dashboard/agentes",
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Registro",
    icon: Users,
    href: "/dashboard/registro",
    allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    allowedOffices: ["OTIC", "PATRIMONIO"],
  },
  {
    name: "Almacén",
    icon: Box,
    href: "/dashboard/almacen",
    allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    allowedOffices: ["OTIC", "PATRIMONIO"],
  },
  {
    name: "Documentos",
    icon: FileText,
    href: "/dashboard/documentos",
    allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    allowedOffices: ["OTIC", "PATRIMONIO"],
  },
  {
    name: "Configuración",
    icon: Settings,
    href: "/dashboard/configuracion",
    allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    allowedOffices: ["OTIC", "ABASTECIMIENTO"],
  },
];

function SidebarNavContent({
  menuItems,
  pathname,
  isCollapsed,
  session,
}: {
  menuItems: MenuItem[];
  pathname: string;
  isCollapsed: boolean;
  session: Session | null;
}) {
  return (
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
                      className={`${isActive
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

        {!isCollapsed && session?.user && (
          <div className="mt-auto px-4 py-4 border-t border-border/40">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? "Usuario"}
                />
                <AvatarFallback>
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-semibold text-foreground">
                  {session.user.name}
                </span>

                <span className="text-xs text-muted-foreground">
                  {session.user.role}
                </span>

                {session.user.office && (
                  <span className="text-xs text-muted-foreground">
                    {session.user.office}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
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
}

export default function DashboardSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const userRole = session?.user?.role as UserRole | undefined;
  const userOffice = session?.user?.office as Office | null | undefined;

  const menuItems = allMenuItems.filter((item) =>
    hasAccess(item, userRole, userOffice)
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsible="icon"
        className="hidden sm:flex shadow-lg border-r border-border/40 bg-background/80 backdrop-blur-lg"
      >
        <SidebarNavContent
          menuItems={menuItems}
          pathname={pathname}
          isCollapsed={isCollapsed}
          session={session}
        />
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
            <SidebarNavContent
              menuItems={menuItems}
              pathname={pathname}
              isCollapsed={false}
              session={session}
            />
          </Sidebar>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 transition-all">
        {children}
      </main>
    </div>
  );
}
