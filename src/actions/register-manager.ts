// actions/register-manager.ts
"use server";

import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Obtener todos los managers
export async function getManagerActions() {
  try {
    const managers = await prisma.user.findMany({
      where: { rol: "MANAGER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return managers;
  } catch (error) {
    console.error("Error fetching managers:", error);
    return [];
  }
}


export async function createManagerAction(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Acceso denegado. Solo administradores." };
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newManager = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        phone: data.phone?.trim() || null,
        rol: "MANAGER",
        isActive: true,
      },
      select: { id: true, email: true, name: true },
    });

    // Revalidar la página para ver el nuevo manager
    revalidatePath("/agentes");

    return { success: true, data: newManager };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Este correo ya está registrado." };
    }
    console.error("Error creando manager:", error);
    return { success: false, error: "Error inesperado al crear el manager." };
  }
}