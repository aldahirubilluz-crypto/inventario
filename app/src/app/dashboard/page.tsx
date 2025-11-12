// "use client";

// import { useEffect, useState } from "react";
// import { getDashboardData } from "@/actions/dashboard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Package,
//   Users,
//   TrendingUp,
//   Calendar,
//   UserPlus,
//   BarChart3,
//   Activity,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

// export default function DashboardPage() {
//   const [data, setData] = useState<{
//     totalUsers: number;
//     lastUsers: { name: string | null; email: string; lastLogin: Date | null }[];
//     totalAssets: number;
//     chartData: { day: string; registrados: number }[];
//   } | null>(null);

//   useEffect(() => {
//     getDashboardData().then(setData);
//   }, []);

//   if (!data)
//     return (
//       <p className="text-muted-foreground animate-pulse">Cargando datos...</p>
//     );

//   return (
//     <div className="space-y-10 pt-10 sm:pt-0">
//       <div className="text-center space-y-2">
//         <h1 className="text-4xl font-bold text-primary tracking-tight">
//           Panel Principal
//         </h1>
//         <p className="text-muted-foreground">
//           Visualiza un resumen general de usuarios y activos registrados
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-linear-to-br from-primary to-primary/90 text-primary-foreground">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-white">
//               Usuarios Totales
//             </CardTitle>
//             <Users className="opacity-70" size={22} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-4xl font-bold">{data.totalUsers}</div>
//             <p className="text-sm opacity-75 mt-1">en el sistema</p>
//           </CardContent>
//           <UserPlus
//             className="absolute bottom-2 right-3 opacity-10"
//             size={60}
//           />
//         </Card>

//         <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-primary-foreground">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-primary">
//               Artículos Registrados
//             </CardTitle>
//             <Package className="text-primary" size={22} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-4xl font-bold text-black">
//               {data.totalAssets}
//             </div>
//             <p className="text-sm text-black mt-1">en inventario</p>
//           </CardContent>
//           <BarChart3
//             className="absolute bottom-2 right-3 opacity-10 text-primary"
//             size={60}
//           />
//         </Card>

//         <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-linear-to-br from-primary to-primary/90 text-primary-foreground">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-white">
//               Tendencia de Altas
//             </CardTitle>
//             <TrendingUp className="text-primary" size={22} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-sm text-primary-foreground">
//               Visualización semanal de registros de activos
//             </div>
//           </CardContent>
//           <Activity
//             className="absolute bottom-2 right-3 opacity-10"
//             size={60}
//           />
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2 border-none shadow-md hover:shadow-lg transition-all bg-primary-foreground">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg text-primary">
//               <Calendar className="text-primary" size={20} /> Altas de Activos
//               por Día
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={260}>
//               <BarChart data={data.chartData}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis dataKey="day" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip contentStyle={{ background: "#fff" }} />
//                 <Bar
//                   dataKey="registrados"
//                   fill="var(--primary)"
//                   radius={[6, 6, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="border-none shadow-md hover:shadow-lg transition-all bg-primary-foreground">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg text-primary">
//               <Users size={20} /> Últimos Usuarios
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3">
//               {data.lastUsers.map((user, i) => (
//                 <li
//                   key={i}
//                   className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition text-black"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
//                     <UserPlus size={16} />
//                   </div>
//                   <div>
//                     <p className="font-medium">
//                       {user.name || "Sin nombre"}
//                     </p>
//                     <p className="text-xs">
//                       {user.email}
//                     </p>
//                     <p className="text-xs">
//                       Último acceso:{" "}
//                       {user.lastLogin
//                         ? new Date(user.lastLogin).toLocaleString()
//                         : "—"}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client"
export default function Page () {
  return <div>Hola</div>
}