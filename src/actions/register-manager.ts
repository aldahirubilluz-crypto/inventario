// actions/register-manager.ts
"use server";

import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getManagerActions() {
  try {
    const managers = await prisma.user.findMany({
      where: { rol: "MANAGER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
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

export async function updateManagerAction(data: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Acceso denegado. Solo administradores." };
  }
  try {
    const existingManager = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!existingManager) {
      return { success: false, error: "Manager no encontrado." };
    }

    let hashedPassword: string | undefined;
    if (data.password && data.password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

    const updatedManager = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name?.trim() ?? existingManager.name,
        email: data.email?.toLowerCase().trim() ?? existingManager.email,
        phone: data.phone?.trim() ?? existingManager.phone,
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true,
      },
    });

    revalidatePath("/agentes");

    return { success: true, data: updatedManager };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "El correo ya está en uso." };
    }
    console.error("Error al actualizar manager:", error);
    return { success: false, error: "Error inesperado al editar el manager." };
  }
}

export async function toggleSuspendManagerAction(id: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Acceso denegado. Solo administradores." };
  }

  try {
    const manager = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true, name: true },
    });

    if (!manager) {
      return { success: false, error: "Manager no encontrado." };
    }

    const newStatus = !manager.isActive;

    await prisma.user.update({
      where: { id },
      data: { isActive: newStatus },
    });

    revalidatePath("/agentes");

    return {
      success: true,
      message: `El manager ${manager.name ?? ""} fue ${
        newStatus ? "activado" : "desactivado"
      } correctamente.`,
    };
  } catch (error) {
    console.error("Error al suspender/activar manager:", error);
    return { success: false, error: "Error inesperado al cambiar estado." };
  }
}
export async function deleteManagerAction(id: string) {
  try {
    const existingManager = await prisma.user.findUnique({
      where: { id },
      select: { id: true, rol: true },
    });

    if (!existingManager) {
      return { success: false, error: "Manager no encontrado." };
    }

    if (existingManager.rol === "ADMIN") {
      return { success: false, error: "No puedes eliminar un administrador." };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/agentes");

    return { success: true, message: "Manager eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar manager:", error);
    return { success: false, error: "Error inesperado al eliminar manager." };
  }
}

export async function resetManagerPasswordAction(id: string) {
  try {
    const existingManager = await prisma.user.findUnique({
      where: { id },
      select: { id: true, rol: true },
    });

    if (!existingManager) {
      return { success: false, error: "Manager no encontrado." };
    }

    if (existingManager.rol === "ADMIN") {
      return {
        success: false,
        error: "No puedes restablecer la contraseña de un administrador.",
      };
    }

    const newPassword = "12345678";
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    revalidatePath("/agentes");

    return { success: true, message: "Contraseña restablecida a '12345678'." };
  } catch (error) {
    console.error("Error al restablecer contraseña del manager:", error);
    return {
      success: false,
      error: "Error inesperado al restablecer la contraseña.",
    };
  }
}

