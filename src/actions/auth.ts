"use server";

import { prisma } from "@/config/prisma";
import jwt from "jsonwebtoken";
import { addMinutes, isAfter } from "date-fns";
import bcrypt from "bcryptjs";

export async function checkUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return { error: "No existe una cuenta para el correo ingresado" };
  }

  return user;
}

export async function generateResetToken(
  email: string,
  userId: string,
  checkOnly: boolean = false
) {
  // Buscar el registro más reciente para el email
  const lastToken = await prisma.passwordResetToken.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  // Verificar si hay un cooldown activo
  const cooldownSeconds = 60 * 1000; // 60 segundos
  if (lastToken && lastToken.lastSentAt) {
    const now = Date.now();
    const timeSinceLastSent = now - Number(lastToken.lastSentAt);
    if (timeSinceLastSent < cooldownSeconds) {
      if (checkOnly) {
        return {
          cooldownRemaining: Math.ceil(
            (cooldownSeconds - timeSinceLastSent) / 1000
          ),
        };
      }
      return { error: "Debes esperar antes de solicitar un nuevo código" };
    }
  }

  if (checkOnly) {
    return { cooldownRemaining: 0 };
  }

  // Eliminar tokens anteriores para el usuario
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  const code = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => (b % 10).toString())
    .join("");

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET no está configurado en las variables de entorno"
    );
  }

  const token = jwt.sign(
    { userId, email, type: "password_reset_initial" },
    jwtSecret,
    { expiresIn: "15m" }
  );

  const expires = addMinutes(new Date(), 15);
  const lastSentAt = BigInt(Date.now());

  const newToken = await prisma.passwordResetToken.create({
    data: {
      userId,
      code,
      token,
      email,
      expires,
      lastSentAt,
    },
  });

  return {
    code: newToken.code,
    token: newToken.token,
    expires: newToken.expires,
  };
}

export async function validateResetCode(email: string, code: string) {
  try {
    // 1. Buscar el token por email + código + no expirado
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        code,
        expires: {
          gt: new Date(), // que NO esté expirado
        },
      },
      orderBy: {
        createdAt: "desc", // el más reciente
      },
    });

    if (!resetToken) {
      return { error: "Código inválido, ya utilizado o expirado" };
    }

    // 2. Verificar que el JWT original siga siendo válido
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET no está configurado en las variables de entorno"
      );
    }

    try {
      jwt.verify(resetToken.token, jwtSecret);
    } catch (error) {
      console.error("[validateResetCode] JWT inválido:", error);
      return { error: "Token inválido o expirado" };
    }

    // 3. Generar un NUEVO token para cambiar contraseña (30 min)
    const newToken = jwt.sign(
      { userId: resetToken.userId, email, type: "password_reset_final" },
      jwtSecret,
      { expiresIn: "30m" }
    );

    const newExpires = addMinutes(new Date(), 30);

    // 4. Actualizar el registro: marcar como usado (usamos un truco con expires en el pasado)
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: {
        isValidated: true,
      },
    });

    // Opcional: invalidar todos los demás códigos del usuario
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: resetToken.userId,
        id: { not: resetToken.id },
      },
      data: {
        expires: new Date(0), // expirados
      },
    });

    return {
      success: true,
      email: resetToken.email,
      token: newToken,
    };
  } catch (error) {
    console.error("[validateResetCode] Error:", error);
    return { error: "Error interno al validar el código" };
  }
}

export async function updatePasswordWithToken(
  email: string,
  token: string,
  newPassword: string
) {
  const jwtSecret = process.env.JWT_SECRET!;
  let payload: any;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (error) {
    return { error: "Token inválido o expirado" };
  }

  if (payload.type !== "password_reset_final" || payload.email !== email) {
    return { error: "Token no válido" };
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: payload.userId,
      email,
      isValidated: true,
      isUsed: false,
      expires: { gt: new Date() },
    },
  });

  if (!resetToken) {
    return { error: "Token no validado, ya utilizado o expirado" };
  }

  await prisma.user.update({
    where: { email },
    data: { password: await bcrypt.hash(newPassword, 12) },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { isUsed: true, usedAt: new Date() },
  });

  return { success: true };
}
