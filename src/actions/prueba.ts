"use server";

import { prisma } from "@/lib/prisma";


export async function getUsers() {
  try {
    const users = await prisma.usuario.findMany();
    console.log("Usuarios registrados:", users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios");
  }
}
