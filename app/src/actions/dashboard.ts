"use server";

import { prisma } from "@/config/prisma";


export async function getDashboardData() {
  const totalUsers = await prisma.user.count();

  const lastUsers = await prisma.user.findMany({
    orderBy: { lastLogin: "desc" },
    take: 5,
    select: { name: true, email: true, lastLogin: true },
  });

  const totalAssets = await prisma.asset.count();

  const assetsByDate = await prisma.asset.groupBy({
    by: ["registrationDate"],
    _count: { id: true },
    orderBy: { registrationDate: "asc" },
  });

  const formattedChartData = assetsByDate.map((item) => ({
    day: item.registrationDate.toISOString().split("T")[0],
    registrados: item._count.id,
  }));

  return {
    totalUsers,
    lastUsers,
    totalAssets,
    chartData: formattedChartData,
  };
}
