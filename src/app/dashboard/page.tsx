"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, AlertTriangle, TrendingUp, Box, ArrowUpRight, ArrowDownRight, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const products = [
  { id: 1, name: "Laptop Dell XPS", stock: 45, min: 10, category: "Electrónica" },
  { id: 2, name: "Silla Ergonómica", stock: 8, min: 15, category: "Muebles" },
  { id: 3, name: "Monitor 27\" 4K", stock: 22, min: 5, category: "Electrónica" },
  { id: 4, name: "Teclado Mecánico", stock: 120, min: 20, category: "Electrónica" },
];

const stockByCategory = [
  { category: "Electrónica", total: 265, low: 1 },
  { category: "Muebles", total: 11, low: 2 },
];

const recentActivity = [
  { day: "Lun", entradas: 12, salidas: 8 },
  { day: "Mar", entradas: 19, salidas: 15 },
  { day: "Mié", entradas: 8, salidas: 5 },
  { day: "Jue", entradas: 25, salidas: 18 },
  { day: "Vie", entradas: 15, salidas: 10 },
  { day: "Sáb", entradas: 5, salidas: 3 },
  { day: "Dom", entradas: 3, salidas: 2 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, change, trend, icon, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground/70">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn("text-xs flex items-center gap-1 mt-1", trend === "up" ? "text-green-600" : "text-red-600")}>
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const totalProducts = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.min).length;
  const criticalCount = products.filter(p => p.stock <= p.min * 0.5).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
        <p className="text-muted-foreground mt-1">
          Resumen en tiempo real del inventario • Actualizado hace <span className="font-medium">2 min</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Productos Totales" value={totalProducts} change="+8% vs ayer" trend="up" icon={<Package size={20} />} />
        <StatCard title="Proveedores" value="42" change="+2 nuevos" trend="up" icon={<Users size={20} />} />
        <StatCard title="Stock Bajo" value={lowStockCount} icon={<AlertTriangle size={20} />} className="border-destructive/10" />
        <StatCard title="Críticos" value={criticalCount} icon={<Warehouse size={20} />} className="border-red-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Box className="text-primary" size={20} />
                Productos en Inventario
              </span>
              <span className="text-xs font-medium text-muted-foreground">{products.length} items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/50 backdrop-blur border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Producto</th>
                    <th className="text-center p-4 font-medium">Stock</th>
                    <th className="text-center p-4 font-medium">Mínimo</th>
                    <th className="text-center p-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const isLow = product.stock <= product.min;
                    const isCritical = product.stock <= product.min * 0.5;
                    return (
                      <tr key={product.id} className="border-b hover:bg-accent/30 transition-colors">
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="text-center p-4">{product.stock}</td>
                        <td className="text-center p-4 text-muted-foreground">{product.min}</td>
                        <td className="text-center p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              isCritical
                                ? "bg-red-100 text-red-700"
                                : isLow
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            )}
                          >
                            {isCritical ? "Crítico" : isLow ? "Bajo" : "Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Movimientos (7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="entradas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="salidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Entradas</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Salidas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}