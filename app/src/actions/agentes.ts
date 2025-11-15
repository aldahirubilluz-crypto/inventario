// actions/create-user.ts
"use server";

import { CreateUserParams } from "@/types/agentes";
import { sendWelcomeEmail } from "./email-actions";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


export async function createUserAction(params: CreateUserParams) {
  try {
    const response = await fetch(`${API_BASE}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": params.createdByID,
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        role: params.role,
        office: params.office,
        phone: params.phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Error al crear usuario",
      };
    }

    if (data.data?.generatedPassword) {
      await sendWelcomeEmail({
        email: params.email,
        name: params.name,
        generatedPassword: data.data.generatedPassword,
        role: params.role,
      });
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error en createUserAction:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}

export async function getUsersAction(userId: string) {
  try {
    const response = await fetch(`${API_BASE}/users/list`, {
      method: "GET",
      headers: {
        "X-User-ID": userId,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener usuarios");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error en getUsersAction:", error);
    throw error;
  }
}